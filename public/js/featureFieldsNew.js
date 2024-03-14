document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".features-container");
  const addFeatureBtn = container.querySelector(".add-feature");

  addFeatureBtn.addEventListener("click", function () {
    const newInput = document.createElement("div");
    newInput.classList.add("input-group", "mb-3");
    newInput.innerHTML = `
            <input type="text" class="form-control" name="features[]">
            <button class="btn btn-danger remove-feature" style="width: 35px;" type="button">-</button>
        `;
    container.appendChild(newInput);
  });

  container.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-feature")) {
      event.target.parentElement.remove();
    }
  });
});
