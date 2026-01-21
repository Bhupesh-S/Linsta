<<<<<<< HEAD
/**
 * Job Types
 * Type definitions for Job Search feature
 */

export type WorkMode = 'remote' | 'hybrid' | 'onsite';
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type ApplicationStatus = 'draft' | 'submitted' | 'in-review' | 'interview' | 'offer' | 'rejected' | 'accepted' | 'withdrawn';

export interface Location {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
    latitude: number;
    longitude: number;
    remote: boolean;
}

export interface Salary {
    min: number;
    max: number;
    currency: string;
    period: 'yearly' | 'monthly' | 'hourly';
}

export interface Company {
    id: string;
    name: string;
    logo: string;
    size: string;
    industry: string;
    website: string;
    description: string;
    founded?: string;

    ratings: {
        overall: number;
        workLife: number;
        culture: number;
        growth: number;
        compensation: number;
        management: number;
    };

    benefits: string[];
    verified: boolean;
}

export interface CompanyReview {
    id: string;
    companyId: string;
    userId: string;
    userName: string;
    userRole: string;
    rating: number;
    title: string;
    pros: string;
    cons: string;
    advice?: string;
    createdAt: string;
    helpful: number;
}

export interface Job {
    id: string;
    title: string;
    company: Company;
    location: Location;

    salary: Salary;

    experience: {
        min: number;
        max: number;
        level: ExperienceLevel;
    };

    workMode: WorkMode;
    jobType: JobType;

    description: string;
    requirements: string[];
    responsibilities: string[];
    skills: string[];
    preferredSkills?: string[];

    benefits: string[];
    perks?: string[];

    postedDate: string;
    expiryDate?: string;
    applicationDeadline?: string;

    applicants: number;
    views: number;
    openings: number;

    aiVerified: boolean;
    scamScore: number;
    scamFlags?: string[];

    featured: boolean;
    urgent: boolean;

    contactEmail?: string;
    applicationUrl?: string;
}

export interface JobMatchScore {
    jobId: string;
    resumeId: string;
    overallMatch: number;
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
    locationMatch: number;

    matchingSkills: string[];
    missingSkills: string[];

    strengths: string[];
    gaps: string[];

    recommendation: string;
    applicationTips: string[];
}

export interface JobApplication {
    id: string;
    jobId: string;
    job: Job;
    resumeId: string;
    coverLetterId?: string;

    status: ApplicationStatus;
    appliedDate: string;
    lastUpdated: string;

    timeline: ApplicationTimeline[];

    notes?: string;
    followUpDate?: string;

    interviewDetails?: InterviewDetails;
}

export interface ApplicationTimeline {
    id: string;
    status: ApplicationStatus;
    date: string;
    note?: string;
}

export interface InterviewDetails {
    scheduledDate?: string;
    interviewType: 'phone' | 'video' | 'onsite' | 'technical' | 'hr';
    interviewers?: string[];
    location?: string;
    meetingLink?: string;
    notes?: string;
    completed: boolean;
    feedback?: string;
}

export interface JobAlert {
    id: string;
    userId: string;
    name: string;

    filters: JobFilters;

    frequency: 'instant' | 'daily' | 'weekly';
    enabled: boolean;

    lastSent?: string;
    createdAt: string;
}

export interface JobFilters {
    keywords?: string;
    location?: string;
    radius?: number; // in km
    workMode?: WorkMode[];
    jobType?: JobType[];
    experienceLevel?: ExperienceLevel[];
    salary?: {
        min?: number;
        max?: number;
    };
    companies?: string[];
    industries?: string[];
    postedWithin?: number; // days
    remote?: boolean;
    sortBy?: 'relevance' | 'date' | 'salary' | 'distance' | 'match';
    sortOrder?: 'asc' | 'desc';
}

export interface InterviewPrep {
    jobId: string;
    jobTitle: string;
    companyName: string;

    commonQuestions: InterviewQuestion[];
    technicalQuestions: InterviewQuestion[];
    behavioralQuestions: InterviewQuestion[];

    companyInsights: string[];
    interviewTips: string[];

    mockInterviewAvailable: boolean;
}

export interface InterviewQuestion {
    id: string;
    question: string;
    category: 'technical' | 'behavioral' | 'situational' | 'company-specific';
    difficulty: 'easy' | 'medium' | 'hard';
    suggestedAnswer?: string;
    tips: string[];
}

export interface SavedJob {
    id: string;
    userId: string;
    jobId: string;
    job: Job;
    savedAt: string;
    notes?: string;
    tags?: string[];
}
=======
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
>>>>>>> 448149856aac05402870ddec0c0b1604d10a8a7f
