
// Load cart items from localStorage or initialize empty array
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let subTotal = JSON.parse(localStorage.getItem("subTotal")) || 0; // Set default if null
let allTeas = JSON.parse(localStorage.getItem("allTeas")) || []; //this will represent our tea inventory
let user = JSON.parse(localStorage.getItem("loggedinUser"));
let allUsers = JSON.parse(localStorage.getItem("allUsers")) || []; //this is for all users
let allItems = JSON.parse(localStorage.getItem("allItems")) || []; //this is all items (teas and store products)

function handleCart(event) {
    event.preventDefault(); 
   //localStorage.clear();
   // return;
   // cartItems.clear();
    
    let button = event.target; 
    let itemName = button.value; // Button value (Tea name)
    let teaItem = null;
    const user = JSON.parse(localStorage.getItem("loggedinUser"));

    for(let drink of allTeas){
        if(itemName === drink.name){
            drink.amount = 1;
            cartItems.push(drink);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            if(user){
                alert("User: "+ user.firstName + " " + drink.name); //debugging 
                user.cartItems = cartItems;
                localStorage.setItem('loggedinUser',JSON.stringify(user));
            }
        }

    }
    
    return;


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

    // Redirect to cart.html
    window.location.href = "cart.html";
}

//In some languages they have there own built in StringBuilder, in JavaScript they do not
class StringBuilder {
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
    constructor(name = "",price = 0.0,amount = 1, byteData){
        this.name = name;
        this.price = price;
        this.amount = amount;
        this.image = byteData;
        this.isCoffee = false;
    }

