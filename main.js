const cartButton = document.querySelector(".shopping-cart-icon");
const cart = document.querySelector(".shopping-cart");

const productsList = document.querySelector(".products-showcase-list");
const cartProductsList = document.querySelector(".products-list");
const totalItemsAmount = document.querySelector(".amount");

const totalPrice = document.querySelector("[data-total]");

let shoppingCart = [];

let buttonsDom = [];

cartButton.addEventListener("click", () => {
  cart.classList.toggle("shopping-cart-show");
});

// Gets the products, destructuring the json objects
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;

      products = products.map((item) => {
        const { id, name, price, discountPrice } = item;
        const image = item.imageUrl;

        return { id, name, price, discountPrice, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//Display products in UI
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
      <div class="product-showcase">
            <div class="image">
              <img
                src=${product.image}
                alt=""
                class="product-image"
              />
            </div>
            <div class="product-showcase-text">
              <h3 class="product-showcase-name">${product.name}</h3>
              <div class="prices">
                <p class="showcase-full-price">De R$ ${
                  product.listPrice / 100
                }</p>
                <p class="showcase-discount-price">Por R$ ${
                  product.sellingPrice / 100
                }</p>
              </div>
              </div>
              <div class="add-to-cart">
                <button class="add-button" data-id=${product.id}>
                  <i class="fas fa-shopping-cart"></i>
                  <p>Adicionar ao carrinho</p>
                </button>
              </div>
          </div>
      `;
    });
    productsList.innerHTML = result;
  }

  // Gets and attribute functionality to products' buttons
  getProductsButtons() {
    let buttons = [...document.querySelectorAll(".add-button")];
    buttonsDom = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = shoppingCart.find((item) => item.id === id);

      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }

      button.addEventListener("click", (event) => {
        // disable button
        event.currentTarget.innerText = "In Cart";
        event.currentTarget.disabled = true;
        // add to cart
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        shoppingCart = [...shoppingCart, cartItem];
        Storage.saveCart(shoppingCart);
        // add to DOM
        this.setShoppingCartValues(shoppingCart);
        this.addItemToCart(cartItem);
      });
    });
  }

  // Set shopping cart values
  setShoppingCartValues(shoppingCartTotal) {
    let tempCartTotal = 0;
    let itemsTotal = 0;

    shoppingCartTotal.map((item) => {
      tempCartTotal >= 10.0
        ? (tempCartTotal += (item.price / 100) * item.amount)
        : (tempCartTotal += (item.discountPrice / 100) * item.amount);

      if (tempCartTotal >= 10.0) {
        tempCartTotal -= item.price / 100;
        tempCartTotal += item.discountPrice / 100;
      }
      itemsTotal += item.amount;
    });
    totalPrice.innerText = parseFloat(tempCartTotal.toFixed(2));
    totalItemsAmount.innerText = itemsTotal;
  }

  // dinamically creates and adds product's elements to shopping cart parent element
  addItemToCart(item) {
    const itemDiv = document.createElement("div");

    itemDiv.classList.add("product");
    itemDiv.innerHTML = `
      <div class="item-cart-info">
        <div class="image">
          <img
          src=${item.image}
          alt="cart-product-image"
          class="product-image"
        />
        </div>
        <div class="product-text">
          <h2 class="product-name">${item.name}</h2>
          <p class="whole-price">R$ ${item.price / 100}</p>
          <p class="discount-price">R$ ${item.discountPrice / 100}</p>
        </div>
      </div>
      <div class="item-amounts">
              <div class="change-amount">
                <i class="fas fa-arrow-up increase-amount" data-id=${
                  item.id
                }></i>
                <span class="item-cart-amount">${item.amount}</span>
                <i class="fas fa-arrow-down decrease-amount" data-id=${
                  item.id
                }></i>
              </div>
      </div>
    `;
    cartProductsList.appendChild(itemDiv);
  }

  // load cart using stored cart data
  loadApplication() {
    shoppingCart = Storage.getCart();

    this.setShoppingCartValues(shoppingCart);
    this.populateShoppingCart(shoppingCart);
  }

  // repopulates cart when page loads
  populateShoppingCart(cartArray) {
    cartArray.forEach((item) => this.addItemToCart(item));
  }

  handleShoppingCart() {
    cartProductsList.addEventListener("click", (e) => {
      if (e.target.classList.contains("fas")) {
        let amount = e.target;
        let id = amount.dataset.id;

        let tempItem = shoppingCart.find((item) => item.id === id);
        if (e.target.classList.contains("increase-amount")) {
          tempItem.amount += 1;

          Storage.saveCart(shoppingCart);
          this.setShoppingCartValues(shoppingCart);

          amount.nextElementSibling.innerText = tempItem.amount;
        }

        if (e.target.classList.contains("decrease-amount")) {
          tempItem.amount = tempItem.amount - 1;

          if (tempItem.amount > 0) {
            Storage.saveCart(shoppingCart);
            this.setShoppingCartValues(shoppingCart);
            amount.previousElementSibling.innerText = tempItem.amount;
          } else {
            cartProductsList.removeChild(
              amount.parentElement.parentElement.parentElement
            );
            this.removeItem(id);
          }
        }
      }
    });
  }

  removeItem(itemId) {
    shoppingCart = shoppingCart.filter((item) => item.id !== itemId);

    this.setShoppingCartValues(shoppingCart);
    Storage.saveCart(shoppingCart);

    let productButton = this.getButton(itemId);
    productButton.disabled = false;
    productButton.innerHTML = `
      <button class="add-button">
        <i class="fas fa-shopping-cart"></i>
        <p>Adicionar ao carrinho</p>
      </button>
    `;
  }

  getButton(buttonId) {
    return buttonsDom.find((button) => button.dataset.id === buttonId);
  }
}

//Sets local storage to store cart info and data
class Storage {
  //Saves the product data using setItem
  static saveProductsData(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  // Gets the products data saved in local storage using their id
  static getProduct(productId) {
    let products = JSON.parse(localStorage.getItem("products"));

    return products.find((product) => product.id === productId);
  }

  static saveCart(savedCart) {
    localStorage.setItem("cart", JSON.stringify(savedCart));
  }

  // returns stored data, if avaiable
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const uiDisplay = new UI();
  const products = new Products();

  // sets up app by loading cart stored data
  uiDisplay.loadApplication();

  // gets all products listed on databasem the displays them dinamically
  products
    .getProducts()
    .then((productList) => {
      uiDisplay.displayProducts(productList);

      Storage.saveProductsData(productList);
    })
    .then(() => {
      uiDisplay.getProductsButtons();

      uiDisplay.handleShoppingCart();
    });
});
