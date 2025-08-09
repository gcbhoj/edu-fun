from Config.Config import user_Collection
from datetime import datetime, timedelta

from datetime import datetime, timedelta

def cleanUpPasswordToken():
    """
    Remove expired password reset tokens from user records in the database.

    Returns:
        dict: Counts of expired tokens removed and valid tokens remaining.
    """

    # Find all users who have a password reset token expiry timestamp set
    users_with_token = user_Collection.find({"passwordResetTokenExpiry": {"$exists": True}})

    # Counters to track how many tokens were expired and removed, and how many are still valid
    expiredCount = 0
    validCount = 0

    # Iterate over each user with a password reset token expiry
    for user in users_with_token:
        # Retrieve the expiry datetime of the user's password reset token
        usersToken = user.get("passwordResetTokenExpiry")

        # Get the current datetime
        currentTime = datetime.now()

        # Calculate the expiry time by adding 24 hours to the token timestamp
        expiryTime = usersToken + timedelta(hours=24)

        # Check if the token has expired (current time is after or equal to expiry)
        if currentTime >= expiryTime:
            # Remove the password reset token fields and set the deletion timestamp
            user_Collection.update_one(
                {"_id": user["_id"]},  # Filter by user ID to update specific user
                {
                    "$unset": {
                        "passwordResetToken": "",
                        "passwordResetTokenExpiry": ""
                    },
                    "$set": {
                        "passwordRecoveryTokenDeletedOn": datetime.now()
                    }
                }
            )
            # Increment the count of expired tokens removed
            expiredCount += 1
        else:
            # Token is still valid, increment the valid tokens counter
            validCount += 1

    # Return a summary of how many expired tokens were removed and how many valid tokens remain
    return {
        "expired_tokens_removed": expiredCount,
        "valid_tokens_remaining": validCount,
    }

   

        


        