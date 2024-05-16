require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const { processDocument, sendMessageToLLM } = require('./llm_api');

const app = express();
const port = 3000; // Choose your desired port

app.use(express.static('public')); // Serve static files (if you have any)
app.use(fileUpload());
app.use(express.json()); // To parse JSON bodies

// Route for file uploads
app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  let uploadedFile = req.files.file; 
  const uploadPath = path.join(__dirname, 'uploads', uploadedFile.name);

  // Save the file to the uploads folder
  uploadedFile.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    try {
      // Process the document using the LLM API 
      const llmResponse = await processDocument(uploadPath); 
      res.json({ response: llmResponse });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error processing document.' });
    } finally {
      // Delete the uploaded file after processing (optional)
      fs.unlink(uploadPath, (err) => {
        if (err) {
          console.error('Error deleting uploaded file:', err);
        }
      });
    }
  });
});

// Route for sending messages
app.post('/send-message', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided.' });
  }

  try {
    const llmResponse = await sendMessageToLLM(message);
    res.json({ response: llmResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending message to LLM.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
});

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
