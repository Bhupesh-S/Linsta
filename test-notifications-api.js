/**
 * Test script to check notifications API
 * Run with: node test-notifications-api.js
 */

const API_URL = 'http://192.168.43.114:5000';

// Get a fresh token by logging in first
async function login() {
  console.log('🔐 Logging in to get fresh token...');
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bharanidharan5544@gmail.com',
        password: 'your-password-here', // UPDATE THIS!
      }),
    });

    if (!response.ok) {
      console.error('❌ Login failed:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('✅ Logged in successfully');
    return data.token;
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
}

async function testNotificationsAPI() {
  console.log('🧪 Testing Notifications API\n');

  // Get fresh token
  const TOKEN = await login();
  if (!TOKEN) {
    console.log('\n❌ Could not get authentication token');
    console.log('💡 Update your password in the script and try again');
    return;
  }

  console.log('\n📝 Token:', TOKEN.substring(0, 30) + '...\n');

  // Test 1: Create test notifications
  console.log('🧪 Test 1: Creating test notifications...');
  try {
    const response = await fetch(`${API_URL}/api/notifications/test/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', response.status, response.statusText);

    const data = await response.json();
    console.log('✅ Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n---\n');

  // Test 2: Fetch notifications
  console.log('📥 Test 2: Fetching notifications...');
  try {
    const response = await fetch(`${API_URL}/api/notifications?limit=50&skip=0`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', response.status, response.statusText);

    const data = await response.json();
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log('✅ Notification count:', Array.isArray(data) ? data.length : 'Not an array');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n---\n');

  // Test 3: Get unread count
  console.log('📊 Test 3: Fetching unread count...');
  try {
    const response = await fetch(`${API_URL}/api/notifications/unread/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', response.status, response.statusText);
    const data = await response.json();
    console.log('✅ Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n🎉 Test complete! Now check your app - notifications should appear!');
}

testNotificationsAPI();

  // Test 1: Get notifications
  console.log('📥 Test 1: Fetching notifications...');
  try {
    const response = await fetch(`${API_URL}/api/notifications?limit=50&skip=0`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('✅ Response:', JSON.stringify(data, null, 2));
    console.log('✅ Notification count:', Array.isArray(data) ? data.length : 'Not an array');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('\n---\n');

  // Test 2: Get unread count
  console.log('📊 Test 2: Fetching unread count...');
  try {
    const response = await fetch(`${API_URL}/api/notifications/unread/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', response.status, response.statusText);
    const data = await response.json();
    console.log('✅ Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testNotificationsAPI();
