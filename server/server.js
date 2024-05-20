const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Import cors package
require('dotenv').config();
const apiKey = process.env.API_KEY;


const app = express();
const upload = multer({ dest: 'uploads/' });

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client'))); // Serve static files from 'client' directory

app.post('/upload', upload.single('pdfFile'), async (req, res) => {
    const filePath = req.file.path;
    const pdfBuffer = fs.readFileSync(filePath);
    try {
        const pdfData = await pdfParse(pdfBuffer);
        const text = pdfData.text;
        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: 'Error parsing PDF' });
    } finally {
        fs.unlinkSync(filePath); // Clean up the uploaded file
    }
});

app.post('/ask', async (req, res) => {
    const { text, question } = req.body;
    try {
        const response = await axios.post('https://api.groq.io/v1/text/completions', {
            prompt: `Given the following text: "${text}", answer the question: "${question}"`,
            max_tokens: 150,
            apiKey: process.env.GROQ_API_KEY,
            apiSecret: process.env.GROQ_API_SECRET
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.json({ answer: response.data.choices[0].text.trim() });
    } catch (error) {
        res.status(500).json({ error: 'Error querying LLM API' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
