from flask import Flask, request, render_template, session
from user import User
from tea import Tea
from datetime import datetime
import pickle

app = Flask(__name__)
app.secret_key = 'your_secret_key'

@app.route('/login', methods=['POST'])
def submit():


    username = request.form.get('userName')
    password = request.form.get('password')

    if username == None or password == None:
        return render_template('login.html') # can not be empty

     # TODO: connect to database and check if that user exist
    # connect = Database()
     #allUsers = connect.getAllUsers()

    return render_template('profile.html')

@app.route("/")
def index():
    return render_template("index.html")
@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/login")
def login():

    return render_template("login.html")

@app.route("/handleLogin",methods=['POST'])
def handleLogin():
    email = request.form.get("email")
    password = request.form.get('password')
    allUsers = []
    allUsersData = session.get('allUsers')

    if  not allUsersData: # this means there are no users
        return render_template('register.html')

    allUsers = pickle.loads(allUsersData)

    for user in allUsers:
        if user.email == email and password == user.password:

            session['loggedinUser'] = pickle.dumps(user) # set the session
            return render_template("profile.html") # send the user to there profile

    return render_template('login.html')

@app.route("/allTeas")
def allTeas():
    return render_template("allTeas.html")

@app.route("/profile")
def profile():
    return render_template("profile.html")


@app.route('/teaAction', methods=['POST'])
def teaAction():
    # Get form and session data
    action = request.form.get("action")
    new_size = request.form.get("size")
    amount = request.form.get('amount', type=int)
    userData = session.get('loggedinUser')
    teaData = session.get('displayTea')
    allUsersData = session.get('allUsers')

    print(f"Amount received: {amount}")

    if not userData or not allUsersData:
        # Redirect to login if user data is missing
        return render_template('login.html')

    # Load all necessary things
    user = pickle.loads(userData)
    tea = pickle.loads(teaData)
    allUsers = pickle.loads(allUsersData)


    if action == "add":  # Add tea to cart if action is "add"
        add_Tea(user,tea,allUsers,amount)
    else:  # Update tea size if action is not "add"
        name = tea.name
        tea = Tea(name,new_size,amount)
        session["displayTea"] = pickle.dumps(tea)  # Update session with updated tea

    # Render teaInfo.html with updated tea data
    return render_template("teaInfo.html", tea=tea)

@app.route('/handleTeas', methods=['POST'])
def handleTeas():
        tea_name = request.form.get("tea")
        action = request.form.get("action")
        userData = session.get('loggedinUser') # attempting to load a user
        allUsersData = session.get('allUsers')

        new_tea = Tea(tea_name,"Small",1) # size and amount by default

        if action == "add" and userData: # if the user wants to add to there cart

            user = pickle.loads(userData)
            allUsers = pickle.loads(allUsersData)

            add_Tea(user,new_tea,allUsers,1) #just one because of the page

            return render_template("allTeas.html")
        elif action == "add": # is the user is None make them login

            return render_template("login.html")
        else: # this means the action's value was "view"
            session['displayTea'] = pickle.dumps(new_tea)
            return render_template("teaInfo.html",tea = new_tea)


@app.route('/signUp', methods=['POST'])
def signUp():

  fname = request.form.get("firstName")
  lname = request.form.get("lastName")
  email = request.form.get("email")
  password = request.form.get("password")
  cpassword = request.form.get("confirmpassword")

  allUsersData = session.get('allUsers')
  allUsers = []
  user = None

  if password != cpassword or len(password) < 8: # first check if passwords Are valid
    return render_template("register.html") # redirect them back

  if allUsersData:
      allUsers = pickle.loads(allUsersData)
      for test in allUsers:
          if email == test.email: # users with the same email can not make another account unless deleted
              return render_template('register.html')

  user = User(fname,lname,email,password) # create the user

  allUsers.append(user)

  session['allUsers'] = pickle.dumps(allUsers)
  session["loggedinUser"] = pickle.dumps(user)
  return render_template('profile.html')

@app.route('/editProfile', methods=['POST'])
def editProfile():

    user = pickle.loads(session["loggedinUser"])
    fname = request.form.get("firstName")
    lname = request.form.get("lastName")
    email = request.form.get("email")
    password = request.form.get("password")
    cpassword = request.form.get("confirmpassword")

    if fname:
        user.firstName = fname
    if lname:
        user.lastName = lname
    if email:
        user.email = email
    if password and cpassword:
        user.password = password

    allUsersData = session.get("allUsers") # now acces the list of users to remove the current user
    allUsers = pickle.loads(allUsersData)

    for remove_user in allUsers:
        if remove_user.email == user.email:
            allUsers.remove(remove_user) # this rmeoves the old user with its old data
            allUsers.append(user) # updates the list with new data

    #update the session again
    session['allUsers'] = pickle.dumps(allUsers)
    session["loggedinUser"] = pickle.dumps(user)
    return render_template('profile.html')

@app.template_filter('hidden_password')
def hidden_password(password):
    return '*' * len(password)

@app.template_filter('format_prices')
def format_prices(value):
    try:
        return "{:,.2f}".format(float(value))
    except ValueError:
        return 0