    editTea(newName = "", newPrice = 0.0, newAmount = 0){

        if(newName){ // if truley ie not empty or null change
            this.name = newName;
        }
        if(newPrice){
            this.price = newPrice;
        }
        if(newAmount){
            this.amount = newAmount;
        }
            return;
    }

  }


  window.onload = function () {

    const user = JSON.parse(localStorage.getItem("loggedinUser"));

    let accountOptions = document.getElementById("accountOptions");
    let email = document.getElementById("displayEmail");
    let username = document.getElementById("username");
    let password = document.getElementById("displayPassword");
    let fullName = document.getElementById("fullName");
    let adminOptions = document.getElementById("adminOptions");

    let isAdmin = false;

    if(accountOptions && !user){ //this just means if the user is null or not logged in diplay the options
        accountOptions.innerHTML = '<li id="accountOptions" class="button_user"><a class="button active" href="login.html">Login</a><a class="button" href="register.html">Register</a></li>';
    }
    else if(accountOptions){
        accountOptions.innerHTML = '<li id="accountOptions" class="button_user"><a class="button active" href="profile.html">Profile</a>';
    }
  
    if(email && user && fullName){ //this is just for the profile page
    email.innerText = user.email.toString();
    username.innerText = user.username;
    fullName.innerText = user.firstName + " " + user.lastName;
    password.innerText = "*".repeat(user.password.length);
    
    if(user.isAdmin){
        isAdmin = true;
        adminOptions.innerHTML = '<a href="addTea.html" class="btn draw-border">Add Tea</a> <a href="allSales.html" class="btn draw-border">All Sales</a><div><a href="inventory.html" class="btn draw-border">Inventory</a><a href="addTea.html" class="btn draw-border">Add To Inventory</a>'
    }

    if(cartItems && !user.cartItems){ //if the user has any from last session
        cartItems = user.cartItems;
    }


}

    // Local storage data
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    let allTeas = JSON.parse(localStorage.getItem("allTeas")) || [];

    let displayAllTeas = document.getElementById("displayAllTeas"); // All Teas in inventory
    let displayAllCoffee = document.getElementById("displayAllCoffee"); // All Teas in inventory
    let coffeeTitle = document.getElementById("coffeeTitle");

    let displayElement = document.getElementById("displayItems"); // Cart items
    let displaySubtotal = document.getElementById("displaySubtotal");
    let displayTax = document.getElementById("displayTax");
    let itemCount = document.getElementById("itemCount");

    let buildTable = document.getElementById("inventoryTable");

    // If there are no teas in localStorage, initialize them
    if (!allTeas || allTeas.length === 0) {
        let imagePaths = [             "../static/images/christian/icedtea.png",             "../static/images/raspberryTea.png",             "../static/images/blackberryTea.png",             "../static/images/greenTea.png",             "../static/images/arnoldPalmer.png",             "../static/images/matchaGreenTea.jpg",             "../static/images/matchaLemonade.jpg",             "../static/images/londonFog.jpg",             "../static/images/hibiscusTea.jpg",             "../static/images/englishBreakfastLatte.jpg",             "../static/images/EarlGreyTea.jpg",             "../static/images/peachIcedTea.jpg",             "../static/images/blackCurrantTea.jpg",             "../static/images/christian/campfire.png",             "../static/images/christian/coffee.png",             "../static/images/christian/cappuccino.png",             "../static/images/christian/americano.png"         ];



       // const byteArray = await imagePathToBytes("images/icedtea.png");

      //  alert("pls work: " + byteArray);
                // Creating unique tea objects
                let tea1 = new Tea("Classic Iced Tea", 1.99, 20, imagePaths[0]);
                let tea2 = new Tea("Raspberry Tea", 2.99, 20,  imagePaths[1]);
                let tea3 = new Tea("Blackberry Tea", 2.99, 20,  imagePaths[2]);
                let tea4 = new Tea("Green Tea", 3.99, 20,  imagePaths[3]);
                let tea5 = new Tea("Arnold Palmer", 3.99, 20,  imagePaths[4]);
                let tea6 = new Tea("Matcha Green Tea Latte", 3.99, 20,  imagePaths[5]);
                let tea7 = new Tea("Matcha Lemonade", 2.99, 20,  imagePaths[6]);
                let tea8 = new Tea("London Fog", 2.99, 20, imagePaths[7]);
                let tea9 = new Tea("Hibiscus Tea", 2.99, 20, imagePaths[8]);
                let tea10 = new Tea("English Breakfast Latte", 2.99, 20, imagePaths[9]);
                let tea11 = new Tea("Earl Grey Tea", 1.99, 20,  imagePaths[10]);
                let tea12 = new Tea("Peach Iced Tea", 3.99, 20,  imagePaths[11]);
                let tea13 = new Tea("Black Currant Tea", 2.99, 20,  imagePaths[12]);
                let tea14 = new Tea("Campfire Tea", 1.99, 20,  imagePaths[13]);
        
                let coffee1 = new Tea("Cup O' Joe", 2.99, 20,  imagePaths[14]);
                let coffee2 = new Tea("Cappuccino", 3.99, 20,  imagePaths[15]);
                let coffee3 = new Tea("Americano", 2.99, 20,  imagePaths[16]);

                coffee1.isCoffee = true;
                coffee2.isCoffee = true;
                coffee3.isCoffee = true;
        
    

        // Pushing the created tea objects into the allTeas array
        allTeas.push(tea1, tea2, tea3, tea4, tea5, tea6, tea7, tea8, tea9, tea10, tea11, tea12, tea13, tea14, coffee1, coffee2, coffee3);

        // Save allTeas to localStorage
        localStorage.setItem("allTeas", JSON.stringify(allTeas));
    }

    const teaElements = []; 

    const coffeeElements = [];
    let coffeeCount = 0; // Track number of coffee items added

    let delete_elemnt  = '<button id="deleteButton"><button  class="btn btn-danger" onclick="deleteDrink(event)" >Delete</button>';
    
    allTeas.forEach((drink, index) => {
        if (!drink.isCoffee) {
            
            if (index % 3 === 0) {
                teaElements.push('<div class="row">');
            }
    
            teaElements.push(`
                <div class="col-md-4">
                    <div class="card">
                        <img src="${drink.image}" class="image1" alt="${drink.name}">
                        <div class="card-body">
                            <h5 class="card-title">${drink.name}</h5>
                            <p class="card-text">$${drink.price}</p>
                            <p class="card-text">Inventory: ${drink.amount}</p>
                            <button name="tea" value="${drink.name}" class="btn btn-primary" onclick="handleCart(event)">
                                Add To Cart</button><input type='hidden' value="${index}"></input>
                            
            `);

            if(user.isAdmin && user){
                teaElements.push(delete_elemnt);
            }
            teaElements.push('</div></div></div>')

            if (index % 3 === 2 || index === allTeas.length - 1) {
                teaElements.push('</div>');
            }
    
        } else {
            // Handling coffee elements correctly
            if (coffeeCount % 3 === 0) {
                coffeeElements.push('<div class="row">');
            }
    
            coffeeElements.push(`
                <div class="col-md-4">
                    <div class="card">
                        <img src="${drink.image}" class="image1" alt="${drink.name}">
                        <div class="card-body">
                            <h5 class="card-title">${drink.name}</h5>
                            <p class="card-text">$${drink.price}</p>
                            <p class="card-text">Inventory: ${drink.amount}</p>
                            <button name="tea" value="${drink.name}" class="btn btn-primary" onclick="handleCart(event)">
                                Add To Cart</button><input type='hidden" value="index">
                            
            `);

            if(user.isAdmin && user){
                coffeeElements.push(delete_elemnt);
            }
            coffeeElements.push('</div></div></div>')

    
            coffeeCount++; // Increment coffee counter
    
            if (coffeeCount % 3 === 0 || coffeeCount === allTeas.filter(t => t.isCoffee).length) {
                coffeeElements.push('</div>');
            }
        }
    });

    if (displayAllCoffee) {
        displayAllCoffee.innerHTML = coffeeElements.join('');
        coffeeTitle.innerText = "Our Coffee Collection";
    } else if(coffeeTitle){
        coffeeTitle.innerText = "Out Of Coffee";
    }
    
    // Display all teas in the HTML
    if (displayAllTeas) {
        displayAllTeas.innerHTML = teaElements.join('');
    }
   
    let sb = '';

    if(itemCount){ //if we are on the cart page
            // Update cart and subtotal
        let subTotal = 0;
        let totalTax = 0;

        cartItems.forEach(item => {
            let tax = item.price * 0.07;
            let totalEach = (item.price * item.amount) + tax;

            totalTax += tax;
            subTotal += totalEach;

           sb += `${item.amount}. ${item.name} price for each: $${item.price}\n`;
        });

        displaySubtotal.innerText = "$" + subTotal.toFixed(2);
        displayTax.innerText = "$" + totalTax.toFixed(2);
        itemCount.innerText = 'Items: ' + cartItems.length;
        displayElement.innerText = sb;
    }
    if (buildTable) {
        let build = '';
    

    
        
            const header = document.querySelector('header');
            const footer = document.querySelector('footer');

            document.documentElement.style.setProperty('--dynamic-header-space', `${header.offsetHeight + 20}px`);
            document.documentElement.style.setProperty('--dynamic-footer-space', `${footer.offsetHeight + 30}px`);

            let Items_and_Teas = allItems.concat(allTeas);
    
            Items_and_Teas.forEach((tea, index) => {
            let buttons = `
            <button id="deleteItemButton" onclick="deleteItem(${index})"  class="button delete-btn" >
                <span class="shadow"></span>
                <span class="edge"></span>
                <div class="front">
                    <span>Delete</span>
                </div>
            </button>
           <a href="editItem.html" class="button edit-btn">
                    <span class="shadow"></span>
                    <span class="edge"></span>
                    <div class="front">
                        <span>Edit</span>
                    </div>
                </a>
        `;
        

            //very IMPORTANT that the index is the value to idenify when deletions
           

            build += `<tr>
                <td>${index + 1}</td>
                <td>${tea.name}</td>
                <td><img src="${tea.image}" style="width:auto; height:80px;" ></td>
                <td>${tea.amount}</td>
                <td>50</td>
                <td>Tea Suppliers Inc.</td>
                <td>$${tea.price}</td>
                <td><input type="number" min="1" max="100" value="1"></td>
                <td>${buttons}</td>
            </tr>`;
        });
    
        buildTable.innerHTML = build;
    
        //window.scrollTo(0, 0); // Scroll to top after content update
    }
    

};

