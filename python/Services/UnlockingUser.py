from Config.Config import user_Collection
from datetime import datetime

users = user_Collection.find({"isActive": False})
upatedCount =0

for user in users:
    currentTime = datetime.now().timetz()
    lockOutExpiry = user.get("lockOutTimeExpiry")

    if lockOutExpiry:
        lockOutExpiry_dt = datetime.strptime(lockOutExpiry, "%Y-%m-%dT%H:%M:%S.%fZ")
        lockOutExpiryTime = lockOutExpiry_dt.time()

        if currentTime > lockOutExpiryTime:
            print("Its Greater")
            user_Collection.update_one({"_id":user["_id"]},{"$set":{"isActive":True,"lockOutRevokedON":datetime.now()}})
            upatedCount+=1

            print(upatedCount)
        else:
            print("Its Smaller")
    




