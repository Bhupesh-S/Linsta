export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  salary?: string;
  postedDate: string;
  description: string;
  requirements: string[];
  applicants?: number;
  logo?: string;
}

export const mockJobs: Job[] = [
  {
    id: 'job_1',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Bangalore, India',
    type: 'Full-time',
    level: 'Senior',
    salary: '₹25-35 LPA',
    postedDate: '2 days ago',
    description: 'Join our team to build scalable cloud solutions',
    requirements: ['React', 'Node.js', '5+ years experience'],
    applicants: 127,
    logo: 'briefcase',
  },
  {
    id: 'job_2',
    title: 'Product Designer',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    type: 'Full-time',
    level: 'Mid',
    salary: '₹18-25 LPA',
    postedDate: '1 week ago',
    description: 'Design innovative user experiences for enterprise products',
    requirements: ['Figma', 'UI/UX', '3+ years experience'],
    applicants: 89,
    logo: 'briefcase',
  },
  {
    id: 'job_3',
    title: 'Frontend Developer',
    company: 'Amazon',
    location: 'Mumbai, India',
    type: 'Full-time',
    level: 'Mid',
    salary: '₹15-22 LPA',
    postedDate: '3 days ago',
    description: 'Build responsive web applications using modern frameworks',
    requirements: ['React', 'TypeScript', 'CSS'],
    applicants: 234,
    logo: 'briefcase',
  },
  {
    id: 'job_4',
    title: 'Data Scientist',
    company: 'Flipkart',
    location: 'Bangalore, India',
    type: 'Full-time',
    level: 'Senior',
    salary: '₹30-40 LPA',
    postedDate: '5 days ago',
    description: 'Analyze large datasets and build ML models',
    requirements: ['Python', 'ML', 'Statistics'],
    applicants: 156,
    logo: 'briefcase',
  },
  {
    id: 'job_5',
    title: 'Marketing Intern',
    company: 'Zomato',
    location: 'Delhi, India',
    type: 'Internship',
    level: 'Entry',
    salary: '₹15-20k/month',
    postedDate: '1 day ago',
    description: 'Support marketing campaigns and social media',
    requirements: ['Marketing', 'Social Media', 'Communication'],
    applicants: 45,
    logo: 'briefcase',
  },
  {
    id: 'job_6',
    title: 'DevOps Engineer',
    company: 'Paytm',
    location: 'Noida, India',
    type: 'Full-time',
    level: 'Mid',
    salary: '₹20-28 LPA',
    postedDate: '4 days ago',
    description: 'Manage cloud infrastructure and CI/CD pipelines',
    requirements: ['AWS', 'Docker', 'Kubernetes'],
    applicants: 98,
    logo: 'briefcase',
  },
];
