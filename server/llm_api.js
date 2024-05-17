require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Replace with your LLM API details
const LLM_API_KEY = process.env.LLM_API_KEY;
const LLM_API_URL = 'https://api.groq.com/v1/analyze'; // Your LLM API endpoint

async function processDocument(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8'); // Read file contents

    const response = await axios.post(LLM_API_URL, {
      api_key: LLM_API_KEY,
      document: fileContent // Or use other data fields your API requires
    });

    // Process the LLM API response
    if (response.status === 200) {
      return response.data; // Assuming the API returns relevant data in response.data
    } else {
      throw new Error(`LLM API request failed with status ${response.status}`);
    }

  } catch (error) {
    throw error; 
  }
}

async function sendMessageToLLM(message) {
  const apiKey = LLM_API_KEY;
  // Your logic to send a message to the LLM API
  // Example:
  const response = await axios.post('https://api.example.com/send-message', {
    message,
    apiKey
  });
  return response.data;
}

module.exports = { processDocument, sendMessageToLLM };
