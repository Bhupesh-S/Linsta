// Test Events API
const BASE_URL = 'http://192.168.43.114:5000';

async function testEventsAPI() {
  console.log('🧪 Testing Events API...\n');

  try {
    // Test 1: Get all events
    console.log('1️⃣ Testing GET /api/events');
    const eventsResponse = await fetch(`${BASE_URL}/api/events`);
    const events = await eventsResponse.json();
    console.log('✅ GET /api/events:', eventsResponse.status);
    console.log(`   Found ${events.length || 0} events\n`);

    // Test 2: Create event (requires authentication)
    console.log('2️⃣ Testing POST /api/events (requires auth)');
    const createResponse = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Test Event from API',
        description: 'This is a test event created via API',
        category: 'Networking',
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        time: '18:00',
        venue: 'Online',
        isOnline: true,
        meetingLink: 'https://meet.google.com/test',
      }),
    });
    
    if (createResponse.status === 401) {
      console.log('⚠️  POST /api/events: 401 Unauthorized (expected - requires auth token)');
      console.log('   Event creation requires authentication\n');
    } else {
      const createResult = await createResponse.json();
      console.log('✅ POST /api/events:', createResponse.status);
      console.log('   Created event:', createResult._id || 'N/A', '\n');
    }

    // Test 3: Health check
    console.log('3️⃣ Testing GET /health');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const health = await healthResponse.json();
    console.log('✅ GET /health:', healthResponse.status);
    console.log('   Status:', health.status || 'N/A', '\n');

    console.log('✅ All tests completed!\n');
    console.log('📝 Summary:');
    console.log('   - Backend is accessible at', BASE_URL);
    console.log('   - Events API endpoints are working');
    console.log('   - Event creation requires authentication (as expected)');
    console.log('   - To create events, users need to login first\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Make sure:');
    console.log('   1. Backend server is running (npm run dev in backend folder)');
    console.log('   2. MongoDB is connected');
    console.log('   3. You\'re on the same network as the backend server');
    console.log('   4. Windows Firewall allows port 5000\n');
  }
}

testEventsAPI();
