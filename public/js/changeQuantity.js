document.addEventListener("DOMContentLoaded", function () {
  const minusButtons = document.querySelectorAll(".minus");
  const plusButtons = document.querySelectorAll(".plus");
  const numberInputs = document.querySelectorAll(".stockCountInput"); // Make sure the class selector is correct, it should start with '.'

  function adjustInputValue(input, delta) {
    let currentValue = parseInt(input.value, 10) || 0;
    let newValue = currentValue + delta;
    newValue = Math.max(parseInt(input.min, 10), newValue);
    newValue = Math.min(parseInt(input.max, 10), newValue);
    input.value = newValue;
  }

  minusButtons.forEach((minusButton, index) => {
    minusButton.addEventListener("click", function (event) {
      event.preventDefault();
      adjustInputValue(numberInputs[index], -1);
    });
  });

  plusButtons.forEach((plusButton, index) => {
    plusButton.addEventListener("click", function (event) {
      event.preventDefault();
      adjustInputValue(numberInputs[index], 1);
    });
  });

  numberInputs.forEach((input) => {
    input.addEventListener("input", function () {
      let value = parseInt(this.value, 10);

      if (isNaN(value)) {
        value = 0;
      } else if (value > parseInt(this.max, 10)) {
        value = parseInt(this.max, 10);
      } else if (value < parseInt(this.min, 10)) {
        value = parseInt(this.min, 10);
      }

      this.value = value;
    });
  });
});
