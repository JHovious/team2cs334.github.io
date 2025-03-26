
// Load cart items from localStorage or initialize empty array
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let subTotal = JSON.parse(localStorage.getItem("subTotal")) || 0; // Set default if null

function handleCart(event) {
    event.preventDefault(); 

    let button = event.target; 
    let itemName = button.value; // Button value (Tea name)
    let teaItem = null;

    // Check if the item already exists in the cart
    for (let index = 0; index < cartItems.length; index++) {
        let teaName = cartItems[index].name;

        if (teaName === itemName) {
            // Increase amount instead of creating a new item
            cartItems[index].amount += 1;
            
            // Save updated cart to localStorage
            localStorage.setItem("cartItems", JSON.stringify(cartItems));

            alert(itemName + " quantity updated in cart!");
            return; // Exit function since item was found and updated
        }
    }

    teaItem = new Tea(itemName);
    teaItem.amount = 1; // Default amount

    cartItems.push(teaItem);

    // Save updated cart in localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    alert(teaItem.name + " added to cart! " + teaItem.amount);
}

function Cart(event) {
    event.preventDefault(); 

    if (cartItems.length === 0) {
        localStorage.setItem("cartMessage", "No items are currently in your cart.");
    } else {
        localStorage.setItem("cartMessage", `Items in your cart: ${cartItems.length}`);
    }

    alert(`You have ${cartItems.length} items in your cart`);

    // Redirect to cart.html
    window.location.href = "cart.html";
}

//In some languages they have there own built in StringBuilder, in JavaScript they do not
export class StringBuilder {
    constructor(value = '') {
      this._value = Array.isArray(value) ? value : [value];
    }
  
    append(str) {
      this._value.push(str);
      return this;
    }
  
    clear() {
      this._value = [];
      return this;
    }
  
    toString() {
      return this._value.join('');
    }
  }

  class Tea{
    constructor(name = "" ){
        this.name = name;
        this.price = 0;
        this.amount = 1; // by default

        if(name == "Classic Iced Tea"){
            this.price = 1.99;
        }
        else if(name == "Campfire Tea"){
            this.price = 1.99;
        }
        else if(name == "Peach Iced Tea"){
            this.price = 3.99;
        }
        else if(name == "Matcha Green Tea Latte"){
            this.price = 3.99;
        }
        else if(name == "Green Tea"){
            this.price = 3.99;
        }
        else if(name == "Arnold Palmer"){
            this.price = 3.99;
        }
        else if(name == "Cappuccino"){
            this.price = 3.99;
        }
        else {
            this.price = 2.99;
        }
    }
  }


window.onload = function() {
    let displayElement = document.getElementById("displayItems");
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        let displaySubtotal = document.getElementById("displaySubtotal");
        let displayTax = document.getElementById("displayTax");
        let itemCount = document.getElementById("itemCount");

        const sb = new StringBuilder(); // making a new instance of the String builder

        let subTotal = 0;
        let totalTax = 0;
        
        for(let item of cartItems){

            let tax = item.price * 0.07; //classic NM Tax
            let totalEach = (item.price * item.amount) + tax;

            let formatedTax = tax.toFixed(2);
            let formated = totalEach.toFixed(2); //formated to 2 decimal places 

            totalTax += parseFloat(formatedTax);
            subTotal += parseFloat(formated);

            sb.append(item.amount + ". " + item.name + " price for each: $" + item.price  + "\n");



        
      //  displayElement.innerText = message;
      if(displayElement){
        displayElement.innerText = sb;
      }
        displaySubtotal.innerText = "$" + subTotal.toFixed(2);
        displayTax.innerText = "$" + totalTax.toFixed(2);
        itemCount.innerText = 'Items: ' + cartItems.length;
    }
};

