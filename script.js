/**
 * UI Elements - Display screens for current and historical calculations
 */
const currentDisplay = document.getElementById('current-operand');
const previousDisplay = document.getElementById('previous-operand');
 
/**
 * State Management - Initializing calculator memory
 */
let currentInput = '0';    // The value currently being typed
let previousInput = '';   // The value stored after an operator is pressed
let operator = null;      // Current active mathematical operation

/**
 * Syncs the JavaScript state with the HTML Display.
 * Handles how numbers and operators appear on the screen.
 */
function updateDisplay() {
    currentDisplay.innerText = currentInput;
    // Shows the previous number and operator at the top (e.g., "45 +")
    previousDisplay.innerText = previousInput + (operator ? ` ${operator}` : '');
}

/**
 * Resets the calculator to its default state.
 */
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

/**
 * Removes the last character typed. 
 * Prevents empty screen by defaulting to '0'.
 */
function deleteNumber() {
    if (currentInput === '0') return;
    currentInput = currentInput.toString().slice(0, -1);

    // If user deletes everything, show 0 instead of empty space
    if (currentInput === '') currentInput = '0';
    updateDisplay();
}

/**
 * Appends a number or decimal to the current input string.
 * Includes validation for decimal points and leading zeros.
 */
function appendNumber(number) {
    // Prevent multiple decimal points in one number
    if (number === '.' && currentInput.includes('.')) return;

    // Replace initial '0' with the first number typed
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

/**
 * Sets the mathematical operation.
 * If a calculation is already pending, it computes it first.
 */
function appendOperator(op) {
    if (currentInput === '') return;

    // Logic for chaining operations (e.g., 5 + 5 + 5)
    if (previousInput !== '') {
        calculate();
    }

    operator = op;
    previousInput = currentInput;
    currentInput = ''; // Clear current screen for the next number
    updateDisplay();
}

/**
 * Core Logic: Performs the calculation based on the selected operator.
 * Handles basic arithmetic and division by zero errors.
 */
function calculate() {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    // Guard clause: stop if inputs are invalid
    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+': computation = prev + current; break;
        case '-': computation = prev - current; break;
        case '*': computation = prev * current; break;
        case '/':
            // Handle edge case: Division by zero
            computation = current === 0 ? "Error" : prev / current;
            break;
        default: return;
    }

    // Prepare result for display and reset state
    currentInput = computation.toString();
    operator = null;
    previousInput = '';
    updateDisplay();
}

/**
 * Event Listener for Keyboard Navigation.
 * Maps physical keys to calculator functions for better UX.
 */
window.addEventListener('keydown', (e) => {
    // Number keys 0-9
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);

    // Decimal key
    if (e.key === '.') appendNumber('.');

    // Equal and Enter keys for result
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault(); // Prevent accidental form submissions or page scrolls
        calculate();
    }

    // Backspace for deletion
    if (e.key === 'Backspace') deleteNumber();

    // Escape for All Clear (AC)
    if (e.key === 'Escape') clearDisplay();

    // Arithmetic Operator keys
    if (['+', '-', '*', '/'].includes(e.key)) {
        appendOperator(e.key);
    }
});