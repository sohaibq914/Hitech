window.onload = function () {
  const menu_btn = document.querySelector(".hamburger");
  const mobile_menu = document.querySelector("nav");

  menu_btn.addEventListener("click", function () {
    menu_btn.classList.toggle("is-active");
    mobile_menu.classList.toggle("mobile-nav");
    mobile_menu.classList.toggle("is-active");
  });

  function removeMobileNavClass() {
    const screenWidth = window.innerWidth;

    if (screenWidth > 992) {
      mobile_menu.classList.remove("mobile-nav");
      mobile_menu.classList.remove("is-active");
    }
  }
  // Run the function initially when the page loads
  removeMobileNavClass();
  // Add an event listener to detect window resize
  window.addEventListener("resize", removeMobileNavClass);

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
