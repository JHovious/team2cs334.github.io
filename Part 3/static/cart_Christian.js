
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
        let sum = 0;
        

        if (cartSection){

            for (let item of cartArray){
                if(localStorage.getItem(item)){
                    let qty = Number(localStorage.getItem(item));
                    let name = item.substring(5);
                    let price = getPrice(name);
                    const newDiv = document.createElement('div');
                    const head1 = document.createElement('h1');
                    head1.textContent = name;
                    const head2 = document.createElement('h4');
                    head2.textContent = "Quantity: " + qty;
                    const priceLine = document.createElement('h4');
                    priceLine.textContent = "Price: " + (price * qty).toFixed(2);
                    newDiv.appendChild(head1);
                    newDiv.appendChild(head2);
                    newDiv.appendChild(priceLine);
                    cartSection.appendChild(newDiv);
                    sum += price * qty;
                }
                
            }

            //Code for updating totals on cart page
            subtotal = sum;
            const subtotalbox = document.getElementById('subtotalbox');
            const sub = document.createTextNode(subtotal.toFixed(2));
            subtotalbox.appendChild(sub);
            tax = calculateTax(subtotal);
            const taxbox = document.getElementById('taxbox');
            const taxes = document.createTextNode(tax.toFixed(2));
            taxbox.appendChild(taxes);
            total = subtotal + tax;
            const totalbox = document.getElementById('totalbox');
            const totals = document.createTextNode(total.toFixed(2));
            totalbox.appendChild(totals);

            
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

function getPrice(item){
    let price = 0;
    let check = 0;
    if (item == 'Iced Tea' || item == 'Campfire Tea' || item == 'Earl Grey Tea'){
        check = 1;
    }else if (item == 'Raspberry Tea' || item == 'Blackberry Tea' || item == 'Matcha Lemonade' || item == 'London Fog' || item == 'Hibiscus Tea' || item == 'English Breakfast Latte' || item == 'Black Currant Tea' || item == 'Cup O\' Joe' || item == 'Americano'){
        check = 1;
    }else{
        check = 3;
    }
    switch(check){
        case  1 :
            price = 1.99;
            break;

        case 2:
            price = 2.99;
            break;

        case 3:
            price = 3.99;
            break;

        default:
            price = 0;
            
    }
    return price;
}

function calculateTax(subtotal){
    return subtotal * .07;
}
