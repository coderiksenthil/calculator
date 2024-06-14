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

async function calculateDistance() {
  const place1 = document.getElementById('place1').value;
  const place2 = document.getElementById('place2').value;

  if (!place1 || !place2) {
    alert("Please enter both place names");
    return;
  }

  try {
    const [coord1, coord2] = await Promise.all([getCoordinates(place1), getCoordinates(place2)]);
    const distance = calculateHaversineDistance(coord1, coord2);

    document.getElementById('result').innerHTML = `Distance: ${distance.toFixed(2)} km`;
  } catch (error) {
    alert("Error getting coordinates. Please check your place names.");
  }
}

async function getCoordinates(place) {
  const apiKey = 'YOUR_OPENCAGE_API_KEY';
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=${apiKey}`);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    return { lat, lng };
  } else {
    throw new Error("No coordinates found for the specified place.");
  }
}

function calculateHaversineDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in kilometers

  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
function appendToDisplay(value) {
  document.getElementById('display').value += value;
}

function calculate() {
  try {
      var input = document.getElementById('display').value;
      var result = eval(input.replace('sin', 'Math.sin').replace('cos', 'Math.cos').replace('tan', 'Math.tan').replace('^', '**').replace('sqrt', 'Math.sqrt'));
      document.getElementById('display').value = result;
  } catch (error) {
      document.getElementById('display').value = 'Error';
  }
}

function clearDisplay() {
  document.getElementById('display').value = '';
}

function convertTemp() {
  let fahrenheit = document.getElementById('fahrenheit').value;
  let celsius = (fahrenheit - 32) * 5 / 9;
  let kelvin = celsius + 273.15;

  if (!isNaN(celsius)) {
      document.getElementById('celsius').textContent = `Celsius: ${celsius.toFixed(2)}°C`;
  } else {
      document.getElementById('celsius').textContent = 'Celsius: Invalid input';
  }

  if (!isNaN(kelvin)) {
      document.getElementById('kelvin').textContent = `Kelvin: ${kelvin.toFixed(2)}K`;
  } else {
      document.getElementById('kelvin').textContent = 'Kelvin: Invalid input';
  }
}
function parseMatrix(matrixStr) {
  return matrixStr.trim().split('\n').map(row => row.trim().split(/\s+/).map(Number));
}

function formatMatrix(matrix) {
  return matrix.map(row => row.join('\t')).join('\n');
}

function addMatrices() {
  let matrix1 = parseMatrix(document.getElementById('matrix1').value);
  let matrix2 = parseMatrix(document.getElementById('matrix2').value);
  
  if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
      alert('Matrices must have the same dimensions.');
      return;
  }

  let result = matrix1.map((row, i) => row.map((val, j) => val + matrix2[i][j]));
  document.getElementById('result').value = formatMatrix(result);
}

function subtractMatrices() {
  let matrix1 = parseMatrix(document.getElementById('matrix1').value);
  let matrix2 = parseMatrix(document.getElementById('matrix2').value);
  
  if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
      alert('Matrices must have the same dimensions.');
      return;
  }

  let result = matrix1.map((row, i) => row.map((val, j) => val - matrix2[i][j]));
  document.getElementById('result').value = formatMatrix(result);
}

function multiplyMatrices() {
  let matrix1 = parseMatrix(document.getElementById('matrix1').value);
  let matrix2 = parseMatrix(document.getElementById('matrix2').value);
  
  if (matrix1[0].length !== matrix2.length) {
      alert('Number of columns in Matrix 1 must equal the number of rows in Matrix 2.');
      return;
  }

  let result = [];
  for (let i = 0; i < matrix1.length; i++) {
      result[i] = [];
      for (let j = 0; j < matrix2[0].length; j++) {
          let sum = 0;
          for (let k = 0; k < matrix2.length; k++) {
              sum += matrix1[i][k] * matrix2[k][j];
          }
          result[i][j] = sum;
      }
  }
  document.getElementById('result').value = formatMatrix(result);
}
// Currency Converter Code
function convertCurrency() {
  const amount = parseFloat(document.getElementById('amount').value);
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;
  const resultElement = document.getElementById('conversionResult');

  // Clear previous result
  resultElement.textContent = '';

  if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
  }

  try {
      const convertedAmount = getConvertedAmount(amount, fromCurrency, toCurrency);
      resultElement.textContent = `Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
  } catch (error) {
      alert("Error in conversion. Please try again later.");
      console.error(error);
  }
}

