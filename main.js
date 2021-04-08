const cartButton = document.querySelector(".shopping-cart-icon");
const cart = document.querySelector(".shopping-cart");

cartButton.addEventListener("click", () => {
  cart.classList.toggle("shopping-cart-show");
});
