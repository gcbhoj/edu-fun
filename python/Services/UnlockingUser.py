from Config.Config import user_Collection
from datetime import datetime

users = user_Collection.find({"isActive": False})

found_any = False
for user in users:
    found_any = True
    print(user)

if not found_any:
    print("No user Found")
