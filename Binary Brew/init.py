from flask import Flask, request, render_template
from user import User
from database import Database
from tea import Tea

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def submit():


    username = request.form.get('userName')
    password = request.form.get('password')

    if username == None or password == None:
        return render_template('login.html') # can not be empty

     # TODO: connect to database and check if that user exist
    # connect = Database()
     #allUsers = connect.getAllUsers()


    admin = User("Julian","Marquez",username,password)
    Database.insertUser(admin)
    try:
        admin.cart.pop("Tea")  # This will raise a KeyError if "Tea" is not in the cart
    except KeyError:
        pass

    print(admin.firstName," ",admin.lastName)

    return render_template('profile.html', username=username, password=password)

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

@app.route("/allTeas")
def allTeas():
    return render_template("allTeas.html")


if __name__ == '__main__':
    app.run(debug=True)
