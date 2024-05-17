"use strict";
const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function getGroqChatCompletion(messages) {
    return groq.chat.completions.create({
        messages: messages,
        model: "llama3-8b-8192"
    });
}

module.exports = {
    getGroqChatCompletion
};
