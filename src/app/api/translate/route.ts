import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const URL = 'https://translation.googleapis.com/language/translate/v2';

export async function POST(request: Request) {
    if (!API_KEY) {
        return NextResponse.json({ error: 'Google Translate API key not configured' }, { status: 500 });
    }

    try {
        const { text, targetLang } = await request.json();

        if (!text || !targetLang) {
            return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
        }

        const response = await fetch(`${URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                target: targetLang,
                format: 'text' // or 'html' if rich text
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('Google Translate API Error:', data.error);
            return NextResponse.json({ error: data.error.message }, { status: response.status });
        }

        const translatedText = data.data.translations[0].translatedText;

        return NextResponse.json({ translatedText });

    } catch (error) {
        console.error('Translation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
