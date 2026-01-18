/**
 * Create Test Notifications Script
 * 
 * This script creates test notifications in the database
 * Run this from the backend directory:
 * 
 * cd backend
 * npx ts-node create-test-notifications.ts
 */

import mongoose from 'mongoose';
import Notification from './src/modules/notifications/notification.model';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/linsta';

// User ID to create notifications for (replace with your user ID)
const TARGET_USER_ID = '6953d04158fd982dfa2e1dd6'; // Your user ID from logs

async function createTestNotifications() {
  try {
    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing test notifications (optional)
    const deleteResult = await Notification.deleteMany({
      userId: new mongoose.Types.ObjectId(TARGET_USER_ID),
      message: { $regex: /^Test/ }
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} old test notifications`);

    // Create test notifications
    const testNotifications = [
      {
        userId: new mongoose.Types.ObjectId(TARGET_USER_ID),
        type: 'LIKE',
        message: 'Test User liked your post',
        referenceId: new mongoose.Types.ObjectId(),
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      },
      {
        userId: new mongoose.Types.ObjectId(TARGET_USER_ID),
        type: 'COMMENT',
        message: 'Test User commented on your post: "Great content!"',
        referenceId: new mongoose.Types.ObjectId(),
        isRead: false,
        createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      },
      {
        userId: new mongoose.Types.ObjectId(TARGET_USER_ID),
        type: 'EVENT_RSVP',
        message: 'Test User RSVP\'d to your event',
        referenceId: new mongoose.Types.ObjectId(),
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      },
      {
        userId: new mongoose.Types.ObjectId(TARGET_USER_ID),
        type: 'NEW_POST',
        message: 'Test User shared a new post',
        referenceId: new mongoose.Types.ObjectId(),
        isRead: false,
        createdAt: new Date(Date.now() - 60 * 60000), // 1 hour ago
      },
      {
        userId: new mongoose.Types.ObjectId(TARGET_USER_ID),
        type: 'NEW_EVENT',
        message: 'Test User created a new event: "Tech Meetup 2026"',
        referenceId: new mongoose.Types.ObjectId(),
        isRead: true, // One read notification
        createdAt: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      },
      {
        userId: new mongoose.Types.ObjectId(TARGET_USER_ID),
        type: 'NEW_STORY',
        message: 'Test User posted a new story',
        referenceId: new mongoose.Types.ObjectId(),
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60000), // 3 hours ago
      },
    ];

    console.log('📝 Creating test notifications...');
    const created = await Notification.insertMany(testNotifications);
    console.log(`✅ Created ${created.length} test notifications`);

    // Show summary
    const unreadCount = await Notification.countDocuments({
      userId: new mongoose.Types.ObjectId(TARGET_USER_ID),
      isRead: false,
    });
    const totalCount = await Notification.countDocuments({
      userId: new mongoose.Types.ObjectId(TARGET_USER_ID),
    });

    console.log('\n📊 Summary:');
    console.log(`   Total notifications: ${totalCount}`);
    console.log(`   Unread: ${unreadCount}`);
    console.log(`   Read: ${totalCount - unreadCount}`);
    console.log(`\n✅ Test notifications created successfully!`);
    console.log(`\n🔄 Now open the app and navigate to Notifications screen`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the script
createTestNotifications();
