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

function addSubjects() {
  const subjectsContainer = document.getElementById('subjectsContainer');
  const numSubjects = document.getElementById('numSubjects').value;

  subjectsContainer.innerHTML = '';

  const table = document.createElement('table');
  table.innerHTML = `
      <tr>
          <th>Course No.</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Grade Points</th>
          <th>Credit Points</th>
      </tr>
  `;

  for (let i = 1; i <= numSubjects; i++) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td><input type="text" id="courseNo${i}" required></td>
          <td><input type="number" id="credits${i}" min="1" required></td>
          <td><input type="text" id="grade${i}" required></td>
          <td id="gradePoints${i}"></td>
          <td id="creditPoints${i}"></td>
      `;
      table.appendChild(tr);
  }

  subjectsContainer.appendChild(table);
}

function calculateSGPA() {
  const numSubjects = document.getElementById('numSubjects').value;
  let totalCreditPoints = 0;
  let totalCredits = 0;

  for (let i = 1; i <= numSubjects; i++) {
      const credits = parseInt(document.getElementById(`credits${i}`).value);
      const grade = document.getElementById(`grade${i}`).value.toUpperCase();
      let gradePoints = 0;

      switch (grade) {
          case 'A':
              gradePoints = 9;
              break;
          case 'B':
              gradePoints = 8;
              break;
          case 'C':
              gradePoints = 7;
              break;
          case 'D':
              gradePoints = 6;
              break;
          case 'E':
              gradePoints = 5;
              break;
          case 'F':
              gradePoints = 0;
              break;
          default:
              gradePoints = 0;
              break;
      }

      const creditPoints = credits * gradePoints;

      totalCreditPoints += creditPoints;
      totalCredits += credits;

      document.getElementById(`gradePoints${i}`).textContent = gradePoints.toFixed(2);
      document.getElementById(`creditPoints${i}`).textContent = creditPoints.toFixed(2);
  }

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<p>Total Credits for Semester: ${totalCredits}</p>`;
  resultDiv.innerHTML += `<p>Total Credit Points: ${totalCreditPoints}</p>`;
  resultDiv.innerHTML += `<p>Your SGPA is: ${(totalCreditPoints / totalCredits).toFixed(2)}</p>`;
}

function downloadPDF() {
  const element = document.getElementById('result');

  // Open a new window for printing
  const printWindow = window.open('', '_blank');

  // Write the HTML content to the new window
  printWindow.document.write('<html><head><title>SGPA Result</title></head><body>');
  printWindow.document.write('<style>@media print{body{visibility:hidden;}.print-section{visibility:visible;}}</style>');
  printWindow.document.write('<div class="print-section">' + element.innerHTML + '</div>');
  printWindow.document.write('</body></html>');

  // Trigger the print dialog
  printWindow.print();
  printWindow.onafterprint = function () {
      // Close the window after printing
      printWindow.close();
  };
}
