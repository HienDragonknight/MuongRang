import { NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzguGUS8MaKvFRDQc5zSuWXvjOIDL-cdZ6ibbuVTPxtMtNuAo2HwaK7RQTwJlTuZXWW/exec';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const targetUrl = `${GOOGLE_SCRIPT_URL}?action=get&_t=${Date.now()}`;
    const res = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Google Apps Script responded with ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
        totalViews: 0,
        todayViews: 0,
        topItems: []
      },
      { status: 200 }
    );
  }
}
