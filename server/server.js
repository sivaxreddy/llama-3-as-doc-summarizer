const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// Endpoint to upload PDF and parse its text content
app.post('/upload', upload.single('pdfFile'), async (req, res) => {
    const pdfBuffer = req.file.buffer;
    try {
        const pdfData = await pdfParse(pdfBuffer);
        const text = pdfData.text;
        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: 'Error parsing PDF' });
    }
});

// Endpoint to ask a question about the PDF content using the LLM API
app.post('/ask', async (req, res) => {
    const { text, question } = req.body;
    try {
        const response = await axios.post('YOUR_LLM_API_URL', {
            text,
            question
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error querying LLM API' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
