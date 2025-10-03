// Netlify Function: Facebook Conversions API (Dataset)
// Reads env vars: FB_DATASET_ID, FB_ACCESS_TOKEN, FB_TEST_EVENT_CODE (optional)

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return response(405, { error: 'Method Not Allowed' });
  }

  const datasetId = process.env.FB_DATASET_ID;
  const accessToken = process.env.FB_ACCESS_TOKEN;
  const testEventCode = process.env.FB_TEST_EVENT_CODE;

  if (!datasetId || !accessToken) {
    return response(500, { error: 'Server is not configured with FB credentials' });
  }

  try {
    const body = JSON.parse(event.body || '{}');

    // Basic enrichment
    const eventTime = Math.floor(Date.now() / 1000);
    const clientIp = event.headers['x-forwarded-for'] || event.headers['client-ip'] || '';
    const userAgent = event.headers['user-agent'] || '';

    const fbEvent = {
      event_name: body.event_name || 'PageView',
      event_time: body.event_time || eventTime,
      event_id: body.event_id || undefined,
      action_source: body.action_source || 'website',
      event_source_url: body.event_source_url || undefined,
      user_data: {
        client_ip_address: clientIp,
        client_user_agent: userAgent,
      },
      custom_data: body.custom_data || {},
    };

    const payload = {
      data: [fbEvent],
      access_token: accessToken,
      test_event_code: testEventCode || undefined,
    };

    const url = `https://graph.facebook.com/v17.0/${encodeURIComponent(datasetId)}/events`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      return response(res.status, { error: 'Facebook API error', details: json });
    }

    return response(200, { ok: true, fb: json });
  } catch (err) {
    return response(500, { error: 'Unhandled error', details: String(err) });
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify(body),
  };
}


