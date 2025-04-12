
window.onload = function (){ //For updating cart section if cart exists
    if(JSON.parse(localStorage.getItem("cart_length")) > 0){
        const picture = document.getElementById('remove1');
        picture.remove();
        const firstContainer = document.getElementById('remove2');
        firstContainer.remove();
        const secondContainer = document.getElementById('remove3');
        secondContainer.remove();

        let cartArray = JSON.parse(localStorage.getItem("current_cart"));
        let cartSection = document.getElementById('cartsection');//Get cartsection from html

        if (cartSection){

            for (let cart of cartArray){
                if(localStorage.getItem(cart)){
                    let qty = Number(localStorage.getItem(cart));
                    let name = cart.substring(5);
                    const newDiv = document.createElement('div');
                    const head1 = document.createElement('h1');
                    head1.textContent = name;
                    const head2 = document.createElement('h4');
                    head2.textContent = "Quantity: " + qty;
                    newDiv.appendChild(head1);
                    newDiv.appendChild(head2);
                    cartSection.appendChild(newDiv);
                }
                
            }
            
        }
    }
};



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