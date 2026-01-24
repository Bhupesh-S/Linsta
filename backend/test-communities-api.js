// Quick test script to verify communities API endpoint
const axios = require('axios');

const API_URL = 'http://localhost:3000/api/network/communities';

async function testCommunitiesAPI() {
  try {
    console.log('📡 Testing GET /api/network/communities...\n');
    
    // You'll need a valid token - get one from your app's AsyncStorage or login
    const token = 'YOUR_AUTH_TOKEN_HERE'; // Replace with actual token
    
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Status:', response.status);
    console.log('✅ Communities found:', response.data.communities?.length || 0);
    console.log('\nCommunities:');
    response.data.communities?.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name} (${c.category}) - ${c.visibility}`);
      console.log(`     Members: ${c.memberCount}, Tags: ${c.tags?.join(', ')}`);
    });
    
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

console.log('⚠️  NOTE: You need to replace YOUR_AUTH_TOKEN_HERE with a valid JWT token');
console.log('You can get this from:');
console.log('  1. Login to the app');
console.log('  2. Check AsyncStorage for @auth_token');
console.log('  3. Or check the Network tab in React Native Debugger\n');

// testCommunitiesAPI();
