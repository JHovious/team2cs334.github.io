import base64

class Item:
    def __init__(self, name, supplier, price, amount, image):
        self.id = 0
        self.name = name
        self.supplier = supplier
        self.price = price
        self.amount = amount
        self.image = []
        self.image.append(image)
        self.userId = 0
        self.isCoffee = False
        self.isTea = False
        self.displayImage = base64.b64encode(image).decode('utf-8')