@app.route('/handleProfile', methods=['POST'])
def handleProfile():

    action = request.form.get("action")
    user_data = session.get("loggedinUser")

    if not user_data:
        return render_template("login.html") # if the user is not logged

    user = pickle.loads(user_data)
    if action == "edit":
        return render_template("editProfile.html")

    elif action == "cart":
        sub_total = get_subTotal(user)


        return render_template("cart.html",sub_total = sub_total)

    elif action == "delete":

        allUsersData = session.get("allUsers") # now acces the list of users to remove the current user
        allUsers = pickle.loads(allUsersData)

        for remove_user in allUsers:
            if remove_user.email == user.email:
                allUsers.remove(remove_user)

        # update the session
        session['allUsers'] = pickle.dumps(allUsers)
        session['loggedinUser'] = None

        return render_template('index.html')
    else:
        session["loggedinUser"] = None # set to None to indicate logged off
        return render_template("index.html")

@app.route('/checkout', methods=['POST'])
def checkout():

    action = request.form.get("action")
    user_data = session.get("loggedinUser")
    allUsersData = session.get('allUsers')
    allUsers = pickle.loads(allUsersData)
    user = pickle.loads(user_data)
    sub_total = request.form.get('sub_total')

    if action == "clear":
        user.cart.clear()

        for update_user in allUsers:
            if update_user.email == user.email:
                allUsers.remove(update_user)
                allUsers.append(user)
                sub_total = 0

        session['loggedinUser'] = pickle.dumps(user)
        session['allUsers'] = pickle.dumps(allUsers)

    else:
        if user.cards and user.cart: # both cart and cards for the user can not be empty
            return render_template('checkout.html')

        else:
            return render_template('setPayment.html')

    return render_template('cart.html',sub_total = sub_total)

@app.route('/handleCart', methods=['POST'])
def handleCart():

    amount = request.form.get('amount')
    action = request.form.get('action')
    tea_name = request.form.get('teaName')
    tea_size = request.form.get('teaSize')
    user = pickle.loads(session.get('loggedinUser'))
    allUsers = pickle.loads(session['allUsers'])
    sub_total = request.form.get('sub_total')

    if action == 'update' and amount: # this is to update the tea amount for one tea object
    #    print(f"new tea amount: {amount}")
        for update_tea in user.cart:
            if update_tea.name == tea_name and update_tea.size == tea_size:
                user.cart.remove(update_tea)
                update_tea = Tea(update_tea.name,update_tea.size,amount)
                user.cart.append(update_tea)


        sub_total = get_subTotal(user)

    else: # if the user chooese to remove the whole product itself
        for update_tea in user.cart:
            if update_tea.name == tea_name and update_tea.size == tea_size:
                user.cart.remove(update_tea)
                sub_total = float(sub_total) - float(update_tea.teaTotal)

    for update_user in allUsers:
        if user.email == update_user.email:
            allUsers.remove(update_user)
            allUsers.append(user)

    session['loggedinUser'] = pickle.dumps(user)
    session['allUsers'] = pickle.dumps(allUsers)
    return render_template('cart.html',sub_total = sub_total)

@app.context_processor
def inject_logged_in_user():
    user = None
    if "loggedinUser" in session:
        try:
            user = pickle.loads(session["loggedinUser"])  # Retrieve the user from the session

        except Exception as e:
            print(f"Error retrieving user: {e}")
        pass
    return {"user": user}

def getAllUsers():
    allUsers = None
    if "allUsers" in session:
        try:
             allUsers = pickle.loads(session["allUsers"])  # Retrieve the user from the session
        except Exception as e:
            print(f"Error retrieving users: {e}")
        pass
    return {"allUsers": allUsers}


def add_Tea(user,tea,allUsers,amount):
    tea_found = False
    for update_tea in user.cart:
        if tea.name == update_tea.name and tea.size == update_tea.size:
            tea_found = True
            new_amount = int(update_tea.amount) + int(amount)
            user.cart.remove(update_tea)
            update_tea = Tea(update_tea.name,update_tea.size,new_amount)
            user.cart.append(update_tea)
            break
    if not tea_found:
        tea = Tea(tea.name,tea.size,int(amount))
        user.cart.append(tea)

    # Update user data in allUsers
    for index, update_user in enumerate(allUsers):
        if user.email == update_user.email:
            allUsers[index] = user

    # Update session data
    session['allUsers'] = pickle.dumps(allUsers)
    session['loggedinUser'] = pickle.dumps(user)

def get_subTotal(user):
    sub_total = 0
    total = 0
    tax = 0.07 # standard NM tax

    if user.cart:
        for tea in user.cart:
            amount = 1
            for amount in range(int(tea.amount)):
                total += tea.price
        sub_total = total + (total * tax)

    return sub_total

@app.route('/setPayment', methods=['POST'])
def setPayment():

    card_type = request.form.get('card_type')
    card_number = request.form.get('card_number')
    card_holder = request.form.get('name')
    expiry = request.form.get('exp_date')
    cvv = request.form.get('cvv')

    user = pickle.loads(session['loggedinUser'])
    allUser = pickle.loads(session['allUsers'])

    today = datetime.today()

    month = expiry[5:7]
    year = expiry[:4]
    day = expiry[8:]

    print(f" expery: {year}/{month}/{day} type: {card_type} number: {card_number} name: {card_holder} cvv: {cvv}")
    #expDate =

    #if today <

    return render_template('setPayment.html')

if __name__ == '__main__':
    app.run(debug=True)
    allUsers = []
