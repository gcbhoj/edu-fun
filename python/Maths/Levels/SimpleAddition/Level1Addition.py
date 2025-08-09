import random
from Maths.Functions.SimpleFunctions import addition



def level1_Questions():
    """
    Generate a list of simple addition questions for level 1.

    Returns:
        list of dict: Each dictionary contains two numbers ('number1', 'number2') 
        and their sum ('answer'). Only questions where the sum is less than or equal to 10 
        are included. The total number of questions generated is 15.
    """

    # Total number of questions to generate
    numberOfQuestions = 15

    # Counter to keep track of how many valid questions have been generated so far
    questionCount = 0

    # List to store all the generated question dictionaries
    simpleQuestions = []

    # Loop until we have generated the required number of questions
    while questionCount < numberOfQuestions:
        # Generate two random integers between 1 and 10 inclusive
        num1 = random.randint(1, 10)
        num2 = random.randint(1, 10)

        # Calculate their sum using the addition function
        total = addition(num1=num1, num2=num2)
        
        # Only accept questions where the sum is less than or equal to 10
        if total <= 10:
            # Append a dictionary with the two numbers and their sum to the list
            simpleQuestions.append({"number1": num1, "number2": num2, "answer": total})

            # Increment the question counter after adding a valid question
            questionCount += 1

    # Return the completed list of valid addition questions
    return simpleQuestions


