import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'aaasad';