from flask import Flask, request, render_template, session
from Database import Database
from User import User
from Card import Card
from Item import Item
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
        session['userId'] = None
        return render_template('index.html')

    # Edit
    elif action == 'edit':
        for user in Database().getAllUsers():
            if user.userId == userId:
                return render_template('editProfile.html', user= user,profilePic = base64.b64encode(user.image).decode('utf-8'))

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


@app.route('/addDrink',methods=['POST'])
def addDrink():

    teaName = request.form.get('teaName')
    supplier = request.form.get("supplier")
    price = request.form.get('price')
    amount = request.form.get('amount')
    drinkType = request.form.get('drinkType')
    image = request.files.get('teaImage')

    drink = Item(teaName,supplier,price,amount,image.read())

    if drinkType == 'Coffee':
        drink.isCoffee = True
    elif drinkType == 'Tea':
        drink.isTea = True

    Database().insertItem(drink)

    return render_template('addItem.html')
    
@app.route('/handleDrinks',methods=['POST'])
def handleDrinks():
    
    drinkId = request.form.get('drinkId')
    action = request.form.get('action')

    if action == 'remove':
        Database().deleteItem(drinkId)
        return render_template('allTeas.html', allTeas = Database().getAllItems())
    else:
        userData = session['userId']
        if userData:
            drink = None

            for _drink in Database().getAllItems():
                if int(_drink.id) == int(drinkId):
                    drink = _drink
                    drink.amount = 1 # only add one drink 

            userId = pickle.loads(userData)

            if userId:
                user = None
                hasDrink = False
                for _user in Database().getAllUsers():
                    if int(_user.userId) == int(userId):
                        user = _user

                for i in range(len(user.cart)):
                    if int(user.cart[i].id) == int(drinkId):
                        print(f'user has this item drink Id: {user.cart[i].id}')
                        user.cart[i].amount = user.cart[i].amount + 1
                        hasDrink = True
                        Database().updateUserItems(user.userId, user.cart[i])

                if not hasDrink:
                    drink.amount = 1
                    user.cart.append(drink)
                    print(f'passing userId: {user.userId} and dirnkId: {drink.id}')
                    Database().insertUserItem(user.userId,drink)

        return render_template('allTeas.html', allTeas = Database().getAllItems())


@app.route("/profile")
def profile():
    userData = session.get('userId')
    userId = pickle.loads(userData)
    for user in Database().getAllUsers():
        if userId == user.userId:
            hidden = len(user.password) * '*'
            return render_template('profile.html',user = user, profilePic = base64.b64encode(user.image).decode('utf-8'),password = hidden)
    else:
        return render_template('login.html')

@app.route('/handleInventory',methods = ['POST'])
def handleInventory():

    action = request.form.get('action')
    itemId = request.form.get('itemId')
    amount = request.form.get('amount')

    print(f" {action} itemId: {itemId}")

    if action == 'delete':
        Database().deleteItem(itemId)
        return render_template('inventory.html', inventory = Database().getAllItems())

    item = None
    for _item in Database().getAllItems():
        if int(_item.id) == int(itemId):
            if _item.image:
                print('image found')
            item = _item

    if action == 'edit':
        return render_template('editItem.html',item = item)

    else:
        item.amount = int(item.amount) + int(amount)
        Database().updateItem(item)

    return render_template('inventory.html', inventory = Database().getAllItems())

@app.route('/editItem',methods = ['POST'], endpoint='edit_item_post')
def editItem():

    name = request.form.get('name')
    supplier = request.form.get('supplier')
    price = request.form.get('price')
    amount = request.form.get('amount')
    drinkType = request.form.get('drinkType') # only if its a drink
    image = request.files.get('teaImage')
    itemId = int(request.form.get('itemId'))

    for item in Database().getAllItems():
        if item.id == itemId:

            if name:
                item.name = name 
            if supplier:
                item.supplier = supplier
            if price:
                item.price = price
            if amount:
                item.amount = int(amount)
            if drinkType == 'Tea':
                item.isTea = True
                item.isCoffee = False
            if drinkType == 'Coffee':
                item.isTea = False
                item.isCoffee = True
            if image:
                item.image[0] = image.read()

            Database().updateItem(item)

    return render_template('inventory.html',inventory = Database().getAllItems())


