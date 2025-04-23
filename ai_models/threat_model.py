from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib
import pandas as pd

# Example data
data = {
    "text": [
        "I will kill you",
        "Let's meet tomorrow",
        "Bomb will explode at 5pm",
        "Hello, how are you?",
        "You are in danger",
        "This is a friendly message",
        "I will hurt you badly",
        "Have a good day",
        "The bomb is set to go off soon",
        "Please don't hurt me",
        "I will make you suffer",
        "Call the police, they are coming",
        "You are safe, don't worry",
        "I'm going to report you to the authorities",
        "Be careful, there is someone watching you",
        "Don't make me angry",
        "You will regret this",
        "Stay away from me or I'll harm you",
        "This is a joke, no harm intended",
        "Watch your back, you never know who is out there","Terrorist attack imminent"
    ],
 "label": [
        1, 0, 1, 0, 1,
        0, 1, 0, 1, 0,
        1, 1, 0, 1, 1,
        1, 1, 1, 0, 1,
        1
    ]
}

df = pd.DataFrame(data)

# Vectorization
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df["text"])
y = df["label"]

# Train model
model = MultinomialNB()
model.fit(X, y)

# Save both model and vectorizer separately
joblib.dump(model, "threat_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("✅ Model and vectorizer saved.")
