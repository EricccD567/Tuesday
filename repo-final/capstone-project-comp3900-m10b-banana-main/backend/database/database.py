"""
MongoDBAccess class that contains a set of methods responsible for extracting information from MongoDB.
"""

import motor.motor_asyncio

class MongoDBAccess:
    def __init__(self):
        self.client = motor.motor_asyncio.AsyncIOMotorClient("mongodb+srv://backend:comp3900@comp3900.3ejklkp.mongodb.net/?retryWrites=true&w=majority")

    def get_client(self):
        return self.client

    # Returns all the entries in the specified collection
    async def get_all_entries(self, collection_name):
        db = self.client['Tuesday']
        collection = db[f'{collection_name}']
        cursor = collection.find().sort('_id')
        return_list = []
        for document in await cursor.to_list(length=100):
            return_list.append(document)
        return return_list

    # Get uid from token
    async def get_uid_from_token(self, token):
        db = self.client['Tuesday']
        collection = db['Users']
        document = await collection.find_one({'token': token})
        if document is None:
            return None
        return document.get('_id')

    # Count number of entries in a collection and return it
    async def count_collection(self, collection_name):
        db = self.client['Tuesday']
        collection = db[f'{collection_name}']
        return await collection.count_documents({})

    # Insert the given document into the given collection
    async def insert_document(self, collection_name, document):
        db = self.client['Tuesday']
        collection = db[f'{collection_name}']
        _ = await collection.insert_one(document)

    # Get a task from the id
    async def get_task_from_tid(self, id):
        db = self.client['Tuesday']
        collection = db['Tasks']
        document = await collection.find_one({'_id': id})
        return document

    # Get a task that matches the given title
    async def get_task_from_title(self, title):
        db = self.client['Tuesday']
        collection = db['Tasks']
        cursor = collection.find({'title': {"$regex": title}})
        return_list = []
        for document in await cursor.to_list(length=100):
            return_list.append(document)
        return return_list    

    # Get a task that matches the given description
    async def get_task_from_description(self, description):
        db = self.client['Tuesday']
        collection = db['Tasks']
        cursor = collection.find({'description': {"$regex": description}})
        return_list = []
        for document in await cursor.to_list(length=100):
            return_list.append(document)
        return return_list

    # Get a task that matches the given deadline
    async def get_task_from_deadline(self, deadline):
        db = self.client['Tuesday']
        collection = db['Tasks']
        cursor = collection.find({'deadline': deadline})
        return_list = []
        for document in await cursor.to_list(length=100):
            return_list.append(document)
        return return_list    

    # Edits the document that matches the given id in the given collection with the new document
    async def edit_document(self, collection_name, document_id, new_document):
        db = self.client['Tuesday']
        collection = db[f'{collection_name}']
        _ = await collection.replace_one({'_id': document_id}, new_document)

    # Get user from token
    async def get_user_from_token(self, token):
        db = self.client['Tuesday']
        collection = db['Users']
        document = await collection.find_one({'token': token})
        return document

    # Get user from email
    async def get_user_from_email(self, email):
        db = self.client['Tuesday']
        collection = db['Users']
        document = await collection.find_one({'email': email})
        return document

    # Get user from uid
    async def get_user_from_uid(self, uid):
        db = self.client['Tuesday']
        collection = db['Users'] 
        document = await collection.find_one({'_id': uid})
        return document

    # Get connection requests that are sent to the given uid
    async def get_connection_requests(self, uid):
        db = self.client['Tuesday']
        collection = db['Connection_Requests']
        cursor = collection.find({'receiver': uid}).sort('sender')
        return_list = []
        for document in await cursor.to_list(length=100):
            return_list.append(document.get('sender'))
        return return_list

    # Delete a request from the connection requests collection that matches the sender and receiver id
    async def delete_request(self, sender_id, receiver_id):
        db = self.client['Tuesday']
        collection = db['Connection_Requests']
        _ = await collection.find_one_and_delete({'sender':sender_id,'receiver': receiver_id})

    # Checks if a connection request is unique
    async def check_unique_request(self, sender_id, receiver_id):
        db = self.client['Tuesday']
        collection = db['Connection_Requests']
        document = await collection.find_one({'sender':sender_id,'receiver': receiver_id})
        if document is not None:
            return False
        return True
