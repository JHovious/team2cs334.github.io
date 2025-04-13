function addToCart(itemName){
    //Find if item exists in cart already
    let tempString = "cart_" + itemName;
    let currentQuantity = Number(searchCart(tempString));
    if (currentQuantity == 0){
        localStorage.setItem(tempString, 1); //Pair is ("cart_icedTea", 1) for example
        addCartLength();//Store cart length in storage, needed in cart.js
        addToCurrent(tempString);//Need this for keeping track of items in current cart
        
    }else if (currentQuantity > 0){
        let newQuantity = currentQuantity + 1;
        localStorage.setItem(tempString, newQuantity);


    }
}

function addToCurrent(item){
    if(localStorage.getItem("current_cart")){
       let currentString = localStorage.getItem("current_cart");//Need to convert to array first
       let currentArray = JSON.parse(currentString);
       currentArray.push(item);
       currentString = JSON.stringify(currentArray)//Now need to convert back to string
       localStorage.setItem("current_cart", currentString);

    }else{
        let tempArray = [item];
        let tempString = JSON.stringify(tempArray);
        localStorage.setItem("current_cart", tempString);
    }
}

function removeFromCurrent(item){
    if(localStorage.getItem("current_cart")){
        let currentString = localStorage.getItem("current_cart");//Need to convert to array first
        let currentArray = JSON.parse(currentString);

        let index = currentArray.indexOf(item);
        currentArray.splice(index, 1);

        currentString = JSON.stringify(currentArray)//Now need to convert back to string
        localStorage.setItem("current_cart", currentString);
 
     }
}

function updateQuantity(itemName, quantity){//Method to update quantity from the cart.html page quantity spinner box
    let tempString = "cart_" + itemName;
    localStorage.setItem(tempString, quantity);
}

function removeFromCart(itemName){//Method to remove entire item from cart
    let tempString = "cart_" + itemName;
    let check = searchCart(tempString);

    if(check === 0 || check>0){
        localStorage.removeItem(tempString);
        removeCartLength();
    }else{
        alert("Item not in cart");
    }

}

function searchCart(stringItemName){//Method to search if value exists in cart
    

    if (localStorage.getItem(stringItemName)){
        return localStorage.getItem(stringItemName);
    }else{
        return 0;
    }

}

function addCartLength(){//Method to update current cart length, needed for cart.html
    if(localStorage.getItem("cart_length")){
        let cart_length = Number(localStorage.getItem("cart_length"))
            cart_length += 1;
            localStorage.setItem("cart_length", cart_length);
    }else{
        localStorage.setItem("cart_length", 1);
    }
}

function getCartLength(){//Method for easy retrieval of cart length
    if (localStorage.getItem("cart_length")){
        let cart_length = Number(localStorage.getItem("cart_length"))
        return cart_length;
    }else{
        return 0;
    }
}

function removeCartLength(){//Method to remove 1 form cart length
    if(localStorage.getItem("cart_length")){
        let cart_length = Number(localStorage.getItem("cart_length"))
            cart_length -= 1;
            localStorage.setItem("cart_length", cart_length);
    }
}

function isEmpty(){
    return getCartLength() == 0;   
}
