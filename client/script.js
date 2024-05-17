function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  var toggleButton = document.getElementById("toggleDarkMode");
  if (document.body.classList.contains("dark-mode")) {
    toggleButton.textContent = "Light Mode";
  } else {
    toggleButton.textContent = "Dark Mode";
  }
}
document.getElementById('fileInput').addEventListener('change', uploadFile);

async function sendMessage() {
  const textInput = document.getElementById('textInput');
  const message = textInput.value;
  if (message.trim() === '') return;

  // Display the user's message
  displayMessage('You', message);

  // Clear the input box
  textInput.value = '';

  // Send the message to the server (LLM)
  try {
    const response = await fetch('/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    displayMessage('LLM', data.response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Function to handle file upload and processing for LLM API
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    displayMessage('LLM', data.response);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

function displayMessage(sender, message) {
  const chatBox = document.getElementById('chatBox');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

"use strict";
const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
async function main() {
    const chatCompletion = await getGroqChatCompletion();
    // Print the completion returned by the LLM.
    process.stdout.write(chatCompletion.choices[0]?.message?.content || "");
}
async function getGroqChatCompletion() {
    return groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "Explain the importance of fast language models"
            }
        ],
        model: "llama3-8b-8192"
    });
}
module.exports = {
    main,
    getGroqChatCompletion
};
