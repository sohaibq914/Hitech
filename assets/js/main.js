AOS.init();

// You can also pass an optional settings object
// below listed default settings
AOS.init({
  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 800, // values from 0 to 3000, with step 50ms
  easing: "ease", // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
});

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

  // offscreen close button
  const close_nav = document.querySelector(".offcanvas-close");
  close_nav.addEventListener("click", () => {
    menu_btn.click();
  });

  // nested menu appear through click on mobile screen
  const navbar = document.querySelector(".navbar");
  const lis = navbar.querySelectorAll("li");
  lis.forEach((x) => {
    x.addEventListener("click", (e) => {
      let ul = x.querySelector(":scope > ul");
      if (ul) {
        e.stopPropagation();
        x.classList.toggle("active");
        ul.classList.toggle("active");
      }
    });
  });
};

// switch images when hover

const masimo_touch = document.getElementById("masimo-touch");

masimo_touch.addEventListener("mouseover", function (event) {
  // Code to be executed when the element is being hovered over
  masimo_touch.src = "./assets/images/masimo_touch_2.png";
});

masimo_touch.addEventListener("mouseout", function (event) {
  // Code to be executed when the mouse moves away from the element
  masimo_touch.src = "./assets/images/masimo_touch.png";
});

const masimo_rainbow = document.getElementById("masimo-rainbow");

masimo_rainbow.addEventListener("mouseover", function (event) {
  // Code to be executed when the element is being hovered over
  masimo_rainbow.src = "./assets/images/masimo_rainbow_2.png";
});

masimo_rainbow.addEventListener("mouseout", function (event) {
  // Code to be executed when the mouse moves away from the element
  masimo_rainbow.src = "./assets/images/masimo_rainbow.png";
});

const spo2_adapter_cable = document.getElementById("spo2-adapter-cable");

spo2_adapter_cable.addEventListener("mouseover", function (event) {
  // Code to be executed when the element is being hovered over
  spo2_adapter_cable.src = "./assets/images/spo2_adapter_cable_2.jpg";
});

spo2_adapter_cable.addEventListener("mouseout", function (event) {
  // Code to be executed when the mouse moves away from the element
  spo2_adapter_cable.src = "./assets/images/spo2_adapter_cable.jpg";
});
