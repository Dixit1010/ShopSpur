const http = require('http');

const request = (method, path, body) => {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        hostname: 'localhost',
        port: 4000,
        path,
        method,
        headers: body ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        } : {},
      },
      (res) => {
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
      }
    );
    req.on('error', (e) => resolve({ error: e.message }));
    if (body) req.write(data);
    req.end();
  });
};

async function runTests() {
  let passed = true;

  // CHECK 1
  let res = await request('POST', '/chat/message', { message: "" });
  if (res.status === 400 && res.body.error === "Message cannot be empty") console.log('CHECK 1: PASS');
  else { console.log('CHECK 1: FAIL', res); passed = false; }

  // CHECK 2
  res = await request('POST', '/chat/message', { message: "   " });
  if (res.status === 400 && res.body.error === "Message cannot be empty") console.log('CHECK 2: PASS');
  else { console.log('CHECK 2: FAIL', res); passed = false; }

  // CHECK 3
  res = await request('POST', '/chat/message', { message: 'a'.repeat(2001) });
  if (res.status === 400 && res.body.error === "Message too long") console.log('CHECK 3: PASS');
  else { console.log('CHECK 3: FAIL', res); passed = false; }

  // CHECK 4
  res = await request('POST', '/chat/message', { message: "'; DROP TABLE \"Message\"--" });
  if (res.status === 200 && res.body.reply) console.log('CHECK 4: PASS');
  else { console.log('CHECK 4: FAIL', res); passed = false; }

  // CHECK 5
  res = await request('POST', '/chat/message', { message: "What are your hours? 🕐😊" });
  if (res.status === 200 && res.body.reply) console.log('CHECK 5: PASS');
  else { console.log('CHECK 5: FAIL', res); passed = false; }

  // CHECK 6
  res = await request('POST', '/chat/message', { message: "ما هي سياسة الإرجاع؟" });
  if (res.status === 200 && res.body.reply) console.log('CHECK 6: PASS');
  else { console.log('CHECK 6: FAIL', res); passed = false; }

  // CHECK 7
  res = await request('GET', '/chat/thisdoesnotexist', null);
  if (res.status === 404 && res.body.error === "Session not found.") console.log('CHECK 7: PASS');
  else { console.log('CHECK 7: FAIL', res); passed = false; }

  // CHECK 8
  res = await request('POST', '/chat/message', { text: "hello" });
  if (res.status === 400 && res.body.error === "Required") console.log('CHECK 8: PASS');
  else { console.log('CHECK 8: FAIL', res); passed = false; }

  // CHECK 9
  console.log('Running Check 9 (Rate Limiter)...');
  let hit429 = false;
  for (let i = 0; i < 35; i++) {
    res = await request('POST', '/chat/message', { message: "ping" });
    if (res.status === 429) hit429 = true;
  }
  if (hit429) console.log('CHECK 9: PASS');
  else { console.log('CHECK 9: FAIL', 'Never hit 429'); passed = false; }

  if (!passed) process.exit(1);
}

runTests();
