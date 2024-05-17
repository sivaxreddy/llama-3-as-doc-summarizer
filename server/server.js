const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const path = require('path');
const { Groq } = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(fileUpload());
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());

let groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
    groqApiKey = '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';
}

const groqClient = new Groq({ apiKey: groqApiKey });

app.post('/chat', async (req, res) => {
    try {
        if (!req.files || !req.files.pdfFile) {
            return res.status(400).send('No file uploaded.');
        }

        const pdfFile = req.files.pdfFile;
        const data = await pdfParse(pdfFile.data);
        const pdfText = data.text;

        const userQuery = req.body.query;
        const context = extractRelevantContext(pdfText, userQuery);

        const response = await getGroqChatCompletion([
            {
                role: "user",
                content: context + "\n\n" + userQuery
            }
        ], groqClient);

        res.json({ response: response.choices[0]?.message?.content || "" });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

function extractRelevantContext(pdfText, userQuery) {
    // Simple extraction logic - you might want to improve this
    return pdfText.substring(0, 1000); // Extract the first 1000 characters for context
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