function handleLogin(event){

  //  localStorage.clear();
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;


    let allUsers = JSON.parse(localStorage.getItem("allUsers"));

    let loggedinUser = null;

    if(allUsers && email && password){ // text feilds must not be empty
        
        for(let logged of allUsers){

            if(logged.email.toString() === email.toString() && logged.password.toString()  === password.toString() 
                || logged.username === email && logged.password === password){ // to be dynamic they can also use there username

                    if(logged.email.toString() === "marquezjulian09@gmail.com"){ //add you account as well for admin
                        logged.isAdmin = true;
                    }
                loggedinUser = logged; // assign the obj if they are valid

                localStorage.setItem("loggedinUser", JSON.stringify(loggedinUser)); //set the user obj as "loggedin"

                 window.location.href = "profile.html"; // redirect them to there profile indicating success
                 return;
            }
        }

    }

        window.location.href = "register.html"; //locate to register as default

}

function validate(event) {
    event.preventDefault(); // Prevents form from actually submitting

    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirmPassword").value;
    
    if (password !== confirm) {
        alert("Passwords do not match.");
        return false;
    }

    const specialChars = "@!#$%^&*";
    const Caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let containsSpecial = false;
    let Capitals = false;

    for (let char of Caps) {
        if (password.includes(char)) {
            Capitals = true;
            break;
        }
    }

    for (let char of specialChars) {
        if (password.includes(char)) {
            containsSpecial = true;
            break;
        }
    }

    if (!Capitals) {
        alert("Password must contain at least one Capital. ");
        return false;
    }

    if (!containsSpecial) {
        alert("Password must contain at least one special character (@, !, #, $, %, ^, &, *).");
        return false;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return false;
    }

   if(allUsers){ 
    for(logged of allUsers){
        if(logged.email == email){ //this just checks so we dont have duplicate accounts
            alert("Email already in use.")
            return false;
        }
    }
   }

   const newUser =  new User(username,email,password,firstName,lastName); // if all is valid make a new user

   if(newUser.email === 'marquezjulian09@gmail.com'){
    newUser.isAdmin = true;
   }

   allUsers.push(newUser); // update the list

   localStorage.setItem("loggedinUser",JSON.stringify(newUser));
   localStorage.setItem("allUsers",JSON.stringify(allUsers)); // save in the local data as JSON to Access it later as an Obj

   window.location.href = "profile.html";

   
}

