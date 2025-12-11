const startRecordButton = document.getElementById('start-record');
const stopRecordButton = document.getElementById('stop-record');
const recordAgainButton = document.getElementById('record-again');
const submitButton = document.getElementById('submit');
const uploadInput = document.getElementById('upload');
const audioPlayback = document.getElementById('audio-playback');

let mediaRecorder;
let audioBlob;
let audioUrl;
let fileToSubmit = null; // To hold either the recorded blob or uploaded file
const emotions = ["Happy", "Sad", "Angry", "Neutral",  "Calm"];

function getRandomEmotion() {
    return emotions[Math.floor(Math.random() * emotions.length)];
}


startRecordButton.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
        audioBlob = event.data;
        audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;
        audioPlayback.style.display = 'block';
        recordAgainButton.disabled = false;
        submitButton.disabled = false;
        fileToSubmit = audioBlob; // Set the fileToSubmit to the recorded blob
    };
    
    mediaRecorder.start();
    startRecordButton.disabled = true;
    stopRecordButton.disabled = false;
});

stopRecordButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordButton.disabled = false;
    stopRecordButton.disabled = true;
    
    // Generate a random emotion
    const randomEmotion = getRandomEmotion(); 
    resultDiv.innerHTML = `<p>Predicted Emotion: ${randomEmotion}</p>`;
});


recordAgainButton.addEventListener('click', () => {
    audioPlayback.src = '';
    audioPlayback.style.display = 'none';
    recordAgainButton.disabled = true;
    submitButton.disabled = true;
    startRecordButton.disabled = false;
    fileToSubmit = null; // Reset the fileToSubmit
});

submitButton.addEventListener('click', async () => {
    if (!fileToSubmit) {
        alert('No audio to submit!');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileToSubmit, 'audio.wav'); // Append the audio blob or uploaded file

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `<p>Predicted Emotion: ${data.emotion}</p>`;
        } else {
            resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

const form = document.querySelector('form'); 
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    // Ensure that the fileToSubmit is either recorded or uploaded
    if (!fileToSubmit) {
        alert('Please record or upload an audio file before submitting.');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileToSubmit, 'audio.wav'); // Append the audio blob or uploaded file

    try {
        const response = await fetch('/predict', { 
            method: 'POST',
            body: formData
        });

        const data = await response.json(); 

        if (response.ok) { 
            resultDiv.innerHTML = `<p>Predicted Emotion: ${data.emotion}</p>`;
        } else {
            resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        }
    } catch (error) { 
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'audio/wav') {
        const fileUrl = URL.createObjectURL(file);
        audioPlayback.src = fileUrl;
        audioPlayback.style.display = 'block';
        recordAgainButton.disabled = false;
        submitButton.disabled = false;
        startRecordButton.disabled = true;
        stopRecordButton.disabled = true;
        fileToSubmit = file; // Set the fileToSubmit to the uploaded file
    } else {
        alert('Please upload a .wav file.');
        uploadInput.value = '';
    }
});
