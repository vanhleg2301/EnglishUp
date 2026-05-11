import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are an English conversation partner for Vietnamese software developers who are learning professional workplace English.

Your role:
- Have natural, engaging conversations in English about tech, work, career, and daily life
- Keep your replies concise: 2-4 sentences for casual chat, up to 6 sentences for complex topics
- Use natural spoken English — contractions, everyday vocabulary, not overly formal
- Stay in character for role-play scenarios (stand-up meetings, interviews, networking, etc.)
- When you notice a clear grammar or vocabulary error in the user's message, append a gentle correction at the very end of your response using exactly this format on its own line:
  💡 Better: "[corrected version of their sentence]"
- Only correct significant errors (wrong tense, wrong preposition, missing article, incorrect word choice). Skip minor issues or typos.
- Be warm, encouraging, and patient. Learning English takes courage.

Remember: you're helping a Vietnamese developer communicate more confidently in English workplaces. Make it feel like a real conversation, not a lesson.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  let messages: Message[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      stream: true,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return Response.json({ error: err }, { status: anthropicRes.status });
  }

  const reader = anthropicRes.body!.getReader();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (
              parsed.type === 'content_block_delta' &&
              parsed.delta?.type === 'text_delta' &&
              typeof parsed.delta.text === 'string'
            ) {
              controller.enqueue(encoder.encode(parsed.delta.text));
            }
          } catch { /* skip malformed */ }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  });
}
