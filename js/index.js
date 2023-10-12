const sliderLength = document.getElementById('char-length');
const lengthValue = document.querySelector('.length-value');
const copyIcon = document.querySelector('.copy-icon');
const passwordField = document.querySelector('.password');
const copiedLabel = document.querySelector('.copy-label');
const checkBoxs = document.querySelectorAll('input[type=checkbox]');
const indicators = document.querySelectorAll('.indicator');
const mainForm = document.getElementById('main-form');
const strengthLabel = document.querySelector('.indicators-label');
const titleAlert = document.querySelector('.title');

let passwordLength = 0;
let optionsList = [];

document.addEventListener('DOMContentLoaded', () => {
  strengthLabel.textContent = '';
  copyIcon.addEventListener('click', () => {
    copyPassword();
  });

  // set the password length
  sliderLength.addEventListener('input', () => {
    const value =
      (sliderLength.value - sliderLength.min) /
      (sliderLength.max - sliderLength.min);
    sliderLength.style.background = `linear-gradient(to right, #a4ffaf ${
      value * 100
    }%, #18171f ${value}%)`;
    lengthValue.textContent = sliderLength.value;
    passwordLength = sliderLength.value;
  });

  // get password options
  checkBoxs.forEach((box, i) => {
    box.addEventListener('change', (e) => {
      if (e.target.checked) {
        if (!optionsList.includes(i)) {
          optionsList.push(i);
        }
      } else {
        optionsList = optionsList.filter((element) => i !== element);
      }
    });
  });
  // main form
  mainForm.addEventListener('submit', (ev) => {
    indicators.forEach((indicator) => (indicator.style.background = 'none'));
    copiedLabel.classList.remove('showCopied');
    ev.preventDefault();
    let passwordGenerated = generatePassword(passwordLength, optionsList);
    if (!passwordGenerated) {
      titleAlert.textContent =
        'Please increas the length or chose at least one option';
    } else {
      titleAlert.textContent = 'Password Generator';
      passwordField.value = passwordGenerated;
      let passwordStrength = checkStrength(passwordGenerated, passwordLength);
      for (let i = 0; i < passwordStrength; i++) {
        if (passwordStrength === 1) {
          indicators[i].style.background = '#f64a4a';
          strengthLabel.textContent = 'Too weak!';
        }
        if (passwordStrength === 2) {
          indicators[i].style.background = '#fb7c58';
          strengthLabel.textContent = 'Weak';
        }
        if (passwordStrength === 3) {
          indicators[i].style.background = '#f8cd65';
          strengthLabel.textContent = 'Medium';
        }
        if (passwordStrength === 4) {
          indicators[i].style.background = '#a4ffaf';
          strengthLabel.textContent = 'Strong';
        }
      }
    }
  });
});

// COPY PASSWORD TO CLIPBOARD
function copyPassword() {
  let inputValue = passwordField.value;
  if (inputValue) {
    try {
      navigator.clipboard
        .writeText(inputValue)
        .then(function () {
          console.log('Text copied to clipboard');
          copiedLabel.classList.add('showCopied');
        })
        .catch(function (err) {
          console.error('Failed to copy text: ', err);
        });
    } catch (err) {
      console.error('Clipboard API not available: ', err);
    }
  }
}
// GENERATE PASSWORD
function generatePassword(passwordLength, strengthIds) {
  let lengthFactors = [];
  let baseNumber = 0;
  for (let i = 0; i < passwordLength; i++) {
    baseNumber += 1;
    if (baseNumber > 1 && baseNumber < passwordLength && baseNumber % 2 === 0) {
      lengthFactors.push(baseNumber);
    }
  }
  let minPortion = Math.min(...lengthFactors);
  let maxPortion = Math.max(...lengthFactors);
  let password = '';
  const passwordChars = [
    {
      id: 0,
      chars: Array.from(Array(26))
        .map((e, i) => i + 65)
        .map((item) => String.fromCharCode(item)),
    },
    {
      id: 1,
      chars: Array.from(Array(26))
        .map((e, i) => i + 97)
        .map((item) => String.fromCharCode(item)),
    },
    { id: 2, chars: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
    {
      id: 3,
      chars: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_'],
    },
  ];

  if (strengthIds.length === 0 || passwordLength < 6) {
    return false;
  }
  strengthIds.forEach((id) => {
    if (strengthIds.length === 1) {
      password += pickChars(passwordChars[id].chars, passwordLength);
    }
    if (strengthIds.length === 2) {
      password += pickChars(passwordChars[id].chars, passwordLength / 2);
    }
    if (strengthIds.length === 3) {
      if (id < 2) {
        password += pickChars(passwordChars[id].chars, maxPortion / 2);
      } else {
        password += pickChars(passwordChars[id].chars, minPortion);
      }
    }
    if (strengthIds.length > 3) {
      if (id < 2) {
        password += pickChars(passwordChars[id].chars, maxPortion / 2);
      } else {
        password += pickChars(passwordChars[id].chars, minPortion / 2);
      }
    }
  });
  password = randomisePassword(password);
  return password;
}
// Randomlly shuffle the password chars indexes
function randomisePassword(password) {
  let passwordChars = [...password];
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }
  return passwordChars.join('');
}
// pick password chars depending on options
function pickChars(charsArr, length) {
  let charStr = '';
  for (let i = 0; i < length; i++) {
    let index = Math.floor(Math.random() * charsArr.length);
    charStr += charsArr[index];
  }
  return charStr;
}
// chack the strenegth of the password
function checkStrength(password, length) {
  let strenegth = 0;
  const testPatterns = [/[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z0-9]/];
  if (length > 5) {
    testPatterns.forEach((pattern) => {
      if (pattern.test(password)) {
        strenegth += 1;
      }
    });
    if (length < 8) {
      if (strenegth < 3) {
        strenegth = 1;
      } else {
        strenegth = 2;
      }
    }
    if (length >= 8 && length < 10) {
      if (strenegth < 3) {
        strenegth = 1;
      } else if (strenegth === 3) {
        strenegth = 1;
      } else {
        strenegth = 2;
      }
    }
    if (length >= 10 && length < 12) {
      if (strenegth < 3) {
        strenegth = 1;
      } else if (strenegth === 3) {
        strenegth = 2;
      } else {
        strenegth = 3;
      }
    }
    if (length >= 12) {
      if (strenegth < 3) {
        strenegth = 2;
      } else if (strenegth === 3) {
        strenegth = 3;
      } else {
        strenegth = 4;
      }
    }
  }

  return strenegth;
}
