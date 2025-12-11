from flask import Flask, request, render_template, jsonify
import numpy as np
import librosa
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import soundfile
from tensorflow import keras

app = Flask(__name__)

# Load the pre-trained LSTM model
model_path = "speech_emotion_recognition_model.h5"
lstm_model = keras.models.load_model(model_path)

# Define emotion conversion dictionary
int2emotion_new = {
    0: "angry",
    1: "sad",
    2: "happy",
    3: "calm",
    4: "fear",
    5: "disgust",
    6: "surprise"
}

def extract_feature(file_name, **kwargs):
    mfcc = kwargs.get("mfcc", False)
    chroma = kwargs.get("chroma", False)
    mel = kwargs.get("mel", False)
    spectral_contrast = kwargs.get("spectral_contrast", False)

    with soundfile.SoundFile(file_name) as sound_file:
        X = sound_file.read(dtype="float32")
        sample_rate = sound_file.samplerate
        
        # Short-time Fourier transform
        stft = np.abs(librosa.stft(X)) if (chroma or spectral_contrast) else None
        
        result = np.array([])
        if mfcc:
            mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=80).T, axis=0)
            result = np.hstack((result, mfccs))
        if chroma:
            chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)
            result = np.hstack((result, chroma))
        if mel:
            mel = np.mean(librosa.feature.melspectrogram(y=X, sr=sample_rate).T, axis=0)
            result = np.hstack((result, mel))
        if spectral_contrast:
            spectral_contrast = np.mean(librosa.feature.spectral_contrast(S=stft, sr=sample_rate).T, axis=0)
            result = np.hstack((result, spectral_contrast))

    return result


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_path = os.path.join("temp", file.filename)
    file.save(file_path)

    try:
        # Extract features using the correct method
        features = extract_feature(file_path, mfcc=True, chroma=True, mel=True, spectral_contrast=True)
        features = np.array([features])

        # Add a timestep dimension to match the LSTM input shape (1 timestep)
        features = np.expand_dims(features, axis=1)  # Shape: (1, 1, features)

        # Predict emotion
        prediction = lstm_model.predict(features)
        emotion_index = np.argmax(prediction)

        return jsonify({'emotion': int2emotion_new.get(emotion_index, 'neutral')}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
