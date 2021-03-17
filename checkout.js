    //Variables
    const productsInCartDOM = document.querySelector(".products-center");
    const cartItems = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total");
    const purchaseOverlay = document.querySelector(".purchase-overlay");
    const purchaseDOM = document.querySelector(".purchase")
    const purchaseContent = document.querySelector(".purchase-content");
    const purchaseTotal = document.getElementById("purchaseAmount");

    //Ui function that gets data from the localStorage
        class UI {
            displayProductsInCart(productsInCart) {
            let result = "";
            productsInCart.forEach(product => {
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
                    <h3>Total amount: ${product.amount}</h3>
                    <h4>$${product.price * product.amount}</h4>
                    <h5>${product.description}</h5>
                </article>
                <!-- end of single product -->
                `;
                });
                productsInCartDOM.innerHTML = result;
            }

            setCartValues(productsInCart) {
                let tempTotal = 0;
                let itemsTotal = 0;
                productsInCart.map(item => {
                    tempTotal += item.price * item.amount;
                    itemsTotal += item.amount;
                });
            cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
            cartItems.innerText = itemsTotal;
            purchaseTotal.innerText = parseFloat(tempTotal.toFixed(2));
            console.log(tempTotal, itemsTotal);
            }

            addProductsToHiddenCart(productsInCart){
                let output = "";
                productsInCart.forEach(item =>{
                    output +=`<!-- purchase item -->
                    <div class="purchase-item">
                    <!-- item image -->
                    <img src=${item.image} alt="item" />
                    <!-- item info -->
                    <div>
                      <h4>${item.title}</h4>
                      <h4>Amount: ${item.amount}</h4>
                      <h5>$${item.price * item.amount}</h5>
                    </div>
                    </div>
                <!-- purchase item -->
                `;
                })
                purchaseContent.innerHTML = output;
            }

            showCart(){
                purchaseOverlay.classList.add("transparentBcg");
                purchaseDOM.classList.add("showPurcase");
                console.log("ShowCartTest");
            }

            

        }
        //localStorage methods
        class Storage {
            static saveCart(cart) {
            localStorage.setItem("cart", JSON.stringify(cart));
            }
            static clearCart(){
                localStorage.removeItem("cart");
            }
            static getCart(){
                return localStorage.getItem('cart')?JSON.parse(
                    localStorage.getItem('cart')):[]
            }
        }

        class ProductsInCart{
        async getProducts(){
            try{
                let productsInCart = Storage.getCart();
                console.log(productsInCart);
                return productsInCart;
            }
            catch (error){
                console.log(error);
            }
        }
        }  
        //Validates every field in the checkout form
        //This function is made from spagetti code
        // It's stupid, but it works
        // so stupid
        function validateForm(UI) {
            var validateName = document.getElementById("fname");
            var validateMail = document.getElementById("email");
            var validateAdr = document.getElementById("adr");
            var validateCity = document.getElementById("city");
            var validateState = document.getElementById("state");
            var validateZip = document.getElementById("zip");
            var validateCname = document.getElementById("cname");
            var validateCcnum = document.getElementById("ccnum");
            var validateExpmonth = document.getElementById("expmonth");
            var validateExpyear = document.getElementById("expyear");
            var validateCvv = document.getElementById("cvv");

            
                
                    document.getElementById("fullname").innerHTML = "";
                    document.getElementById("mail").innerHTML = "";
                    document.getElementById("vaddress").innerHTML = "";
                    document.getElementById("vcity").innerHTML = "";
                    document.getElementById("vstate").innerHTML = "";
                    document.getElementById("vzip").innerHTML = "";
                    document.getElementById("vcardname").innerHTML = "";
                    document.getElementById("vccnum").innerHTML = "";
                    document.getElementById("vexpmonth").innerHTML = "";
                    document.getElementById("vexpyear").innerHTML = "";
                    document.getElementById("vcvv").innerHTML = "";
                
            

            if (!validateName.checkValidity()) {
              document.getElementById("fullname").innerHTML = validateName.validationMessage;
            }
            else if(!validateMail.checkValidity()){
                document.getElementById("mail").innerHTML = validateMail.validationMessage;
            }
            else if(!validateAdr.checkValidity()){
                document.getElementById("vaddress").innerHTML = validateAdr.validationMessage;
            }
            else if(!validateCity.checkValidity()){
                document.getElementById("vcity").innerHTML = validateCity.validationMessage;
            }
            else if(!validateState.checkValidity()){
                document.getElementById("vstate").innerHTML = validateState.validationMessage;
            }
            else if(!validateZip.checkValidity()){
                document.getElementById("vzip").innerHTML = validateZip.validationMessage;
            }
            else if(!validateCname.checkValidity()){
                document.getElementById("vcardname").innerHTML = validateCname.validationMessage;
            }
            else if(!validateCcnum.checkValidity()){
                document.getElementById("vccnum").innerHTML = validateCcnum.validationMessage;
            }
            else if(!validateExpmonth.checkValidity()){
                document.getElementById("vexpmonth").innerHTML = validateExpmonth.validationMessage;
            }
            else if(!validateExpyear.checkValidity()){
                document.getElementById("vexpyear").innerHTML = validateExpyear.validationMessage;
            }
            else if(!validateCvv.checkValidity()){
                document.getElementById("vcvv").innerHTML = validateCvv.validationMessage;
            }
            else{
                UI.showCart();
            }
          }

        document.addEventListener("DOMContentLoaded", () => {
            const ui = new UI();
            const productsInCart = new ProductsInCart();
            console.log(productsInCart);
            // get all products in cart from localstorage
            productsInCart
                .getProducts()
                .then( productsInCart => {
                    ui.displayProductsInCart(productsInCart);
                    ui.addProductsToHiddenCart(productsInCart);
                    ui.setCartValues(productsInCart);
                });
            
        });

        document.getElementById("purchase").addEventListener("click", () =>{
            const purchase = new UI();
            //Validate form input, If It's valid then complete purchase
            validateForm(purchase);

            console.log("hello");
        });

        