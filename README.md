# 🎙️ Hindi Speech Emotion Recognition Web Application

## 📌 Overview

This project presents a **complete Speech Emotion Recognition (SER) system for Hindi audio**, covering data preprocessing, feature extraction, classical machine learning, deep learning, and web deployment.

The system identifies emotional states such as *happy, angry, sad, surprise,* and *neutral* from speech recordings.
A trained **LSTM deep learning model** is deployed via a **Flask-based web application**, enabling real-time emotion prediction from uploaded `.wav` files.

---

## 🧠 Emotions Classified

* Happy
* Angry
* Sad
* Surprise
* Calm
* Fear
* Disgust
* Neutral

---

## 📂 Project Structure

```
Speech-Emotion-Recognition/
│
├── training_notebook.ipynb          # Feature extraction, ML & DL training
├── app.py                           # Flask web application
├── speech_emotion_recognition_model.h5
├── templates/
│   └── index.html                   # Web UI
├── temp/                            # Temporary audio uploads
└── README.md
```

---

## ⚙️ Technologies Used

* **Python**
* **Librosa & SoundFile** – Audio processing
* **NumPy / Pandas** – Data handling
* **Scikit-learn** – Classical ML models & evaluation
* **TensorFlow / Keras** – LSTM deep learning model
* **Hugging Face Transformers (BERT)** – Experimental sequence classification
* **Flask** – Web application framework

---

## 🔍 Data Collection & Preprocessing

* Dataset consists of **Hindi speech audio files** labeled by emotional state
* Audio standardized to:

  * WAV format
  * Uniform sample rates
* Emotion labels inferred from directory structure
* Data normalization ensures consistent feature extraction

---

## 🎧 Feature Extraction

Audio files are transformed into numerical representations using **Librosa**:

* **MFCC (Mel Frequency Cepstral Coefficients)**
* **Chroma Features**
* **Mel-Spectrogram**
* **Spectral Contrast**

All features are **mean-pooled across time** and concatenated into a single vector for model training and inference.

---

## 🤖 Machine Learning Models

Multiple algorithms were trained and evaluated:

* **Support Vector Machine (SVM)**
* **Random Forest**
* **Decision Tree**
* **Multi-Layer Perceptron (MLP)**
* **K-Nearest Neighbors (KNN)**

Each model was assessed using:

* Accuracy
* Confusion Matrix
* Precision, Recall, and F1-score

---

## 🧠 Deep Learning Model (LSTM)

* **Architecture:** Long Short-Term Memory (LSTM)
* **Input:** Extracted audio feature vectors
* **Loss:** Sparse categorical cross-entropy
* **Optimizer:** Adam
* **Output:** Softmax emotion probabilities

The trained model is saved as:

```
speech_emotion_recognition_model.h5
```

and directly loaded into the Flask application for real-time inference.

---

## 🔬 BERT-Based Experimentation

An experimental **BERT-based sequence classification model** was explored:

* Implemented using `TFBertForSequenceClassification`
* Audio features encoded into sequential representations
* Fine-tuned with lower learning rates for stability

This experiment was conducted to evaluate transformer-based architectures for emotion recognition beyond traditional speech models.

---

## 🌐 Web Application (Flask)

### Features

* Upload Hindi `.wav` audio files
* Automatic feature extraction
* Emotion prediction using pre-trained LSTM
* JSON-based backend response
* User-friendly web interface

### Endpoints

| Route      | Method | Description                |
| ---------- | ------ | -------------------------- |
| `/`        | GET    | Home page                  |
| `/predict` | POST   | Predict emotion from audio |

---

## ▶️ Running the Application

```bash
git clone https://github.com/yourusername/speech-emotion-recognition.git
cd speech-emotion-recognition
pip install flask numpy librosa soundfile tensorflow scikit-learn transformers
python app.py
```

Access the app at:

```
http://127.0.0.1:5000/
```

---

## 📊 Evaluation Metrics

Models were evaluated using:

* **Accuracy**
* **Confusion Matrix**
* **Precision / Recall / F1-Score**

These metrics provided insight into per-emotion performance and misclassification patterns.



