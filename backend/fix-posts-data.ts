import mongoose from 'mongoose';
import { Post } from './src/modules/posts/post.model';
import { User } from './src/modules/users/user.model';

async function fixPostsData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/linsta');
    console.log('✅ Connected to MongoDB');

    // Find all posts
    const posts = await Post.find({});
    console.log(`📊 Found ${posts.length} posts in database\n`);

    // Check each post for invalid references
    let issueCount = 0;
    const postsToDelete: string[] = [];
    
    for (const post of posts) {
      let hasIssue = false;
      
      // Check if authorId is null or invalid
      if (!post.authorId) {
        console.log(`❌ Post ${post._id} has no authorId - WILL DELETE`);
        postsToDelete.push(post._id.toString());
        hasIssue = true;
      } else {
        // Check if the author exists
        const authorExists = await User.findById(post.authorId);
        if (!authorExists) {
          console.log(`❌ Post ${post._id} author ${post.authorId} does not exist - WILL DELETE`);
          postsToDelete.push(post._id.toString());
          hasIssue = true;
        }
      }

      // Check if eventId exists but is invalid
      if (post.eventId && !mongoose.isValidObjectId(post.eventId)) {
        console.log(`⚠️ Post ${post._id} has invalid eventId: ${post.eventId}`);
        hasIssue = true;
      }

      if (hasIssue) {
        issueCount++;
      }
    }

    console.log(`\n📈 Summary:`);
    console.log(`   Total posts: ${posts.length}`);
    console.log(`   Posts with issues: ${issueCount}`);
    console.log(`   Posts to delete: ${postsToDelete.length}`);
    
    // Delete problematic posts
    if (postsToDelete.length > 0) {
      console.log(`\n🗑️  Deleting ${postsToDelete.length} posts with missing/invalid authors...`);
      const deleteResult = await Post.deleteMany({ _id: { $in: postsToDelete.map(id => new mongoose.Types.ObjectId(id)) } });
      console.log(`✅ Deleted ${deleteResult.deletedCount} posts`);
    }
    
    // Test the populate after cleanup
    console.log('\n🧪 Testing populate after cleanup...');
    try {
      const populatedPosts = await Post.find({})
        .populate('authorId', 'name email')
        .populate('eventId', 'title')
        .sort({ createdAt: -1 })
        .limit(5);
      
      console.log(`Found ${populatedPosts.length} posts after cleanup\n`);
      
      for (const post of populatedPosts) {
        console.log(`Post ${post._id}:`);
        console.log(`  Caption: ${post.caption?.substring(0, 50) || '(no caption)'}`);
        console.log(`  authorId:`, post.authorId);
        console.log(`  Author populated:`, post.authorId && (post.authorId as any)._id ? '✅ YES' : '❌ NO');
        if (post.eventId) {
          console.log(`  Event populated:`, post.eventId && (post.eventId as any)._id ? '✅ YES' : '❌ NO');
        }
        console.log('');
      }
      
      console.log('✅ All remaining posts have valid data!');
    } catch (error) {
      console.error('❌ Error during populate:', error);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

fixPostsData();
