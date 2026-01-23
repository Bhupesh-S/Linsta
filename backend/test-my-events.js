/**
 * Test script for My Events and My Tickets endpoints
 */

const BASE_URL = 'http://192.168.43.114:5000/api';

async function testMyEventsEndpoints() {
  console.log('🧪 Testing My Events and My Tickets endpoints...\n');

  try {
    // Test 1: Login to get token
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.log('⚠️ Login failed (this is expected if user does not exist)');
      console.log('Creating a test user first...');
      
      const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      const registerData = await registerResponse.json();
      console.log('✅ User registered:', registerData.user?.name);
      var token = registerData.token;
    } else {
      const loginData = await loginResponse.json();
      console.log('✅ Logged in:', loginData.user?.name);
      var token = loginData.token;
    }

    // Test 2: Get My Events
    console.log('\n2️⃣ Testing GET /api/events/my-events...');
    const myEventsResponse = await fetch(`${BASE_URL}/events/my-events`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (myEventsResponse.ok) {
      const myEvents = await myEventsResponse.json();
      console.log('✅ My Events endpoint working!');
      console.log(`   Found ${myEvents.length} events created by user`);
      if (myEvents.length > 0) {
        console.log(`   Sample event: ${myEvents[0].title} (${myEvents[0].attendeeCount || 0} attendees)`);
      }
    } else {
      console.log('❌ My Events endpoint failed:', myEventsResponse.status);
    }

    // Test 3: Get My Tickets
    console.log('\n3️⃣ Testing GET /api/events/my-tickets...');
    const myTicketsResponse = await fetch(`${BASE_URL}/events/my-tickets`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (myTicketsResponse.ok) {
      const myTickets = await myTicketsResponse.json();
      console.log('✅ My Tickets endpoint working!');
      console.log(`   Found ${myTickets.length} tickets (RSVP'd events)`);
      if (myTickets.length > 0) {
        console.log(`   Sample ticket: ${myTickets[0].title}`);
      }
    } else {
      console.log('❌ My Tickets endpoint failed:', myTicketsResponse.status);
    }

    console.log('\n✨ All tests completed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMyEventsEndpoints();
