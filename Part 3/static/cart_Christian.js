
window.onload = function (){ //For updating cart section if cart exists
    if(JSON.parse(localStorage.getItem("cart_length")) > 0){
        const firstContainer = document.getElementById('remove1');
        firstContainer.style.display='none';
        const secondContainer = document.getElementById('remove2');
        secondContainer.style.display='none';

        let cartArray = JSON.parse(localStorage.getItem("current_cart"));
        let cartSection = document.getElementById('cartsection');//Get cartsection from html
        let sum = 0;
        

        if (cartSection){

            for (let item of cartArray){
                if(localStorage.getItem(item)){
                    let qty = Number(localStorage.getItem(item));
                    let name = item.substring(5);
                    let price = getPrice(name);
                    sum += price * qty;
                    const newDiv = document.createElement('div');
                    const head1 = document.createElement('h1');
                    head1.id = "nameBox";
                    head1.textContent = name;
                    head1.style.fontSize = "40px";
                    const head2 = document.createElement('h4');
                    head2.id = "quantityBox";
                    head2.textContent = "Quantity: " + qty;
                    head2.style.fontSize = "20px";
                    const priceLine = document.createElement('h4');
                    priceLine.id = "priceBox";
                    priceLine.textContent = "Price: $" + (price * qty).toFixed(2);
                    priceLine.style.fontSize = "20px";

                    const remove = document.createElement('button');
                    remove.textContent = "Remove";
                    remove.id = "removeButton";
                    remove.addEventListener('click', function(){//Adds remove functionality with names tied to the button
                        updateTotals(price, qty, false);
                        removeFromCurrent(item);

                        newDiv.removeChild(head1);
                        newDiv.removeChild(head2);
                        newDiv.removeChild(priceLine);
                        newDiv.removeChild(remove);
                        newDiv.removeChild(breakGap);
                        newDiv.removeChild(image);
                        newDiv.removeChild(refresh);
                        
                        
                    });


                    const refresh = document.createElement('a');
                    refresh.href='cart.html';

                    const update = document.createElement('button');
                    update.textContent = "Add More";
                    update.id = "updateButton";
                    update.style.marginBottom = "20px";
                    update.name = "updateButton";
                    update.addEventListener('click', function(){
                        
                        addToCart(name);

                    });

                    refresh.appendChild(update);


                    const breakGap = document.createElement('hr');
                    newDiv.appendChild(head1);
                    newDiv.appendChild(head2);
                    newDiv.appendChild(refresh);
                    newDiv.appendChild(priceLine);
                    newDiv.appendChild(remove);
                    let imageLocation = getImage(name);
                    const image = document.createElement('img')
                    image.src = imageLocation;
                    image.style.height = '300px';
                    image.style.width = '350px';
                    image.style.textAlign = 'right';
                    newDiv.appendChild(image);
                    newDiv.appendChild(breakGap);
                    cartSection.appendChild(newDiv);
                    
                }
                
            }

            //Code for updating totals on cart page
            subtotal = sum;
            const subtotalbox = document.getElementById('subtotalbox');
            const sub = document.createElement('div');
            sub.id = "subtotalAmount";
            sub.textContent = "$ " + subtotal.toFixed(2);
            subtotalbox.appendChild(sub);
            tax = calculateTax(subtotal);
            const taxbox = document.getElementById('taxbox');
            const taxes = document.createElement('div');
            taxes.id = "taxAmount";
            taxes.textContent = "$ " + tax.toFixed(2);
            taxbox.appendChild(taxes);
            total = subtotal + tax;
            const totalbox = document.getElementById('totalbox');
            const totals = document.createElement('div');
            totals.id = "totalAmount";
            totals.textContent = "$ " + total.toFixed(2);
            totalbox.appendChild(totals);

            localStorage.setItem("subtotal", subtotal);//Need this stored for updateTotals()

            
        }


    }
};

