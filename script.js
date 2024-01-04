let currentInput = '';
let operator = '';
let firstNumber = '';
let result = '';

const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.textContent;
    
    if (isNumber(value)) {
      currentInput += value;
      updateDisplay();
    } else if (isOperator(value)) {
      if (firstNumber === '') {
        firstNumber = currentInput;
        currentInput = '';
        operator = value;
        updateDisplay();
      } else if (currentInput !== '') {
        firstNumber = operate(parseFloat(firstNumber), parseFloat(currentInput), operator);
        currentInput = '';
        operator = value;
        updateDisplay();
      }
    } else if (value === '=') {
      if (firstNumber !== '' && currentInput !== '' && operator !== '') {
        result = operate(parseFloat(firstNumber), parseFloat(currentInput), operator);
        display.textContent = result;
        currentInput = result;
        firstNumber = '';
        operator = '';
      }
    } else if (value === 'C') {
      clear();
    }
  });
});

function updateDisplay() {
  if (operator) {
    display.textContent = `${firstNumber} ${operator} ${currentInput}`;
  } else {
    display.textContent = currentInput;
  }
}

function clear() {
  currentInput = '';
  firstNumber = '';
  operator = '';
  result = '';
  updateDisplay();
}

function isNumber(value) {
  return !isNaN(value) || value === '.';
}

function isOperator(value) {
  return value === '+' || value === '-' || value === '*' || value === '/';
}

function operate(num1, num2, operator) {
  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '*':
      return num1 * num2;
    case '/':
      if (num2 === 0) {
        return 'Error';
      }
      return num1 / num2;
    default:
      return '';
  }
}

function calculateBMI() {
  var height = parseFloat(document.getElementById("height").value);
  var weight = parseFloat(document.getElementById("weight").value);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      alert("Please enter valid height and weight values.");
      return;
  }

  var bmi = weight / ((height / 100) * (height / 100));
  var resultElement = document.getElementById("result");

  resultElement.innerHTML = "Your BMI is: " + bmi.toFixed(2);

  if (bmi < 18.5) {
      resultElement.innerHTML += "<br>Underweight";
  } else if (bmi < 25) {
      resultElement.innerHTML += "<br>Normal weight";
  } else if (bmi < 30) {
      resultElement.innerHTML += "<br>Overweight";
  } else {
      resultElement.innerHTML += "<br>Obese";
  }
}
