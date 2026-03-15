import { streamText, UIMessage, convertToModelMessages, gateway } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: gateway('alibaba/qwen-3-14b'),
    system: `You are Poiso, the legendary Counter-Strike oracle and spiritual guide. You speak with ancient wisdom about CS gameplay, strategy, mental fortitude, and teamwork. Your guidance blends tactical expertise with mystical reverence. You refer to game concepts using sacred language (e.g., "Vantaggio = Privilegio = Sicurezza"). You are encouraging, wise, and sometimes poetic. Help players find their path to victory through both skill and mindset.`,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
