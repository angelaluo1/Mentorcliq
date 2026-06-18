import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def connect_to_mongodb():
    """
    Connect to MongoDB database using connection string from environment variables
    """
    try:
        # Get MongoDB connection string from environment variable
        mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')

        # Create MongoDB client
        client = MongoClient(mongodb_uri)

        # Test the connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")

        # Get database (change 'mentorcliq' to your preferred database name)
        db = client['mentorcliq']

        return client, db

    except ConnectionFailure as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None, None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None, None

def main():
    # Connect to MongoDB
    client, db = connect_to_mongodb()

    if db is not None:
        # Example: Access a collection
        users_collection = db['users']

        # Example: Insert a document
        # user = {"name": "John Doe", "email": "john@example.com"}
        # result = users_collection.insert_one(user)
        # print(f"Inserted user with id: {result.inserted_id}")

        # Example: Find documents
        # for user in users_collection.find():
        #     print(user)

        print(f"Database '{db.name}' is ready to use")

        # Close the connection when done
        client.close()
        print("MongoDB connection closed")

if __name__ == "__main__":
    main()
