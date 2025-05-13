import os
import random
import json
import pickle
import numpy as np

import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model
from gemini import get_gemini_response
from database_helper import query_products

# Set TensorFlow logging level
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Define base directory for file paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'model')
WORDS_PATH = os.path.join(MODEL_DIR, 'words.pkl')
CLASSES_PATH = os.path.join(MODEL_DIR, 'classes.pkl')
MODEL_PATH = os.path.join(MODEL_DIR, 'chatbot_model.keras')
INTENTS_PATH = os.path.join(BASE_DIR, 'intents.json')

def clean_up_sentence(sentence):
    lemmatizer = WordNetLemmatizer()
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    if not os.path.exists(WORDS_PATH):
        raise FileNotFoundError(f"Words file not found at {WORDS_PATH}")
    
    with open(WORDS_PATH, 'rb') as f:
        words = pickle.load(f)

    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    if not os.path.exists(CLASSES_PATH):
        raise FileNotFoundError(f"Classes file not found at {CLASSES_PATH}")
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

    with open(CLASSES_PATH, 'rb') as f:
        classes = pickle.load(f)
    
    model = load_model(MODEL_PATH)

    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.95

    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)

    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': str(r[1])})
    print(return_list)
    return return_list

def get_list_products():
    products = query_products()
    if not products:
        return "<p>❌ Hiện tại không có sản phẩm nào hoặc có lỗi khi truy vấn dữ liệu.</p>"

    # Định dạng HTML
    product_list = "".join([
        f"""
        <div class="product-item">
            <h3>{p['name']}</h3>
            <p><strong>📌 Category:</strong> {p['category_name']}</p>
            <p><strong>📝 Description:</strong> {p['description']}</p>
        </div>
        """ for p in products
    ])

    return f"""
    <div class="product-list">
        {product_list}
    </div>
    """

def get_response(intents_list, message):
    if not os.path.exists(INTENTS_PATH):
        raise FileNotFoundError(f"Intents file not found at {INTENTS_PATH}")

    if not intents_list:
        return get_gemini_response(message)

    # Load intents.json
    with open(INTENTS_PATH, encoding='utf-8') as f:
        intents_json = json.load(f)

    tag = intents_list[0]['intent']

    if tag == "list_products":
        product_list = get_list_products()
        response_template = random.choice(
            [resp for resp in intents_json['intents'] if resp['tag'] == tag][0]['responses'])
        return response_template.replace("{product_list}", product_list)

    for i in intents_json['intents']:
        if i['tag'] == tag:
            return random.choice(i['responses'])

    # Fallback to Gemini if no matching intent
    return get_gemini_response(message)