//variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
// cart array
let cart = [];
//product buttons
let buttonsDOM = [];

//getting the products with fetch from FakeStoreAPI
class Products{
async getProducts(){
    try{
        let result = await fetch("https://fakestoreapi.com/products");
        let products = await result.json();
        console.log(products);
        return products;
    }
    catch (error){
        console.log(error);
    }
}
}

//display products
// ui
class UI {
    displayProducts(products) {
      let result = "";
      products.forEach(product => {
        result += `
        <!-- single product -->
          <article class="product">
            <div class="img-container">
              <img
                src=${product.image}
                alt="product"
                class="product-img"
              />
              <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
            <h5>${product.description}</h5>
          </article>
          <!-- end of single product -->
        `;
        });
        productsDOM.innerHTML = result;
    }
    //gets all buttons from each product and the products ID on click
    getBagButtons() {
        let buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            //took me 4 hours of trouble shooting to figure this out
        let id = Number(button.dataset.id);
        let inCart = cart.find(item => item.id === id);
        if (inCart) {
            button.innerText = "In Cart";
            button.disabled = true;
        }
        button.addEventListener("click", event => {
            // disable button
            event.target.innerText = "In Cart";
            event.target.disabled = true;
            // add to cart
            let cartItem = { ...Storage.getProduct(id), amount: 1 };
            cart = [...cart, cartItem];
            Storage.saveCart(cart);
            // set cart values
            this.setCartValues(cart);
            //display cart item
            this.addCartItem(cartItem);
            //show the cart
            this.showCart();
            });
        });
    } //sets the total amount of products and amount to pay on the cart
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `<!-- cart item -->
                <!-- item image -->
                <img src=${item.image} alt="product" />
                <!-- item info -->
                <div>
                  <h4>${item.title}</h4>
                  <h5>$${item.price}</h5>
                  <span class="remove-item" data-id=${item.id}>remove</span>
                </div>
                <!-- item functionality -->
                <div>
                    <i class="fas fa-chevron-up" data-id=${item.id}></i>
                  <p class="item-amount">
                    ${item.amount}
                  </p>
                    <i class="fas fa-chevron-down" data-id=${item.id}></i>
                </div>
              <!-- cart item -->
        `;
        cartContent.appendChild(div);
        
    }
    showCart(){
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");
    }
    //checks the cart value on startup
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populate(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart);
    }
    //loops through the localStorage cart and adds every product to the cart
    populate(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart(){
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
    }
    cartLogic(){
        //clear cart button
        clearCartBtn.addEventListener('click',()=> {
            this.clearCart();
        });
        //cart functionality
        //check for which button you click on in the cart
        //remove by checking for parentElement,
        //Update the amount with up or down arrow and save to localStorage cart
        cartContent.addEventListener('click', event => {
            if(event.target.classList.contains('remove-item'))
            {
                let removeItem = event.target;
                let id = Number(removeItem.dataset.id);
                cartContent.removeChild(removeItem.parentElement.parentElement);
                // remove item
                this.removeItem(id);
            }
            else if(event.target.classList.contains("fa-chevron-up")){
                let addAmount = event.target;
                let id = Number(addAmount.dataset.id);
                let tempItem = cart.find(item => item.id===id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains("fa-chevron-down")){
                let lowerAmount = event.target;
                let id = Number(lowerAmount.dataset.id);
                let tempItem = cart.find(item => item.id===id);
                tempItem.amount = tempItem.amount - 1;
                //removes the product from the cart if amount is less then 1
                if(tempItem.amount > 0){ 
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }
    //gets the IDs from the products in the cart
    //Then removes the products from cart in localStorage
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
        cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    //filters and updates the cart with earlier methods
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        //changes the buttons on the removed products back to default
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>Add to Cart`;
    }
    getSingleButton(id) {
        return buttonsDOM.find(button => Number(button.dataset.id) === id);
    }
}

//local storage
//Different methods to save or get localStorage data
class Storage {
    static saveProducts(products) {
      localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
      let products = JSON.parse(localStorage.getItem("products"));
      return products.find(product => product.id === id);
    }
    static saveCart(cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(
            localStorage.getItem('cart')):[]
    }
}
  
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    //setup app
    ui.setupAPP();
  
    // get all products
    products
      .getProducts()
      .then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
      })
      .then(() => {
        ui.getBagButtons();
        ui.cartLogic();
      });
});


/*
      
      // Hämta en produkt från fakestoreapi
      fetch("https://fakestoreapi.com/products/1")
        .then((res) => res.json())
        .then((json) => console.log(json));

      // Hämta alla produkter från fakestoreapi
      fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((json) => console.log(json));

      // En händelsestyrd app som använder Fetch API

      document.getElementById("TestBtn").addEventListener("click", loadTestJSON);


      function loadTestJSON() {
        fetch("https://fakestoreapi.com/products")
        .then((res) => res.json())
        .then((json) => renderer(json));
      }

      function renderer(products) {
        console.log(products);
        let output = "";
        products.forEach((product) => (output += `
            <div class="col-md-4 d-flex align-items-stretch">
                <div class="card mb-4 box-shadow">
                    <img class="card-img-top" src="${product.image}" alt="Card image cap" style="padding-top:1em;height:120px; object-fit:contain;">
                  <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="">
                        <p class="">${product.price}$</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                      </div>
                      <small class="text-muted">9 mins</small>
                      </div>
                    </div>
                </div>
            </div>
            </div>`));
        document.getElementById("Test").innerHTML = output;
      }

      function render(products){ 
        console.log(products);
        let output = "";
        products.forEach((product) => output +=
         `<li><h2>${product.title}<h2></li>`);
        document.getElementById("Test").innerHTML = output};
    
*/

    