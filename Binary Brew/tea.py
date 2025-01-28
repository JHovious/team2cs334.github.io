class Tea:
    def __init__(self, tea, size):
        self.name = tea
        self.size = size
        self.teaId = 0 # this will help for the Database
        self.description = self.__getDescription__(tea) # Making a private get tea description to make it less confusing
        self.teaImgs = {""}
        self.amount = 1 # always 1 by default


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

    def __getDescription__(self, name):
        descriptions = {
            "Green Tea": "A soothing and refreshing drink made from steamed tea leaves, known for its light flavor and health benefits.",
            "Arnold Palmer": "A delightful combination of iced tea and lemonade, perfect for a sweet and tangy refreshment.",
            "Iced Tea": "A classic cold beverage brewed from black tea, served chilled with or without a hint of sweetness.",
            "Blackberry Tea": "A fruity twist on traditional tea, infused with the sweet and tangy flavor of ripe blackberries.",
            "Raspberry Tea": "A vibrant and aromatic tea infused with the natural sweetness of raspberries, offering a refreshing taste."
        }
        return descriptions.get(name, "Description not available for this drink.")
