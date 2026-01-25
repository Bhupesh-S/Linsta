/**
 * Quick test to verify frontend can connect to backend
 * Run this from the backend terminal to test the communities endpoint
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/network/communities',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    // You'll need a real auth token here
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
};

console.log('🧪 Testing Backend Connection...\n');
console.log('Endpoint: http://localhost:5000/api/network/communities');
console.log('Method: GET\n');

const req = http.request(options, (res) => {
  console.log(`✅ Connection Status: ${res.statusCode} ${res.statusMessage}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('\n📦 Response:');
      if (parsed.communities) {
        console.log(`   Communities found: ${parsed.communities.length}`);
        parsed.communities.slice(0, 3).forEach((c, i) => {
          console.log(`   ${i + 1}. ${c.name} (${c.category}) - ${c.memberCount} members`);
        });
      } else {
        console.log('   ', JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log('   Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Connection Error: ${e.message}`);
  console.log('\n💡 Make sure:');
  console.log('   1. Backend is running: npm run dev');
  console.log('   2. Port 5000 is not blocked');
  console.log('   3. MongoDB is connected');
});

req.end();

console.log('⏳ Waiting for response...\n');
