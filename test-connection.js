// Test backend connection from different IPs
const http = require('http');

const urls = [
  'http://192.168.28.61:5000',    // Wi-Fi IP
  'http://192.168.56.1:5000',     // Ethernet IP
  'http://localhost:5000',        // Localhost
  'http://127.0.0.1:5000',        // Loopback
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.get(`${url}/api/auth/login`, (res) => {
      const duration = Date.now() - startTime;
      console.log(`✅ ${url} - Status: ${res.statusCode} (${duration}ms)`);
      resolve(true);
    });

    req.on('error', (err) => {
      console.log(`❌ ${url} - ${err.message}`);
      resolve(false);
    });

    req.setTimeout(3000, () => {
      req.destroy();
      console.log(`⏱️  ${url} - Timeout`);
      resolve(false);
    });
  });
}

async function testAll() {
  console.log('🔍 Testing backend connections...\n');
  
  for (const url of urls) {
    await testUrl(url);
  }
  
  console.log('\n✅ Test complete!');
}

testAll();
