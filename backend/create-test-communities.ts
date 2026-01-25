/**
 * Script to seed test communities in the database
 * Run with: ts-node create-test-communities.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Community } from './src/modules/network/community.model';
import { CommunityMember } from './src/modules/network/community-member.model';
import { User } from './src/modules/users/user.model';

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/linsta';

const testCommunities = [
  {
    name: 'Tech Innovators',
    description: 'A community for technology enthusiasts, developers, and innovators to share ideas and collaborate on cutting-edge projects.',
    category: 'Technology',
    visibility: 'public' as const,
    tags: ['programming', 'AI', 'startups', 'innovation'],
    rules: 'Be respectful, no spam, share knowledge, help others grow.',
  },
  {
    name: 'Business Leaders Network',
    description: 'Connect with business professionals, entrepreneurs, and executives. Share insights on leadership, strategy, and growth.',
    category: 'Business',
    visibility: 'public' as const,
    tags: ['leadership', 'entrepreneurship', 'strategy', 'networking'],
    rules: 'Professional conduct required. No promotional spam. Engage in meaningful discussions.',
  },
  {
    name: 'Healthcare Professionals',
    description: 'Private community for healthcare workers to discuss industry trends, best practices, and challenges.',
    category: 'Healthcare',
    visibility: 'private' as const,
    tags: ['medicine', 'nursing', 'healthcare', 'wellness'],
    rules: 'Maintain patient confidentiality. Evidence-based discussions only. Respectful debate encouraged.',
  },
  {
    name: 'Digital Marketing Hub',
    description: 'Master the art of digital marketing. Discuss SEO, social media, content strategy, and analytics.',
    category: 'Marketing',
    visibility: 'public' as const,
    tags: ['SEO', 'social media', 'content', 'analytics', 'ads'],
    rules: 'Share actionable insights. No self-promotion without value. Cite your sources.',
  },
  {
    name: 'UX/UI Designers',
    description: 'A creative space for designers to showcase work, get feedback, and discuss design trends and tools.',
    category: 'Design',
    visibility: 'public' as const,
    tags: ['UX', 'UI', 'Figma', 'prototyping', 'design thinking'],
    rules: 'Constructive feedback only. Credit original work. No portfolio spam.',
  },
  {
    name: 'Finance & Investment Club',
    description: 'Discuss stocks, cryptocurrencies, real estate, and investment strategies with fellow finance enthusiasts.',
    category: 'Finance',
    visibility: 'private' as const,
    tags: ['stocks', 'crypto', 'investing', 'trading', 'wealth'],
    rules: 'Not financial advice. Do your own research. Share learning resources.',
  },
  {
    name: 'EdTech Pioneers',
    description: 'Educators and technologists collaborating to transform education through technology and innovation.',
    category: 'Education',
    visibility: 'public' as const,
    tags: ['education', 'e-learning', 'teaching', 'edtech', 'students'],
    rules: 'Focus on practical applications. Share teaching resources. Respect diverse learning approaches.',
  },
  {
    name: 'Software Engineers Lounge',
    description: 'Code, debug, and build together. A community for software engineers of all experience levels.',
    category: 'Engineering',
    visibility: 'public' as const,
    tags: ['coding', 'software', 'algorithms', 'systems', 'architecture'],
    rules: 'Help beginners grow. Share code responsibly. Give credit where due.',
  },
];

async function seedCommunities() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the first user to be the creator
    const firstUser = await User.findOne();
    if (!firstUser) {
      console.error('❌ No users found. Please create a user first.');
      process.exit(1);
    }

    console.log(`👤 Using user: ${firstUser.email} (${firstUser._id}) as community creator`);

    // Clear existing communities (optional - comment out if you want to keep existing ones)
    await Community.deleteMany({});
    await CommunityMember.deleteMany({});
    console.log('🗑️  Cleared existing communities');

    // Create communities
    for (const communityData of testCommunities) {
      const community = await Community.create({
        ...communityData,
        createdBy: firstUser._id,
      });

      // Add creator as admin member
      await CommunityMember.create({
        communityId: community._id,
        userId: firstUser._id,
        role: 'admin',
        status: 'active',
        joinedAt: new Date(),
      });

      console.log(`✅ Created community: ${community.name} (${community.visibility})`);
    }

    console.log(`\n🎉 Successfully created ${testCommunities.length} communities!`);
    console.log('\nNext steps:');
    console.log('1. Restart your backend server if needed');
    console.log('2. Open the app and navigate to Communities tab');
    console.log('3. Pull to refresh to see the new communities');

  } catch (error) {
    console.error('❌ Error seeding communities:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
seedCommunities();
