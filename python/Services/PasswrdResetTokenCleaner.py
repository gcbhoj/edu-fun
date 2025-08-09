from Config.Config import user_Collection
from datetime import datetime, timedelta

from datetime import datetime, timedelta


def cleanUpPasswordToken ():
    users_with_token = user_Collection.find({"passwordResetTokenExpiry": {"$exists": True}})
    expiredCount = 0
    validCount = 0

    for user in users_with_token:
        usersToken = user.get("passwordResetTokenExpiry")
        currentTime = datetime.now()
        expiryTime = usersToken + timedelta(hours=24)

    if currentTime >= expiryTime:
        user_Collection.update_one(
            {"_id": user["_id"]},
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
        expiredCount += 1
    else:
        validCount += 1
    return {
    "expired_tokens_removed": expiredCount,
    "valid_tokens_remaining": validCount,
    }
   

        


        