@app.route('/cartActions',methods=['POST'])
def cartActions():

    action = request.form.get('action')
    drinkId = request.form.get('drinkId')
    userData = session.get('userId')

    if userData:
        user = None
        userId = pickle.loads(userData)

        for _user in Database().getAllUsers():
            if int(userId) == int(_user.userId):
                user = _user

        if action == "clear":
            user.cart = [] or None
            Database().clearUsersCart(int(user.userId))
            count = 0
            try:
                count = len(user.cart) 
            except Exception as e:
                count = 0
                
            return render_template('cart.html',cart = user.cart,itemCount = count,subTotal = 0, tax = 0)

        drink = None

        for _drink in user.cart:
            if int(_drink.id) == int(drinkId):
                drink = _drink

        if action == 'remove':
            if drink.amount == 1:
                Database().removeItemForUser(drinkId,user.userId)
            else:
                drink.amount = drink.amount - 1
                Database().updateUserItems(user.userId,drink)

        if action == 'add':
            drink.amount = drink.amount + 1
            Database().updateUserItems(user.userId,drink)

        if action == 'removeDrink': # remove the whole object
            Database().removeItemForUser(drinkId,user.userId)

        for _user in Database().getAllUsers(): # this reloads the changes 
            if int(userId) == int(_user.userId):
                user = _user

        count = 0
        try:
            count = len(user.cart) 
        except Exception as e:
            count = 0

        subTotal = float("{:.2f}".format(calculateTotal(user.cart) + caculateTax(user.cart)))        
        return render_template('cart.html',cart = user.cart,itemCount = count,subTotal = subTotal, tax = caculateTax(user.cart))
    else:
        return render_template('cart.html',cart = None,itemCount = 0,subTotal = 0, tax = 0)
    
    
    return render_template('cart.html',cart = None,itemCount = 0,subTotal = 0, tax = 0)

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/sales")
def Sales():
    return render_template('/Orders.html')

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
    return render_template('allTeas.html',allTeas = Database().getAllItems())

@app.route("/inventory")
def Inventory():
    return render_template('inventory.html',inventory = Database().getAllItems())

@app.route("/addItem")
def addItem():
    return render_template('addItem.html')

@app.route("/addTea")
def addTea():
    return render_template('addItem.html')

@app.route('/addPayment')
def addPayment():
    return render_template('addPayment.html')

@app.route('/addPaymentMethod',methods=['POST'])
def addPaymentMethod():

    cardNumber = request.form.get('cardNumber')
    cvv = request.form.get('cvv')
    holderName = request.form.get('nameHolder')
    cardType = request.form.get('paymentType')
    expiry = request.form.get('expiry')

    today = datetime.today()

    try:
        expiry_date = datetime.strptime(str(expiry), '%Y-%m-%d').date()
        if int(cardNumber) < 10000000 or int(cvv) < 10 or expiry_date < today:
            return render_template('addPayment.html')
    except (ValueError, TypeError):
        print(TypeError)


    userData = session.get('userId')
    userId = pickle.loads(userData)

    payment = Card(cardNumber,cvv,holderName,cardType,str(expiry))

    Database().inserUserCard(payment,userId)

    return render_template('addPayment.html')


@app.route("/cart")
def cart():
    cart = None
    userData = session.get('userId')
    userId = pickle.loads(userData)
    for user in Database().getAllUsers():
        if int(userId) == int(user.userId):
            cart = user.cart
            count = 0
            try:
                count = len(user.cart) 
            except Exception as e:
                count = 0
    
    subTotal = float("{:.2f}".format(calculateTotal(cart) + caculateTax(cart)))
    return render_template('cart.html',cart = cart,itemCount = count,subTotal = subTotal, tax = caculateTax(cart))

@app.route('/checkout')
def checkout():

    cart = None
    count = 0
    items = [] # this is just to display 4 items or less on the checkout page
    userData = session.get('userId')
    userId = pickle.loads(userData)
    for user in Database().getAllUsers():
        if int(userId) == int(user.userId):
            cart = user.cart
            
            try:
                count = len(user.cart) 
            except Exception as e:
                count = 0

    if count <= 4:
        items = cart
    else:
        items = cart[:4]       
        
    subTotal = float("{:.2f}".format(calculateTotal(cart) + caculateTax(cart)))
    return render_template('checkout.html',items = items,itemCount = count,subTotal = subTotal, tax = caculateTax(cart))

def caculateTax(items):
    tax = 0
    for item in items:
        tax += float("{:.2f}".format((item.price * item.amount) * 0.07))

    return tax

def calculateTotal(items):
    total = 0
    for item in items:
        total += float("{:.2f}".format((item.price * item.amount)))

    return total

@app.context_processor
def inject_logged_in_user():
    user = None
    if "userId" in session:
        try:
            userId = pickle.loads(session["userId"])  # Retrieve the user from the session
            for _user in Database().getAllUsers():
                if userId == _user.userId:
                    user = _user

        except Exception as e:
            print(f"Error retrieving user: {e}")
        pass
    return {"user": user}

if __name__ == '__main__':# main 
    app.run(debug=True) 


  