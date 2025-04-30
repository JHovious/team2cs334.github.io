from Item import Item
from User import User
from Card import Card
import base64
import sqlite3

class Database:
    def __init__(self):
        self.connect = sqlite3.connect('brew.db')
        self.cursor = self.connect.cursor()

    def getAllUsers(self):
        users = []
        query = "SELECT user_id, first_name, last_name, email, password, username, image, isAdmin FROM users;"
        try:
            self.cursor.execute(query)
            results = self.cursor.fetchall()
            for row in results:
                print(row[5])
                user = User(row[1], row[2], row[3], row[4],row[5])  # firstName, lastName, email, password
                user.image = row[6]
                user.isAdmin = row[7]
                user.username = row[5]
                user.userId = row[0]
                user.cards = self.getAllUserCards(row[0])
                user.cart = self.getAllUserItems(row[0])
                if str(row[3]) == 'Admin@123email.com' or str(row[3]) == 'marquezjulian09@gmail.com':
                    user.isAdmin = True
                users.append(user)
            return users
        except Exception as e:
            print("Error getting users:", e)
            return []

    def updateUser(self, user):
        query = """
            UPDATE users
            SET first_name = ?,
                last_name = ?,
                email = ?,
                password = ?,
                username = ?,
                image = ?,
                isAdmin = ?
            WHERE user_id = ?;
        """
        try:
            self.cursor.execute(query, (
                user.firstName,
                user.lastName,
                user.email,
                user.password,
                user.username,
                user.image,
                user.isAdmin,
                user.userId
            ))
            self.connect.commit()  # <-- use self.connect here
            print(f"User with ID {user.userId} updated successfully.")
        except Exception as e:
            print(f"Error updating user {user.userId}:", e)

    def getAllUserCards(self, user_id):
        cards = []
        query = "SELECT id, card_number, cvv, holder_name, card_type, expiry FROM cards WHERE user_id = ?;"
        try:
            self.cursor.execute(query, (user_id,))
            results = self.cursor.fetchall()
            for row in results:
                card = Card(row[1], row[2], row[3], row[4], row[5])
                card.id = row[0]
                cards.append(card)
            return cards
        except Exception as e:
            print("Error getting user's cards:", e)
            return []

    def getAllUserItems(self, user_id):
        items = []
        query = """
        SELECT i.item_id, i.name, i.supplier, i.price, ui.amount, i.isCoffee, i.isTea
        FROM user_items ui
        JOIN items i ON ui.item_id = i.item_id
        WHERE ui.user_id = ?;
        """
        try:
            self.cursor.execute(query, (user_id,))
            results = self.cursor.fetchall()
            for row in results:
                images = self.getAllItemsImages(row[0])  # Get images by item id
                first_image = images[0] if images else None

                # Create the Item object
                item = Item(row[1], row[2], row[3], row[4], first_image)
                item.id = row[0]   # Set the item id
                item.isCoffee = row[5]
                item.isTea = row[6]

                # Add other images if they exist
                if images:
                    for img in images:
                        if img is not None:
                            item.image.append(img)

                items.append(item)
            return items
        except Exception as e:
            print("Error getting user's items:", e)
            return []


    def clearUsersCart(self,userId):

        query = 'DELETE FROM user_items WHERE user_id = ?;'

        try:
            self.cursor.execute(query, (userId,))
            self.connect.commit()
        except Exception as e:
            print(f"Error deleting user's Item {userId}:", e)
            self.connect.rollback()

    def deleteUser(self, user_id):
        try:
            query = "DELETE FROM users WHERE user_id = ?;"
            self.cursor.execute(query, (user_id,))
            self.connect.commit()
            print(f"User {user_id} deleted successfully.")
        except Exception as e:
            print(f"Error deleting user {user_id}:", e)
            self.connect.rollback()


    def getAllItems(self):
        items = []
        query = "SELECT item_id, name, supplier, price, amount, isCoffee, isTea FROM items;"
        try:
            self.cursor.execute(query)
            results = self.cursor.fetchall()
            for row in results:
                images = self.getAllItemsImages(row[0])
                item = Item(row[1], row[2], row[3], row[4], images[0])
                item.id = row[0]
                item.isCoffee = row[5] 
                item.isTea = row[6]
                for i in range(len(images)):
                    if images[i] is not None:
                        item.image.append(images[i])
                items.append(item)
            return items
        except Exception as e:
            print("Error getting items:", e)
            return []

    def getAllItemsImages(self, item_id):
        item_images = []
        query = "SELECT image FROM item_images WHERE item_id = ?;"
        try:
            self.cursor.execute(query, (item_id,))
            results = self.cursor.fetchall()
            for row in results:
                item_images.append(row[0]) 
            return item_images
        except Exception as e:
            print("Error getting images:", e)
            return []

    def deleteItem(self, item_id):
        try:
            query = "DELETE FROM items WHERE item_id = ?;"
            delete_images_query = "DELETE FROM item_images WHERE item_id = ?;"
            self.cursor.execute(query, (item_id,))
            self.cursor.execute(delete_images_query, (item_id,))
            self.connect.commit()
        except Exception as e:
            print(f"Error deleting item {item_id}:", e)
            self.connect.rollback()

    def updateItem(self, item):
        item_query = """
            UPDATE items
            SET name = ?,
                supplier = ?,
                price = ?,
                amount = ?,
                isCoffee = ?,
                isTea = ?
            WHERE item_id = ?;
        """
        delete_images_query = "DELETE FROM item_images WHERE item_id = ?;"
        insert_image_query = "INSERT INTO item_images (item_id, image) VALUES (?, ?);"

        try:
            # Update the main item info
            self.cursor.execute(item_query, (
                item.name,
                item.supplier,
                item.price,
                item.amount,
                item.isCoffee,
                item.isTea,
                item.id
            ))

            self.cursor.execute(delete_images_query, (item.id,))

            # Insert new images
            for image in item.image:  
                self.cursor.execute(insert_image_query, (item.id, image))

            # Commit all changes
            self.connect.commit()
            print(f"Item with ID {item.id} and its images updated successfully. {item.name}")

        except Exception as e:
            print(f"Error updating item {item.id} and its images:", e)

    def updateUserItems(self, user_id, item):
    # Prepare the SQL query to update the user item in the cart
        query = """
            UPDATE user_items
            SET amount = ? WHERE user_id = ? AND item_id = ?;
        """
        try:
            self.cursor.execute(query, (item.amount, user_id, item.id))
            
            self.connect.commit()
            
        except Exception as e:
            print("Error updating user item:", e)

    def removeItemForUser(self,drinkId,userId):

        query = 'DELETE FROM user_items WHERE item_id = ? and user_id = ?;'

        try:
            self.cursor.execute(query, (drinkId, userId))
            
            self.connect.commit()
            
        except Exception as e:
            print("Error clearing user item:", e)


    def clearUsersCart(self,userId):

        query = 'DELETE FROM user_items WHERE user_id = ?;'

        try:
            self.cursor.execute(query, (userId,))
            self.connect.commit()
        except Exception as e:
            print("Error clearing the user'a cart:", e)

    def insertUser(self, user):
        query = "INSERT INTO users (first_name, last_name, email, password, username, image, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?);"
        try:
            self.cursor.execute(query, (user.firstName, user.lastName, user.email, user.password, user.username, user.image, user.isAdmin))
            self.connect.commit()
        except Exception as e:
            print("Error inserting user:", e)

    def insertUserItem(self, user_id, item):
        query = """
        INSERT INTO user_items (user_id, item_id, amount)
        VALUES (?, ?, ?);
        """
        try:
            cursor = self.connect.cursor()
            cursor.execute(query, (user_id, item.id, item.amount))
            self.connect.commit()
            print("User item inserted successfully.")
        except Exception as e:
            print("Failed to insert user item:", e)


    def insertItem(self, item):
        query = "INSERT INTO items (name, supplier, price, amount, isCoffee, isTea) VALUES (?, ?, ?, ?, ?, ?);"
        try:
            self.cursor.execute(query, (item.name, item.supplier, item.price, item.amount, item.isCoffee, item.isTea))
            item_id = self.cursor.lastrowid 
            self.insertItemImages(item_id, item.image)
            self.connect.commit()
        except Exception as e:
            print("Error inserting new item:", e)

    def insertItemImages(self, item_id, images):
        image_query = "INSERT INTO item_images (item_id, image) VALUES (?, ?);"
        try:
            for image in images:
                self.cursor.execute(image_query, (item_id, image))
        except Exception as e:
            print("Error inserting item images:", e)

    def inserUserCard(self,card,userId):
        query = "INSERT INTO cards (card_number, cvv, holder_name, card_type, expiry, user_id) VALUES (?, ?, ?, ?, ?, ?);"
        try:
            self.cursor.execute(query, (card.number, card.cvv, card.name, card.type, card.expiry, userId))
            self.connect.commit()
        except Exception as e:
            print("Error inserting payment for user:", e)
    