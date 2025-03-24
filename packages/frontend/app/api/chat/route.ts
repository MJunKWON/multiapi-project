import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { kv } from '@vercel/kv'
import { Ratelimit } from '@upstash/ratelimit'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000/api'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  // 메시지 내용에 따라 적절한 API 엔드포인트 선택
  let apiEndpoint = ''
  let requestBody = {}

  if (lastMessage.content.toLowerCase().includes('github')) {
    apiEndpoint = `${BACKEND_API_URL}/mcp/github/search`
    requestBody = { query: lastMessage.content }
  } else if (lastMessage.content.toLowerCase().includes('logo')) {
    apiEndpoint = `${BACKEND_API_URL}/mcp/logo/search`
    requestBody = { queries: [lastMessage.content], format: 'json' }
  } else {
    apiEndpoint = `${BACKEND_API_URL}/mcp/web/search`
    requestBody = { searchTerm: lastMessage.content }
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    
    // API 응답을 스트리밍 형식으로 변환
    const stream = OpenAIStream({
      model: 'gpt-3.5-turbo',
      messages: [
        ...messages,
        {
          role: 'assistant',
          content: JSON.stringify(data),
        },
      ],
    })

    return new StreamingTextResponse(stream)
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to process your request' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}