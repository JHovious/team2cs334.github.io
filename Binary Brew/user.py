
class User:
  def __init__(self,firstName,lastName,email,password):
              self.firstName = firstName
              self.lastName = lastName
              self.email = email
              self.password = password
              self.userId = 0 #  very important when working with databases
              self.cart = [] # list of all items the user can put in there cart
              self.image = None # can possibly add bytes ad image data

  def setfisrtName(self,name):
      delf.firstName = name

  def setlastName(self,name):
      self.lastName = name

  def setPassword(self,password):
      self.password = password

  def setEmail(self,email):
      self.email = email

  def setUserId(self,id):
      self.userId = id
