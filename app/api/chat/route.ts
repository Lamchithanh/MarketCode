import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseServiceRole } from '@/lib/supabase-server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface Message {
  content: string;
  role: 'user' | 'assistant';
}

// Check rate limit - temporarily disabled for testing
async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  return {
    allowed: true,
    remaining: 999
  };
}

// Save message to database
async function saveMessage(userId: string, role: 'user' | 'assistant', content: string, tokensUsed = 0) {
  try {
    await supabaseServiceRole
      .from('ChatMessages')
      .insert({
        user_id: userId,
        role,
        content,
        tokens_used: tokensUsed,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

// Query database for AI context - simplified
async function queryDatabaseForAI(userMessage: string) {
  try {
    let context = '';
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple database query for product information
    if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('product') || lowerMessage.includes('giá')) {
      const { data: products } = await supabaseServiceRole
        .from('Product')
        .select('title, price, description')
        .limit(3);
        
      if (products && products.length > 0) {
        context += '\n\nMột số sản phẩm tại MarketCode:\n';
        products.forEach(product => {
          context += `**${product.title}**: ${product.price}đ\n`;
        });
      }
    }
    
    return context;
  } catch (error) {
    console.error('Error querying database:', error);
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, messages = [], userId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check rate limit (currently always allows)
    const rateLimit = await checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Bạn đã vượt quá giới hạn tin nhắn. Vui lòng thử lại sau.',
          remainingMessages: rateLimit.remaining
        },
        { status: 429 }
      );
    }

    // Get database context for AI
    const databaseContext = await queryDatabaseForAI(message);

    // Save user message
    await saveMessage(userId || 'guest', 'user', message);

    const systemPrompt = `Bạn là trợ lý AI của MarketCode - một nền tảng bán mã nguồn và template web chuyên nghiệp. 

THÔNG TIN VỀ MARKETCODE:
- MarketCode là marketplace bán source code, template, plugin chất lượng cao
- Chúng tôi có các sản phẩm: React, Next.js, Laravel, WordPress themes, plugins
- Giá từ 19.99đ - 99.99đ, có nhiều gói khuyến mãi
- Hỗ trợ tải xuống ngay sau khi mua, bảo hành kỹ thuật

HƯỚNG DẪN TRẢ LỜI:
1. Luôn nhiệt tình, thân thiện và chuyên nghiệp
2. Ưu tiên giới thiệu sản phẩm MarketCode khi phù hợp
3. Đưa ra lời khuyên kỹ thuật hữu ích
4. Trả lời bằng tiếng Việt
5. Không sử dụng emoji hoặc icon trong câu trả lời
6. Sử dụng **text** để làm nổi bật các phần quan trọng (sẽ được hiển thị in đậm)
7. Không tiết lộ thông tin nhạy cảm về hệ thống

ĐỊNH DẠNG TRẢ LỜI:
- Sử dụng **tên sản phẩm** để làm nổi bật tên
- Sử dụng **giá cả** để làm nổi bật giá
- Sử dụng **công nghệ** để làm nổi bật technology stack
- Không sử dụng ký hiệu như -, •, ⭐, 🎯, etc.

${databaseContext}

Hãy trả lời câu hỏi một cách hữu ích và tự nhiên!`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-5),
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';
    const tokensUsed = completion.usage?.total_tokens || 0;

    // Save AI response
    await saveMessage(userId || 'guest', 'assistant', aiResponse, tokensUsed);

    return NextResponse.json({
      response: aiResponse,
      tokensUsed,
      remainingMessages: rateLimit.remaining - 1
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);

    if (error?.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (error?.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid API configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}