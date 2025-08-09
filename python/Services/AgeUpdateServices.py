from Config.Config import user_Collection
from Utils.AgeUpdater import update_Age
from datetime import datetime



def updateAge():
    """
    Update the 'age' field for users in the database based on their date of birth.

    Returns:
        int: The count of user records that were updated.
    """

    # Retrieve all user documents from the user collection
    users = user_Collection.find()

    # Initialize a counter to keep track of how many user ages were updated
    updated_Count = 0

    # Iterate over each user document fetched from the database
    for user in users:
        # Get the user's date of birth from the document
        dob = user.get("dateOfBirth")

        # Get the current stored age from the user document (if any)
        userAge = user.get("age")

        # Proceed only if date of birth is available
        if dob:
            # Calculate the current age based on date of birth
            calculatedAge = update_Age(dob)

            # Check if the stored age is missing or different from the calculated age
            if userAge is None or userAge != calculatedAge:
                # Update the user's age and the timestamp when age was updated in the database
                user_Collection.update_one(
                    {"_id": user["_id"]},  # filter to update the specific user document
                    {"$set": {"age": calculatedAge, "ageUpdatedon": datetime.now()}}
                )
                # Increment the count of updated records
                updated_Count += 1

    # Return the total number of users whose age was updated
    return updated_Count




    
