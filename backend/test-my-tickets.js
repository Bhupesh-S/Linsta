// Test script to check my-tickets endpoint
const fetch = require('node-fetch');

const API_URL = 'http://192.168.43.114:5000';

async function testMyTickets() {
  try {
    // Test user token (replace with actual token from your app)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Replace with your actual token
    
    console.log('🎟️ Testing my-tickets endpoint...');
    console.log(`📡 Calling: ${API_URL}/api/events/my-tickets`);
    
    const response = await fetch(`${API_URL}/api/events/my-tickets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log(`📨 Response status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Success! Found ${data.length} tickets`);
      console.log('📋 Tickets data:', JSON.stringify(data, null, 2));
    } else {
      console.error('❌ Error:', data);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testMyTickets();
