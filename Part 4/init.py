from flask import Flask, request, render_template, session
from Database import Database
from User import User
from werkzeug.utils import secure_filename
from datetime import datetime
import pickle
import os
import base64

# Binary Brew Started By Julian Marquez

app = Flask(__name__)
app.secret_key = 'your_secret_key'
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/handleLogin', methods=['POST'])
def submit():

    allUsers = Database().getAllUsers()

    username = request.form.get('uname')
    password = request.form.get('psw')

    if username == None or password == None:
        return render_template('login.html') # can not be empty

    if not allUsers: # database is empty option
        return render_template('register.html')

    loggedinUser = None

    for user in allUsers:
        print(f"{user.email} {user.password} {username} {password} {user.userId}")
        if user.username == username and user.password == password or user.password == password and user.email == username: # can dynamically check for both 
            session['userId'] = pickle.dumps(user.userId)  # User found, set session
            hidden = len(password) * '*'
            return render_template('profile.html',user = user,profilePic = base64.b64encode(user.image).decode('utf-8'),password = hidden)

    return render_template('login.html')


@app.route('/signUp', methods=['POST'])
def signUp():
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')
    cpassword = request.form.get('cpassword')
    profilePic = request.files.get('pic')  
    firstName = request.form.get('firstName')
    lastName = request.form.get('lastName')

    if not username or not password:
        return render_template('register.html')

    if password != cpassword or len(password) < 8:
        return render_template("register.html")

    if not any(char in '!@#$%^&*()-_=+[]{};:\'",.<>?/\\|`~' for char in password):
        return render_template('register.html')

    # Create the User object
    new_user = User(firstName, lastName, email, password,username)

    if new_user.email == 'Admin@123email.com' or new_user.email == 'marquezjulian09@gmail.com':
        new_user.isAdmin = True
    

    DEFAULT_IMAGE_PATH = r"static\images\generic_user.png"

    # Save the image if chosen to add one
    if profilePic:
        new_user.image = profilePic.read() # saving as bytes for the Database (BLOB)
    else:
            with open(DEFAULT_IMAGE_PATH, 'rb') as f:
                new_user.image = f.read()

    session['userId'] = pickle.dumps(new_user.userId)

    hidden = len(new_user.password) * '*'

    Database().insertUser(new_user)

    return render_template('profile.html',user = new_user,profilePic = base64.b64encode(new_user.image).decode('utf-8'),password = hidden)

@app.route('/accountActions', methods=['POST'])
def accountActions():
    action = request.form.get('action')

    userData = session.get('userId')
    userId = pickle.loads(userData)

    # Logout
    if action == 'logout':
        session['loggedinUser'] = None
        return render_template('index.html')

    # Edit
    elif action == 'edit':
        for user in Database().getAllUsers():
            if user.userId == userId:
                return render_template('editProfile.html', user= user)

    # Delete
    elif action == 'delete':
        print(userId)
        Database().deleteUser(userId)
        session['userId'] = None
        return render_template('login.html')

    return render_template('login.html')

@app.route('/editAccount', methods=['POST'])
def edit():
    username = request.form.get('editUsername')
    password = request.form.get('password')
    email = request.form.get('email')
    cpassword = request.form.get('confirmpassword')
    profilePic = request.files.get('pic')  
    firstName = request.form.get('firstName')
    lastName = request.form.get('lastName')
    userId = request.form.get('userId')

    # Fetch user to edit
    db = Database()
    edit = None
    for user in db.getAllUsers():
        if int(userId) == int(user.userId):
            edit = user
            break
    # Update fields if provided
    if username:
        edit.username = username

    if password:
        if password != cpassword:
            return "Passwords do not match", 400
        if len(password) < 8 or not any(char in '!@#$%^&*()-_=+[]{};:\'",.<>?/\\|`~' for char in password):
            return "Password does not meet complexity requirements", 400
        edit.password = password

    if email:
        edit.email = email

    if firstName:
        edit.firstName = firstName

    if lastName:
        edit.lastName = lastName

    if profilePic:
        edit.image = profilePic.read()  

    # Save to DB
    try:
        db.updateUser(edit)
    except Exception as e:
        print("Failed to update user:", e)
        return "Something went wrong while updating the account.", 500

    hidden = len(edit.password) * '*'
    return render_template('profile.html',user = edit, profilePic = base64.b64encode(edit.image).decode('utf-8'),password = hidden)


@app.route("/profile")
def profile():
    userData = session.get('loggedinUser')
    loggeduser = pickle.loads(userData)
    if loggeduser:
        hidden = len(loggeduser.password) * '*'
        return render_template('profile.html',user = loggeduser, profilePic = base64.b64encode(loggeduser.image).decode('utf-8'),password = hidden)
    else:
        return render_template('login.html')

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/login")
def login():
    return render_template('/login.html')

@app.route("/register")
def register():
    return render_template('/register.html')

@app.route("/recover")
def recover():
    return render_template('recover.html')

@app.route("/editProfile")
def editProfile():
    return render_template('editProfile.html')


@app.route("/editItem")
def editItem():
    return render_template('editItem.html')

@app.route("/allTeas")
def allTeas():
    return render_template('allTeas.html')

@app.route("/Inventory")
def Inventory():
    return render_template('Inventory.html',items = Database().getAllItems())

@app.route("/addItem")
def addItem():
    return render_template('addItem.html')

@app.route("/addTea")
def addTea():
    return render_template('addTea.html')

@app.route("/cart")
def cart():
    return render_template('cart.html')

if __name__ == '__main__':# main 
    app.run(debug=True) 


  