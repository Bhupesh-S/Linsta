// Job Types for Network Jobs Feature

export type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';
export type ApplicationStatus = 'applied' | 'in_review' | 'rejected' | 'accepted';

// Job state per user
export interface JobUserState {
  isSaved: boolean;
  hasApplied: boolean;
  applicationStatus?: ApplicationStatus;
  appliedDate?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salary: string;
  description: string;
  skills: string[];
  postedDate: string;
  applicantsCount: number;
  
  // Extended fields for detail screen
  fullDescription?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  companyDescription?: string;
  companySize?: string;
  companyIndustry?: string;
  applicationDeadline?: string;
  isActive?: boolean;
  applyType?: 'easy' | 'external';
  externalApplyUrl?: string;
  
  // User state
  userState?: JobUserState;
}

// Mock jobs data with detailed information
export const mockJobs: Job[] = [
  {
    id: 'j1',
    title: 'Senior React Native Developer',
    company: 'Tech Mahindra',
    companyLogo: '🏢',
    location: 'Bangalore, India',
    type: 'full_time',
    experienceLevel: 'senior',
    salary: '₹15-25 LPA',
    description: 'We are looking for an experienced React Native developer to join our mobile team.',
    fullDescription: 'We are seeking a talented Senior React Native Developer to join our growing mobile development team. You will be responsible for building high-quality, scalable mobile applications for both iOS and Android platforms.\n\nAs a Senior Developer, you will work closely with product managers, designers, and other engineers to deliver exceptional user experiences. You will also mentor junior developers and contribute to our technical architecture decisions.',
    skills: ['Mobile', 'React Native', 'TypeScript'],
    requirements: [
      '5+ years of mobile development experience',
      'Strong proficiency in React Native and TypeScript',
      'Experience with Redux or similar state management',
      'Knowledge of native iOS/Android development',
      'Experience with RESTful APIs and GraphQL',
      'Strong problem-solving and debugging skills',
    ],
    responsibilities: [
      'Design and build advanced mobile applications',
      'Collaborate with cross-functional teams',
      'Ensure app performance and quality',
      'Identify and fix bugs and performance bottlenecks',
      'Mentor junior developers',
      'Participate in code reviews',
    ],
    benefits: [
      'Competitive salary and equity',
      'Health insurance for family',
      'Flexible work hours',
      'Remote work options',
      'Learning and development budget',
      'Annual team offsites',
    ],
    companyDescription: 'Tech Mahindra is a leading provider of digital transformation, consulting, and business re-engineering services. We are a USD 6+ billion company with 157,000+ professionals across 90 countries.',
    companySize: '10,000+ employees',
    companyIndustry: 'IT Services & Consulting',
    postedDate: '2024-01-15',
    applicantsCount: 45,
    applicationDeadline: '2024-02-15',
    isActive: true,
    applyType: 'easy',
    userState: {
      isSaved: false,
      hasApplied: false,
    },
  },
  {
    id: 'job2',
    title: 'AI/ML Engineer',
    company: 'Infosys',
    companyLogo: '🤖',
    location: 'Hyderabad, India',
    type: 'full_time',
    experienceLevel: 'mid',
    salary: '₹20-30 LPA',
    postedDate: '2024-01-12',
    applicantsCount: 78,
    description: 'Join our AI research team to work on cutting-edge machine learning projects.',
    skills: ['AI', 'Machine Learning', 'Python'],
    requirements: ['Python', 'TensorFlow', 'PyTorch', 'ML algorithms', '2+ years experience'],
    isActive: true,
    applyType: 'easy',
    userState: {
      isSaved: false,
      hasApplied: false,
    },
  },
  {
    id: 'job3',
    title: 'Full Stack Developer Intern',
    company: 'Flipkart',
    companyLogo: '🛒',
    location: 'Bangalore, India',
    type: 'internship',
    experienceLevel: 'entry',
    salary: '₹40,000/month',
    postedDate: '2024-01-14',
    applicantsCount: 120,
    description: 'Summer internship opportunity for students passionate about web development.',
    skills: ['Internship', 'Full Stack', 'Web Development'],
    requirements: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    isActive: true,
    applyType: 'easy',
    userState: {
      isSaved: false,
      hasApplied: false,
    },
  },
  {
    id: 'job4',
    title: 'DevOps Engineer',
    company: 'Wipro',
    companyLogo: '☁️',
    location: 'Pune, India',
    type: 'full_time',
    experienceLevel: 'mid',
    salary: '₹12-18 LPA',
    postedDate: '2024-01-08',
    applicantsCount: 34,
    description: 'Manage and optimize our cloud infrastructure and deployment pipelines.',
    skills: ['DevOps', 'Cloud', 'AWS'],
    requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', '2+ years experience'],
    isActive: true,
    applyType: 'easy',
    userState: {
      isSaved: false,
      hasApplied: false,
    },
  },
  {
    id: 'job5',
    title: 'UI/UX Designer',
    company: 'Zomato',
    companyLogo: '🍔',
    location: 'Gurugram, India',
    type: 'full_time',
    experienceLevel: 'mid',
    salary: '₹10-16 LPA',
    postedDate: '2024-01-11',
    applicantsCount: 56,
    description: 'Design beautiful and intuitive user experiences for our mobile and web platforms.',
    skills: ['Design', 'UI/UX', 'Mobile'],
    requirements: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', '2+ years experience'],
    isActive: true,
    applyType: 'easy',
    userState: {
      isSaved: true, // Example: user has saved this job
      hasApplied: false,
    },
  },
  {
    id: 'job6',
    title: 'Backend Developer (Node.js)',
    company: 'Paytm',
    companyLogo: '💳',
    location: 'Noida, India',
    type: 'contract',
    experienceLevel: 'senior',
    salary: '₹18-28 LPA',
    postedDate: '2024-01-09',
    applicantsCount: 67,
    description: 'Build scalable backend services for our fintech platform.',
    skills: ['Backend', 'Node.js', 'Microservices'],
    requirements: ['Node.js', 'Express', 'MongoDB', 'Microservices', '3+ years experience'],
    isActive: true,
    applyType: 'external',
    externalApplyUrl: 'https://paytm.com/careers/apply',
    userState: {
      isSaved: false,
      hasApplied: true, // Example: user has already applied
      applicationStatus: 'in_review',
      appliedDate: '2024-01-10',
    },
  },
];
