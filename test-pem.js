const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function cleanPrivateKey(rawKey) {
  let body = rawKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '');
  
  body = body
    .replace(/\\n/g, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .replace(/\s+/g, '');
  
  // Wrap at 64 chars
  const lines = [];
  for (let i = 0; i < body.length; i += 64) {
    lines.push(body.substring(i, i + 64));
  }
  const formattedBody = lines.join('\n');
  
  return `-----BEGIN PRIVATE KEY-----\n${formattedBody}\n-----END PRIVATE KEY-----\n`;
}

try {
  const serviceAccountPath = path.resolve(__dirname, 'backend/firebase-service-account.json');
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  const rawKey = serviceAccount.private_key;
  
  console.log('Original Key Starts with:', rawKey.substring(0, 50));
  
  const cleanedKey = cleanPrivateKey(rawKey);
  console.log('Cleaned Key:\n', cleanedKey);
  
  // Try loading it with crypto
  crypto.createPrivateKey(cleanedKey);
  console.log('✅ Success! The PEM key is valid and parsed successfully by Node.js crypto!');
} catch (error) {
  console.error('❌ Failed:', error.message);
}