function getConvertedAmount(amount, fromCurrency, toCurrency) {
  // Predefined exchange rates
  const exchangeRates = {
      USD: { EUR: 0.84, GBP: 0.74, INR: 73.58 },
      EUR: { USD: 1.19, GBP: 0.88, INR: 87.69 },
      GBP: { USD: 1.35, EUR: 1.14, INR: 99.70 },
      INR: { USD: 0.014, EUR: 0.011, GBP: 0.01 }
  };

  if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
      const rate = exchangeRates[fromCurrency][toCurrency];
      return amount * rate;
  } else {
      throw new Error("Invalid currency or conversion not supported.");
  }
}

function updateForm() {
  const mode = document.getElementById('transport-mode').value;
  const transportFields = document.querySelectorAll('.transport-fields');
  transportFields.forEach(field => field.style.display = 'none');
  
  if (mode === 'car') {
      document.getElementById('car-fields').style.display = 'block';
  } else if (mode === 'flight') {
      document.getElementById('flight-fields').style.display = 'block';
  } else if (mode === 'bus') {
      document.getElementById('bus-fields').style.display = 'block';
  } else if (mode === 'train') {
      document.getElementById('train-fields').style.display = 'block';
  }
}

let emissionsResult = '';

function calculateEmissions() {
  const mode = document.getElementById('transport-mode').value;
  let emissions = 0;
  let details = '';

  if (mode === 'car') {
      const distance = parseFloat(document.getElementById('car-distance').value);
      const efficiency = parseFloat(document.getElementById('efficiency').value);
      if (isNaN(distance) || isNaN(efficiency)) {
          alert('Please enter valid numbers');
          return;
      }
      const CO2_PER_LITER = 2.31;
      const fuelConsumed = (distance / 100) * efficiency;
      emissions = fuelConsumed * CO2_PER_LITER;
      details = `Distance: ${distance} km, Fuel Efficiency: ${efficiency} L/100km`;
  } else if (mode === 'flight') {
      const distance = parseFloat(document.getElementById('flight-distance').value);
      if (isNaN(distance)) {
          alert('Please enter valid numbers');
          return;
      }
      const CO2_PER_KM_FLIGHT = 0.115; // kg CO2 per passenger km for flights
      emissions = distance * CO2_PER_KM_FLIGHT;
      details = `Flight Distance: ${distance} km`;
  } else if (mode === 'bus') {
      const distance = parseFloat(document.getElementById('bus-distance').value);
      if (isNaN(distance)) {
          alert('Please enter valid numbers');
          return;
      }
      const CO2_PER_KM_BUS = 0.089; // kg CO2 per passenger km for buses
      emissions = distance * CO2_PER_KM_BUS;
      details = `Bus Distance: ${distance} km`;
  } else if (mode === 'train') {
      const distance = parseFloat(document.getElementById('train-distance').value);
      if (isNaN(distance)) {
          alert('Please enter valid numbers');
          return;
      }
      const CO2_PER_KM_TRAIN = 0.041; // kg CO2 per passenger km for trains
      emissions = distance * CO2_PER_KM_TRAIN;
      details = `Train Distance: ${distance} km`;
  }

  emissionsResult = `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}, ${details}, Estimated CO2 Emissions: ${emissions.toFixed(2)} kg`;
  document.getElementById('result').innerText = emissionsResult;
}

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("CO2 Emissions Calculator Results", 10, 10);
  doc.text(emissionsResult, 10, 20);

  doc.save("CO2_Emissions_Report.pdf");
}

document.addEventListener('DOMContentLoaded', updateForm);

function searchFunction() {
  let input = document.getElementById('searchInput');
  let filter = input.value.toLowerCase();
  let items = document.querySelectorAll('.hreftag');

  items.forEach(item => {
      let textValue = item.textContent || item.innerText;
      if (textValue.toLowerCase().indexOf(filter) > -1) {
          item.style.display = "";
      } else {
          item.style.display = "none";
      }
  });
}

