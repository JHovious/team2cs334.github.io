
let allUsers = JSON.parse(localStorage.getItem("allUsers")) || []; //this is for all users
let user = JSON.parse(localStorage.getItem("loggedinUser")); //this will simulate a logged in user


function handleLogin(event){

  //  localStorage.clear();
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;


    let allUsers = JSON.parse(localStorage.getItem("allUsers"));

    const loggedinUser = null;

    if(allUsers && email && password){ // text feilds must not be empty
        
        for(logged of allUsers){
            if(logged.email == email && logged.password == password || logged.username == email && logged.password == password){ // to be dynamic they can also use there username

                loggedinUser = logged;

                alert('User found');
                localStorage.setItem("loggedinUser", JSON.stringify(loggedinUser));

                window.location.href = "profile.html";
                return;
            }
        }

    }

        window.location.href = "register.html";
    



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
        if(logged.email == email){
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

window.onload = function(){
    let user = JSON.parse(localStorage.getItem("loggedinUser"));

    let email = document.getElementById("displayEmail");
    let username = documnet.getElementById("username");
    let password = document.getElementById("displayPassword");
    let fullName = document.getElementById("fullName");

    const sb = new StringBuilder();
    for(car of user.password){
        sb.append("*"); // keeping the password hidden but keeping the lenght 
    }

    email.innerText = user.email;
    username.innerText = user.username;
    fullName.innerText = user.firstName + " " + user.lastName;
    password.innertext = sb;

}

function logout(event){

    localStorage.removeItem("loggeinUser");

    window.location.href = "../index.html";
}


class User{

    constructor(username = "",email = "",password = "",firstName = "", lastName = ""){
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;

    }


}