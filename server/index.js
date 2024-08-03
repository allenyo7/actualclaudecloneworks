require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

// Update CORS settings
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

app.use(bodyParser.json());
app.use(morgan('dev'));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function callClaudeApi(prompt) {
    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: "claude-3-opus-20240229",
                max_tokens: 1024,
                messages: [{ role: "user", content: prompt }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                }
            }
        );
        return response.data.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error.response ? error.response.data : error.message);
        throw error;
    }
}

app.post('/api/chat', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await callClaudeApi(prompt);
        res.json({ response: response });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Update port for Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});