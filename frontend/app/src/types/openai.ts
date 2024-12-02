export type ChatMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

export type ChatResponse = {
    role: 'assistant';
    content: string;
}

export type MessageContentText = {
    type: 'text';
    text: {
        value: string;
        annotations: any[];
    };
};

export type TextContent = {
    type: 'text';
    text: {
        value: string;
        annotations: any[];
    };
}

export type ImageFileContent = {
    type: 'image_file';
    image_file: {
        file_id: string;
    };
}

export type ContentType = TextContent | ImageFileContent;

export type ThreadMessage = {
    id: string;
    object: 'thread.message';
    created_at: number;
    thread_id: string;
    role: 'assistant' | 'user';
    content: ContentType[];
    assistant_id: string;
    run_id: string;
    attachments: any[];
    metadata: Record<string, any>;
}