class Tea:
    def __init__(self, tea, size,amount):
        self.name = tea
        self.size = size
        self.description = self.__getDescription__(tea) # Making a private get tea description to make it less confusing
        self.teaImgs = {""}
        self.amount = amount
        self.images = self.__getImages__(tea)


        # Assign price based on tea type and size
        if size == "Small":
            if self.name == "Green Tea" or self.name == "Arnold Palmer":
                self.price = 3.99
            elif self.name == "Iced Tea":
                self.price = 1.99
            else:
                self.price = 2.99  # every other flavor is that price
        elif size == "Medium":
            if self.name == "Green Tea" or self.name == "Arnold Palmer":
                self.price = 4.99
            elif self.name == "Iced Tea":
                self.price = 2.54
            else:
                self.price = 3.99  # every other flavor is that price
        elif size == "Large":
            if self.name == "Green Tea" or self.name == "Arnold Palmer":
                self.price = 8.99
            elif self.name == "Iced Tea":
                self.price = 6.54
            else:
                self.price = 7.99  # every other flavor is that price

        tax = (float(self.amount) * float(self.price)) * 0.07
        self.teaTotal = (float(self.amount) * float(self.price)) + tax

    def __getDescription__(self, name):
        descriptions = {
            "Green Tea": "A soothing and refreshing drink made from steamed tea leaves, known for its light flavor and health benefits.",
            "Arnold Palmer": "A delightful combination of iced tea and lemonade, perfect for a sweet and tangy refreshment.",
            "Iced Tea": "A classic cold beverage brewed from black tea, served chilled with or without a hint of sweetness.",
            "Blackberry Tea": "A fruity twist on traditional tea, infused with the sweet and tangy flavor of ripe blackberries.",
            "Raspberry Tea": "A vibrant and aromatic tea infused with the natural sweetness of raspberries, offering a refreshing taste."
        }
        return descriptions.get(name, "Description not available for this drink.")

    def __getImages__(self, name):
        images = {
            "Green Tea": ["static/images/greenTea.png", "static/images/greenTea2.png", "static/images/greenTea3.png"],
            "Arnold Palmer": ["static/images/arnoldPalmer.png", "static/images/arnoldPalmer2.jpg", "static/images/arnoldPalmer3.jpeg"],
            "Iced Tea": ["static/images/icedTea.png", "static/images/icedTea2.png", "static/images/icedTea3.png"],
            "Blackberry Tea": ["static/images/blackberryTea.png", "static/images/blackberryTea2.jpeg", "static/images/blackberryTea3.jpeg"],
            "Raspberry Tea": ["static/images/raspberryTea.png", "static/images/raspberryTea2.png", "static/images/raspberryTea3.png"]
        }
        return images.get(name, ["Images not available for this drink."])
