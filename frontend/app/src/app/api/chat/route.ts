import { OpenAI } from 'openai';
import { openai } from '@/lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Validate request
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Invalid request body'},
                { status: 400 }
            );
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            temperature: 1,
            stream: false
        })

        return NextResponse.json(response.choices[0].message);
    } catch (error) {
        console.error('[CHAT_ERROR]: ', error);
        return NextResponse.json(
            { error: 'Internal Server error: ' + error },
            { status: 500 }
        )
    }
}