const paginate = document.getElementById("paginate");
const $productsContainer = $("#products-container");

// without the arrow function, we would have to bind the function to the element that calls it
paginate.addEventListener("click", function (e) {
  e.preventDefault();
  fetch(this.href)
    .then((response) => response.json())
    .then((data) => {
      for (const product of data.docs) {
        let template = generateProduct(product);
        $productsContainer.append(template);
      }
      let { nextPage } = data;
      if (nextPage) {
        this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
      } else {
        $(paginate).hide();
      }
    })
    .catch((err) => console.log(err));
});

function generateProduct(product) {
  let template = `<div class="col-6 col-lg-3">
  <div class="prod-container">
    <a href="/products/${product._id}">
      <img alt="" class="prod-img img-fluid" src="${product.images.length ? product.images[0].url : "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"}" >
    </a>
    <p class="price">$${product.price}</p>
    <div class="overlay">
      <i class="fa-solid fa-cart-shopping d-flex" style="color: white"> <span class="cart-text">Add to cart</span></i>
    </div>
  </div>
  <h1 class="prod-name">${product.name}</h1>
</div>`;
  return template;
}
