window.onload = function () {
  const menu_btn = document.querySelector(".hamburger");
  const mobile_menu = document.querySelector(".mobile-nav");

  menu_btn.addEventListener("click", function () {
    menu_btn.classList.toggle("is-active");
    mobile_menu.classList.toggle("is-active");
  });

  const image = document.querySelector("#changing-image");
  const images = ["./assets/images/stripper.png", "./assets/images/agglutinationviewer.png", "./assets/images/Blood-Bag-Shaker.avif"];
  setInterval(function () {
    const random = Math.floor(Math.random() * 3);
    image.src = images[random];
  }, 3000);

  const mobileImage = document.querySelector("#mobile-changing-image");
  setInterval(function () {
    const random = Math.floor(Math.random() * 3);
    mobileImage.src = images[random];
  }, 3000);
};
