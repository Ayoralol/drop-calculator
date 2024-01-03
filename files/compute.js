const lightModeBtn = document.getElementsByClassName("light-mode-button");
const darkModeBtn = document.getElementsByClassName("dark-mode-button");
const hideBtn = document.getElementsByClassName("hide-numbers");
const calcBtn = document.getElementsByClassName("calc-btn");
const functionBtn = document.getElementsByClassName("bot-btn");
const calcScreen = document.getElementsByClassName("calc-screen");
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");
const previousOperandTextElement = document.querySelector(
  "[data-previous-operand]"
);
const currentOperandTextElement = document.querySelector(
  "[data-current-operand]"
);
const previousOperandTextElementTwo = document.querySelector(
  "[data-previous-operand-2]"
);
const previousOperandTextElementThree = document.querySelector(
  "[data-previous-operand-3]"
);
const previousOperandTextElementFour = document.querySelector(
  "[data-previous-operand-4]"
);

var i, j, k, l;

/* COMPUTE */

class Calculator {
  constructor(
    previousOperandTextElement,
    currentOperandTextElement,
    previousOperandTextElementTwo,
    previousOperandTextElementThree,
    previousOperandTextElementFour
  ) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.previousOperandTextElementTwo = previousOperandTextElementTwo;
    this.previousOperandTextElementThree = previousOperandTextElementThree;
    this.previousOperandTextElementFour = previousOperandTextElementFour;
    this.clear();
    this.equalsPressedLast = false;
    this.currentInput = "";
    document.addEventListener("keydown", this.handleKeyboardInput.bind(this));
  }
  // Clears all the operands and operation
  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    this.previousOperands = ["", "", "", ""];
    this.previousOperandTwo = "";
    this.previousOperandThree = "";
    this.previousOperandFour = "";
  }
  // Deletes the last character from the current operand
  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }
  // Appends a number to the current operand
  appendNumber(number) {
    // If equals button was the last button pressed, do nothing
    if (this.equalsPressedLast) {
      return;
    }

    const hasDot = this.currentOperand.includes(".");
    const hasPercentage = this.currentOperand.includes("%");
    const hasPreviousOperand = this.previousOperand !== "";

    if (number === "." && (hasDot || this.currentOperand === "")) return;
    if (
      number === "%" &&
      (!hasPreviousOperand ||
        hasDot ||
        hasPercentage ||
        this.currentOperand === "")
    )
      return;
    if (number === "0" && this.currentOperand === "") return;
    if (hasPercentage) return;
    if (this.currentOperand.length >= 15) return;

    this.currentOperand = this.currentOperand.toString() + number.toString();
    this.currentInput += number.toString();
  }
  // Chooses an operation and moves the current operand to previous
  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "" && !this.equalsPressedLast) {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    if (!this.equalsPressedLast) {
      this.updatePreviousOperands(this.previousOperand);
    }
    this.equalsPressedLast = false;
    this.currentInput += " " + operation + " ";
  }
  // Computes the result of the operation
  // Computes the result of the operation
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;
    if (this.previousOperand === "" && this.currentOperand === "") return;

    switch (this.operation) {
      case "+":
        if (this.currentOperand.includes("%")) {
          const percentage = current / 100;
          computation = prev + prev * percentage;
        } else {
          computation = prev + current;
        }
        break;

      case "-":
        if (this.currentOperand.includes("%")) {
          const percentage = current / 100;
          computation = prev - prev * percentage;
        } else {
          computation = prev - current;
        }
        break;

      case "*":
        if (this.currentOperand.includes("%")) {
          const percentage = current / 100;
          computation = prev * percentage;
        } else {
          computation = prev * current;
        }
        break;

      case "/":
        if (this.currentOperand.includes("%")) {
          const percentage = current / 100;
          computation = prev / percentage;
        } else {
          computation = prev / current;
        }
        break;

      default:
        return;
    }

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = "";
    this.previousOperandTextElementTwo.innerText = this.getDisplayNumber(
      this.previousOperands[0]
    );
    this.previousOperandTextElementThree.innerText = this.getDisplayNumber(
      this.previousOperands[1]
    );
    this.previousOperandTextElementFour.innerText = this.getDisplayNumber(
      this.previousOperands[2]
    );
  }
  // Returns a display-friendly version of the number
  getDisplayNumber(number) {
    const [integerDigits, decimalDigits] = number.toString().split(".");
    let integerDisplay = isNaN(integerDigits)
      ? ""
      : integerDigits.toLocaleString("en", {maximumFractionDigits: 0});
    return decimalDigits != null
      ? `${integerDisplay}.${decimalDigits}`
      : integerDisplay;
  }
  // Formats the computed result
  formatComputedResult(number) {
    const absNumber = Math.abs(number);
    if (absNumber >= 1e15 || (absNumber > 0 && absNumber < 1e-14)) {
      return number.toExponential(2);
    }
    return number.toString();
  }
  // Updates the display with the current and previous operands
  updateDisplay() {
    this.currentOperandTextElement.innerText = this.getDisplayNumber(
      this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = "";
    }
    if ((this, this.currentOperand.includes("%"))) {
      this.currentOperandTextElement.innerText += "%";
    }
    this.previousOperandTextElementTwo.innerHTML = this.previousOperandTwo;
    this.previousOperandTextElementThree.innerHTML = this.previousOperandThree;
    this.previousOperandTextElementFour.innerHTML = this.previousOperandFour;
  }

  previousOperandDisplay() {
    this.previousOperandTwo = this.previousOperand;
    this.previousOperandThree = this.previousOperandTwo;
    this.previousOperandFour = this.previousOperandThree;
  }
  // Handles keyboard input
  handleKeyboardInput(e) {
    const key = e.key;

    if (/^\d$|[%]$/.test(key)) {
      // Number key
      this.appendNumber(key);
      this.updateDisplay();
      const numberButton = Array.from(numberButtons).find(
        (button) => button.innerText === key
      );
      if (numberButton) {
        numberButton.classList.add("active");
        setTimeout(() => {
          numberButton.classList.remove("active");
        }, 100);
      }
    } else if (key === "+" || key === "-" || key === "*" || key === "/") {
      // Operator keys
      this.chooseOperation(key);
      this.updateDisplay();
      const operationButton = Array.from(operationButtons).find(
        (button) => button.innerText === key
      );
      if (operationButton) {
        operationButton.classList.add("active");
        setTimeout(() => {
          operationButton.classList.remove("active");
        }, 100);
      }
    } else if (key === "=" || key === "Enter") {
      // Equals key or Enter key
      this.compute();
      this.updateDisplay();
      equalsButton.classList.add("active");
      setTimeout(() => {
        equalsButton.classList.remove("active");
      }, 100);
    } else if (key === "Backspace") {
      // Backspace key
      this.delete();
      this.updateDisplay();
      deleteButton.classList.add("active");
      setTimeout(() => {
        deleteButton.classList.remove("active");
      }, 100);
    } else if (key === "Delete") {
      // Delete key
      this.clear();
      this.updateDisplay();
      allClearButton.classList.add("active");
      setTimeout(() => {
        allClearButton.classList.remove("active");
      }, 100);
    } else if (key === "." || (e.shiftKey && key === "%")) {
      // Decimal point key or Shift + 5 for %
      this.appendNumber(key === "." ? key : "%");
      this.updateDisplay();
      const decimalButton = document.querySelector('[data-number="."]');
      if (decimalButton) {
        decimalButton.classList.add("active");
        setTimeout(() => {
          decimalButton.classList.remove("active");
        }, 100);
      }
    } else if (key === "Tab") {
      // Tab key
      if (hideBtn.length > 0) {
        hideBtn[0].click();
      }
    } else if (key === "=" || key === "Enter") {
      // Equals key or Enter key
      this.compute();
      this.updateDisplay();
      equalsButton.classList.add("active");
      setTimeout(() => {
        equalsButton.classList.remove("active");
      }, 100);
      this.equalsPressedLast = true;
    }
    // ...
    else {
      this.equalsPressedLast = false;
    }
  }
  updatePreviousOperands() {
    this.previousOperands.unshift(this.currentInput);
    if (this.previousOperands.length > 3) {
      this.previousOperands.pop();
    }

    this.previousOperandTwo = this.previousOperands[0] || "";
    this.previousOperandThree = this.previousOperands[1] || "";
    this.previousOperandFour = this.previousOperands[2] || "";

    // Clear the current input
    this.currentInput = "";
  }
}