function getImage(name){
    let source;
    switch(name){
        case 'Iced Tea':
            source =  "../static/images/christian/icedtea.png";
            break;

        case 'Raspberry Tea':
            source = "../static/images/raspberryTea.png";
            break;

        case 'Blackberry Tea':
            source = "../static/images/blackberryTea.png";
            break;

        case 'Green Tea':
            source = "../static/images/greenTea.png";
            break;

        case 'Arnold Palmer':
            source = "../static/images/arnoldPalmer.png";
            break;

        case 'Campfire Tea':
            source = "../static/images/christian/campfire.png";
            break;

        case 'Matcha Green Tea Latte':
            source = "../static/images/matchaGreenTea.jpg";
            break;

        case 'Matcha Lemonade':
            source = "../static/images/matchaLemonade.jpg";
            break;

        case 'London Fog':
            source = "../static/images/londonFog.jpg";
            break;

        case 'Hibiscus Tea':
            source = "../static/images/hibiscusTea.jpg";
            break;

        case 'English Breakfast Latte':
            source = "../static/images/englishBreakfastLatte.jpg";
            break;

        case 'Earl Grey Tea':
            source = "../static/images/EarlGreyTea.jpg";
            break;

        case 'Peach Iced Tea':
            source = "../static/images/peachIcedTea.jpg";
            break;

        case 'Black Currant Tea':
            source = "../static/images/blackCurrantTea.jpg";
            break;

        case 'Cup O\' Joe':
            source = "../static/images/christian/coffee.png";
            break;

        case 'Cappuccino':
            source = "../static/images/christian/cappuccino.png";
            break;

        case 'Americano':
            source = "../static/images/christian/americano.png";
            break;
    }

    return source;

}

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

function searchCart(stringItemName){//Method to search if value exists in cart
    

    if (localStorage.getItem(stringItemName)){
        return localStorage.getItem(stringItemName);
    }else{
        return 0;
    }

}


function updateQuantity(item, quantity){
    localStorage.setItem(item, quantity);

}



function lowerSubtotal(price, quantity){
    let subtotal = JSON.parse(localStorage.getItem("subtotal"));
    subtotal -= price*quantity;
    if (subtotal < 0){
        subtotal = 0;
    }
    return subtotal;
}

function raiseSubtotal(price, quantity){
    let subtotal = JSON.parse(localStorage.getItem("subtotal"));
    subtotal += price*quantity;
    return subtotal;
}


function updateTotals(price, quantity, check){
    let subtotal;
    if (check == false){//false for lower quantity than before
        subtotal = lowerSubtotal(price, quantity);
    } else if(check == true){
        subtotal = raiseSubtotal(price, quantity);
    }
    localStorage.setItem("subtotal", subtotal);
    


    const subtotalbox = document.getElementById('subtotalAmount');
    subtotalbox.textContent = "$ " + subtotal.toFixed(2);

    tax = calculateTax(subtotal);
    if (tax < 0){
        tax = 0;
    }
    const taxbox = document.getElementById('taxAmount');
    taxbox.textContent = "$ " + tax.toFixed(2);
    total = subtotal + tax;
    const totalbox = document.getElementById('totalAmount');
    totalbox.textContent = "$ " + total.toFixed(2);

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

        if (cart_length === 0){
            localStorage.removeItem("cart_length");//Remove items from local storage
            localStorage.removeItem("current_cart");
            localStorage.removeItem("subtotal");

            const secondContainer = document.getElementById('remove2');//Give option to add to cart
            secondContainer.style.display='inline-block';

        }
    }
}

function isEmpty(){
    return getCartLength() == 0;   
}

function removeFromCurrent(item){
    if(localStorage.getItem("current_cart")){
        let currentString = localStorage.getItem("current_cart");//Need to convert to array first
        let currentArray = JSON.parse(currentString);

        //Need to search if item exists in cart
        let check = existsCart(item, currentArray)
        if(check){
            let index = currentArray.indexOf(item);
            currentArray.splice(index, 1);
            
            currentString = JSON.stringify(currentArray)//Now need to convert back to string
            localStorage.setItem("current_cart", currentString);

            //Now need to remove from localstorage
            localStorage.removeItem(item);
            removeCartLength();
        }
    
     }
}

function existsCart(item, array){
    for (let cartItem of array){
        if (cartItem == item){
            return true;
        }else{
            return false;
        }
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
