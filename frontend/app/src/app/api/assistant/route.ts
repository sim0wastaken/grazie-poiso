// app/api/assistant/route.ts

import { openai, ASSISTANT_ID } from '@/lib/openai'
import { NextResponse } from 'next/server'
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const { message, threadId } = await req.json();

        // Use existing thread or create a new one
        let thread;
        if (threadId) {
            try {
                thread = await openai.beta.threads.retrieve(threadId);
            } catch (error) {
                thread = await openai.beta.threads.create();
            }
        } else {
            thread = await openai.beta.threads.create();
        }

        // Add user's message to the thread
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: message
        });

        // Run the assistant
        const run = await openai.beta.threads.runs.create(
            thread.id,
            { assistant_id: ASSISTANT_ID }
        );

        // Poll for completion
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

        // Wait for completion with 30s timeout
        const startTime = Date.now();
        const TIMEOUT = 30000;

        while (runStatus.status !== 'completed') {
            if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
                throw new Error(`Run failed with status: ${runStatus.status}`)
            }

            if (Date.now() - startTime > TIMEOUT) {
                throw new Error('Response timeout')
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        // Get messages after the run is completed
        const messages = await openai.beta.threads.messages.list(thread.id, {
            order: 'asc', // Get messages in chronological order
            limit: 100,   // Adjust as needed
        });

        // Find the latest assistant message for this specific run
        const relevantMessage = messages.data
            .reverse() // Start from most recent
            .find(message => 
                message.role === 'assistant' && 
                message.run_id === run.id // Match the current run
            );

        if (!relevantMessage?.content[0]) {
            throw new Error('No response from assistant');
        }

        // Check if the content is text and extract the value
        const messageContent = relevantMessage.content[0];
        
        if (messageContent.type !== 'text') {
            throw new Error('Unexpected response format: not text');
        }

        return NextResponse.json(
            {
                content: messageContent.text.value,
                threadId: thread.id
            });

    } catch (error) {
        console.error('[ASSISTANT ERROR]: ', error);
        return NextResponse.json(
            { error: 'Internal Server Error: ' + error },
            { status: 500 }
        )
    }
}