document.addEventListener("DOMContentLoaded", function () {
  const minusButton = document.querySelector(".minus");
  const plusButton = document.querySelector(".plus");
  const numberInput = document.getElementById("stockCountInput");

  function adjustInputValue(delta) {
    let currentValue = parseInt(numberInput.value, 10) || 0;
    let newValue = currentValue + delta;
    newValue = Math.max(parseInt(numberInput.min, 10), newValue);
    newValue = Math.min(parseInt(numberInput.max, 10), newValue);
    numberInput.value = newValue;
  }

  minusButton.addEventListener("click", function () {
    adjustInputValue(-1);
  });

  plusButton.addEventListener("click", function () {
    adjustInputValue(1);
  });

  numberInput.addEventListener("input", function () {
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
