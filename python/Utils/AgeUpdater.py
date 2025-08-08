from datetime import datetime


def update_Age(dateOfBirth):
    today = datetime.today()
    dob = dateOfBirth
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

    return age
        



