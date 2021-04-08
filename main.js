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
        const { name, listPrice, sellingPrice, id } = item;
        const image = item.imageUrl;

        return { name, listPrice, sellingPrice, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//Display products in UI
class UI {
  displayProducts(prods) {
    let result = "";
    prods.forEach((prod) => {
      result += `
      <div class="product-showcase">
            <div class="image">
              <img
                src=${prod.image}
                alt=""
                class="product-image"
              />
            </div>
            <div class="product-showcase-text">
              <h3 class="product-showcase-name">${prod.name}</h3>
              <div class="prices">
                <p class="showcase-full-price">De R$ ${prod.listPrice / 100}</p>
                <p class="showcase-discount-price">Por R$ ${
                  prod.sellingPrice / 100
                }</p>
              </div>
              </div>
              <div class="add-to-cart" data-id=${prod.id}>
                <button class="add-button">
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
  getBagButtons() {
    const productButtons = [...document.querySelectorAll(".add-to-cart")];

    buttonsDom = productButtons;

    // Add events to get products by id from local storage, store them into the shoppingCart, save its data, alter the value and display all items currently in it
    productButtons.forEach((button) => {
      let id = button.dataset.id;
      let productsInCart = shoppingCart.find((item) => item.id === id);

      if (productsInCart) {
        button.innerText = "Adicionado!";
        button.disabled = true;
      }

      button.addEventListener("click", (e) => {
        e.target.innerText = "Adicionado!";
        e.target.disabled = true;

        let cartProduct = { ...Storage.getproduct(id), amount: 1 };

        shoppingCart = [...shoppingCart, cartProduct];

        Storage.saveCart(shoppingCart);

        this.setShoppingCartValues(shoppingCart);
      });
    });
  }

  setShoppingCartValues(shoppingCartTotal) {
    let tempCartTotal = 0;
    let itemsTotal = 0;

    shoppingCartTotal.map((item) => {
      tempCartTotal >= 10.0
        ? (tempCartTotal += (item.sellingPrice / 100) * item.amount)
        : (tempCartTotal += (item.listPrice / 100) * item.amount);
      itemsTotal += item.amount;
    });
    totalPrice.innerText = parseFloat(tempCartTotal.toFixed(2));
    totalItemsAmount.innerText = itemsTotal;

    console.log(totalPrice, totalItemsAmount);
  }
}

//Sets local storage to store cart info and data
class Storage {
  //Saves the product data using setItem
  static saveProductsData(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  // Gets the products data saved in local storage using their id
  static getproduct(productId) {
    let products = JSON.parse(localStorage.getItem("products"));

    return products.find((product) => product.id === productId);
  }

  static saveCart(savedCart) {
    localStorage.setItem("cart", JSON.stringify(savedCart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const uiDisplay = new UI();
  const products = new Products();

  // get all products
  products
    .getProducts()
    .then((productList) => {
      uiDisplay.displayProducts(productList);

      Storage.saveProductsData(productList);
    })
    .then(() => uiDisplay.getBagButtons());
});