const calculator = new Calculator(
  previousOperandTextElement,
  currentOperandTextElement,
  previousOperandTextElementTwo,
  previousOperandTextElementThree,
  previousOperandTextElementFour
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", (button) => {
  if (calculator.equalsPressedLast || calculator.currentOperand === "") return;
  calculator.updatePreviousOperands(calculator.currentOperand);
  calculator.compute();
  calculator.updateDisplay();
  calculator.equalsPressedLast = true;
});

allClearButton.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateDisplay();
  calculator.equalsPressedLast = false;
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
  calculator.equalsPressedLast = false;
});

for (let i = 0; i < lightModeBtn.length; i++) {
  lightModeBtn[i].addEventListener("click", function () {
    var docBody = document.body;
    docBody.classList.toggle("light-mode");
    lightModeBtn[i].style.display = "none";
    darkModeBtn[i].style.display = "block";
  });
}

for (let i = 0; i < darkModeBtn.length; i++) {
  darkModeBtn[i].addEventListener("click", function () {
    var docBody = document.body;
    docBody.classList.toggle("light-mode");
    darkModeBtn[i].style.display = "none";
    lightModeBtn[i].style.display = "block";
  });
}

for (let i = 0; i < hideBtn.length; i++) {
  hideBtn[i].addEventListener("click", function () {
    for (let j = 0; j < calcBtn.length; j++) {
      calcBtn[j].classList.toggle("hide");
    }
    for (let k = 0; k < functionBtn.length; k++) {
      functionBtn[k].classList.toggle("hide");
    }
    for (let l = 0; l < calcScreen.length; l++) {
      calcScreen[l].classList.toggle("hide-screen");
    }
  });
}
