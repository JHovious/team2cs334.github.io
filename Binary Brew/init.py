from flask import Flask, request, render_template, session
from user import User
from tea import Tea
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



    try:
        admin.cart.pop("Tea")  # This will raise a KeyError if "Tea" is not in the cart
    except KeyError:
        pass

    print(admin.firstName," ",admin.lastName)

    return render_template('profile.html', user = admin)

    print(f"username: {username}\npassword: {password}" )

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
    userData = session.get('loggedinUser')
    teaData = session.get('displayTea')

    if not userData:
        # Redirect to login if user data is missing
        return render_template('login.html')


    user = pickle.loads(userData)
    tea = pickle.loads(teaData)
    test = Tea("Green Tea","Large")

    if action == "add": # Add tea from cart if action is "add"

        update_cart = [] # this is used to avoid a dict error
        update_cart.append(tea)

        user.cart = update_cart # update the list
        session['loggedinUser'] = pickle.dumps(user)  # Update session
    else:
        tea.size = new_size
        session["displayTea"] = pickle.dumps(tea)  # Update session with tea

    # Render teaInfo.html with updated tea data
    return render_template("teaInfo.html", tea = tea)

@app.route('/handleTeas', methods=['POST'])
def handleTeas():
        tea_name = request.form.get("tea")
        action = request.form.get("action")
        userData = session.get('loggedinUser') # attempting to load a user

        new_tea = Tea(tea_name,"Small") # size by default

        if action == "add" and userData: # if the user wants to add to there cart
            user = pickle.loads(userData) # load the user data
            try:
                user.cart.pop(new_tea)  # This will raise a KeyError if "Tea" is not in the cart
            except KeyError:
                pass
            session['loggedinUser'] = pickle.dumps(user) # now update the session with the user and all it's data
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
      allUsers = pickle.loads("allUsers")
      for test in allUsers:
          if email == test.email:
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

    session["loggedinUser"] = pickle.dumps(user)
    return render_template('profile.html')

  #return render_template("register.html")

@app.template_filter('hidden_password')
def hidden_password(password):
    return '*' * len(password)

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
        return render_template("cart.html")
    else:
        session["loggedinUser"] = None # set to None to indicate logged off
        return render_template("index.html")

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

if __name__ == '__main__':
    app.run(debug=True)
    allUsers = []
