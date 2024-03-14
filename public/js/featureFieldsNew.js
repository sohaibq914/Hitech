document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".features-container");
  const addButtonContainer = container.querySelector(".input-group"); // The container of the "+" button

  const addFeatureBtn = addButtonContainer.querySelector(".add-feature");

  addFeatureBtn.addEventListener("click", function () {
    const newInput = document.createElement("div");
    newInput.classList.add("input-group", "mb-3");
    newInput.innerHTML = `
            <input type="text" class="form-control" name="features[]" required>
            <button class="btn btn-danger remove-feature" style="width: 35px;" type="button">-</button>
            <div class="valid-feedback">Looks good!</div>
        `;
    // Insert newInput before the addButtonContainer instead of addFeatureBtn
    container.insertBefore(newInput, addButtonContainer);
  });

  container.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-feature")) {
      event.target.parentElement.remove();
    }
  });
});
