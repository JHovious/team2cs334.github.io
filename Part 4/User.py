
class User:
  def __init__(self,firstName,lastName,email,password,username):
              self.firstName = firstName
              self.lastName = lastName
              self.email = email
              self.password = password
              self.username = username
              self.userId = 0 #  very important when working with databases
              self.cart = [] # list of all items the user can put in there cart
              self.image = None # can possibly add bytes ad image data
              self.cards = [] # list of credit/debit cards associated with the user
              self.isAdmin = False


