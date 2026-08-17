import { NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzguGUS8MaKvFRDQc5zSuWXvjOIDL-cdZ6ibbuVTPxtMtNuAo2HwaK7RQTwJlTuZXWW/exec';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { itemKey = 'trang-chu', itemName = 'Trang chủ', source = 'web' } = body;

    // Forward to Google Apps Script from Next.js server (bypasses CORS & adblock)
    const targetUrl = `${GOOGLE_SCRIPT_URL}?action=track&itemKey=${encodeURIComponent(itemKey)}&itemName=${encodeURIComponent(itemName)}&source=${encodeURIComponent(source)}&_t=${Date.now()}`;
    
    // Fire and forget or await
    fetch(targetUrl, { method: 'GET', redirect: 'follow' }).catch((err) => {
      console.warn('Google Sheet forward warning:', err.message);
    });

    return NextResponse.json({ status: 'success', message: 'Tracked successfully' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemKey = searchParams.get('itemKey') || 'trang-chu';
    const itemName = searchParams.get('itemName') || 'Trang chủ';
    const source = searchParams.get('source') || 'web';

    const targetUrl = `${GOOGLE_SCRIPT_URL}?action=track&itemKey=${encodeURIComponent(itemKey)}&itemName=${encodeURIComponent(itemName)}&source=${encodeURIComponent(source)}&_t=${Date.now()}`;
    
    fetch(targetUrl, { method: 'GET', redirect: 'follow' }).catch(() => {});

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
