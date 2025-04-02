

let allUsers = JSON.parse(localStorage.getItem("allUsers")) || []; //this is for all users
let user = JSON.parse(localStorage.getItem("loggedinUser")); //this will simulate a logged in user


function handleLogin(event){

  //  localStorage.clear();
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;


    let allUsers = JSON.parse(localStorage.getItem("allUsers"));

    let loggedinUser = null;

    if(allUsers && email && password){ // text feilds must not be empty
        
        for(logged of allUsers){

            if(logged.email.toString() === email.toString() && logged.password.toString()  === password.toString() 
                || logged.username === email && logged.password === password){ // to be dynamic they can also use there username

                    if(logged.email === "marquezjulian09@gmail.com"){
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


window.onload = function(){
    const user = JSON.parse(localStorage.getItem("loggedinUser"));

    let email = document.getElementById("displayEmail");
    let username = document.getElementById("username");
    let password = document.getElementById("displayPassword");
    let fullName = document.getElementById("fullName");
    let adminOptions = document.getElementById("adminOptions");

  
    email.innerText = user.email.toString();
    username.innerText = user.username;
    fullName.innerText = user.firstName + " " + user.lastName;
    password.innerText = "*".repeat(user.password.length);

    if(user.isAdmin){
        adminOptions.innerHTML = '<a href="addTea.html" class="btn draw-border">Add Tea</a> <a href="allSales.html" class="btn draw-border">All Sales</a>'
    }


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

    }


}

