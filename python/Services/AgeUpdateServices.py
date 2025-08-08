from Config.Config import user_Collection
from Utils.AgeUpdater import update_Age
from datetime import datetime

users = user_Collection.find()


for user in users:
    print (user)
    
