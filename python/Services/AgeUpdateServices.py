from Config.Config import user_Collection
from Utils.AgeUpdater import update_Age
from datetime import datetime



def updateAge ():
    users = user_Collection.find()
    updated_Count =0
    for user in users:
        dob = user.get("dateOfBirth")
        userAge = user.get("age")
        if dob:
            calculatedAge = update_Age(dob)
            if userAge is None or userAge != calculatedAge:
                user_Collection.update_one(
                    {"_id": user["_id"]},  # filter to update specific user
                    {"$set": {"age": calculatedAge}}
                )
                updated_Count +=1

    return updated_Count



    
