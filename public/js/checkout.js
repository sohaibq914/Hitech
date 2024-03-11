document.addEventListener("DOMContentLoaded", function () {
  alert("HI");
  const button = document.querySelector(".checkout"); // Use querySelector instead
  const stripe = Stripe("pk_test_51OsxpiKUdAWFlxominpWZMk8mgML54sMMhObcU0coGUJKK9unpB8pcOLB01gdmq3ozIhzZzvmh7Y8QnzfHzKXa8c00UrXZYB63");
  alert("HI2");

  button.addEventListener("click", async () => {
    alert("YOO");
    // Ensure 'cart' is defined and accessible here
    const cartItems = JSON.parse(button.getAttribute("data-cart-items"));
    console.log("BLAH ", cartItems); // Add this line to diagnose

    fetch("/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ cartItems: cartItems }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  });
});