function deleteAccount(event){
    event.preventDefault(); 
    //load the obj from the local storage
    let allUsers = JSON.parse(localStorage.getItem("allUsers"));
    let user = JSON.parse(localStorage.getItem("loggedinUser"));

    allUsers = allUsers.filter(u => u.email !== user.email); 

    // Update local storage
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    localStorage.removeItem("loggedinUser");
    
    setTimeout(() => {
    window.location.href = "login.html"; // then redirect them back to the login page
        }, 100);
}


function logout(event) {
    event.preventDefault(); 
    localStorage.removeItem("loggedinUser");
    setTimeout(() => {
        window.location.href = "../../index.html";
    }, 100);
}

class User{

    constructor(username = "",email = "",password = "",firstName = "", lastName = ""){
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isAdmin;
        this.cartItems = [];

    }


}

function addTea(event) {
    event.preventDefault();

    let teaName = document.getElementById('teaName').value;
    let teaPrice = document.getElementById('price').value;
    let amount = document.getElementById('amount').value;
    let image = document.getElementById('teaImage'); // This gets the image input
    let drinkButton = document.getElementById('toggleButton');
    let drinkType = drinkButton.dataset.state; // 'tea' or 'coffee'

    if (!teaName || !teaPrice || !amount || !image.files[0]) {
        alert("Please fill out all fields correctly");
        return;
    }

    let file = image.files[0]; // Get the first file
    let reader = new FileReader();

    reader.onload = function(event) {
        // The result will be a base64 string representing the image data
        let imageData = event.target.result;

        // Create the Tea object with the image data
        const tea = new Tea(teaName, teaPrice, amount, imageData);

        if (drinkType === "coffee") {
            tea.isCoffee = true; // Set this true
            alert("Coffee " + tea.name + " successfully added");
        } else { // Otherwise it's a normal tea
            alert("Tea " + tea.name + " successfully added");
        }

        allTeas.push(tea);
        localStorage.setItem('allTeas', JSON.stringify(allTeas));
    };

    // Read the image file as a data URL (base64)
    reader.readAsDataURL(file);
}

function deleteDrink(event){
    event.preventDefault();

    let index = document.getElementById('index').value;
        
   alert(index);

  //  allTeas.splice(index,index);



}
function deleteItem(index) {
   // event.preventDefault();

    //let index = document.getElementById('deleteItemButton').value;

    alert(index + " index recieved")

    allTeas.splice(index,1); // removing one element from the the recived index

    localStorage.setItem("allTeas", JSON.stringify(allTeas)); // update the local storage 

    window.location.href = 'inventory.html'; //reload the page to show the the difference

}

function addItem(event) {
    event.preventDefault();

    let name = document.getElementById('itemName').value;
    let supplier = document.getElementById('supplier').value;
    let price = document.getElementById('price').value;
    let amount = document.getElementById('amount').value;
    let image = document.getElementById('image');

    if (!name || !price || !amount || !supplier) {
        alert("Please fill out all fields correctly");
        return;
    }

    let imageData = "../static/images/defaultItem.png"; // Default image path
    
    if (image && image.files.length > 0) {
        let file = image.files[0]; 
        let reader = new FileReader();

        reader.onload = function(event) {
            imageData = event.target.result; 

            // Create the Item object with the image data
            const newItem = new Item(name, supplier, price, amount, imageData);

            alert("Item " + newItem.name + " added Succesfully");

            allItems.push(newItem);

            localStorage.setItem(JSON.stringify('allItems',allItems));
        };

        reader.readAsDataURL(file); // Asynchronously read the file

        return;
    } else {
        const newItem = new Item(name, supplier, price, amount, imageData);

        alert("Item " + newItem.name + " added Succesfully");

        allItems.push(newItem);

        localStorage.setItem(JSON.stringify('allItems',allItems));
    }
}


class Item{

    constructor(name,supplier,price,amount,image){
        this.name = name;
        this.supplier = supplier;
        this.price = price;
        this.amount = amount;
        this.image = image;
    }
}