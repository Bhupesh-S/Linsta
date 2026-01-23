import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from './api';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  level: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  salary?: string;
  description: string;
  requirements: string[];
  postedBy: string;
  postedDate: string;
  expiryDate?: string;
  applicants: string[];
  status: 'active' | 'closed' | 'draft';
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  _id: string;
  job: string | Job;
  applicant: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  coverLetter?: string;
  resume?: string;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
}

// Helper to get authorization headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const jobsApi = {
  // Get all jobs
  getJobs: async (
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: string;
      level?: string;
      location?: string;
      company?: string;
    }
  ): Promise<{ jobs: Job[]; total: number; page: number; totalPages: number }> => {
    try {
      const apiUrl = await getApiUrl();
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.level && { level: filters.level }),
        ...(filters?.location && { location: filters.location }),
        ...(filters?.company && { company: filters.company }),
      });

      const response = await fetch(`${apiUrl}/api/jobs?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch jobs');
      }

      const data = await response.json();
      return {
        jobs: data.jobs,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      };
    } catch (error: any) {
      console.error('Get jobs error:', error);
      throw error;
    }
  },

  // Get job by ID
  getJobById: async (jobId: string): Promise<Job> => {
    try {
      const apiUrl = await getApiUrl();
      const response = await fetch(`${apiUrl}/api/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch job');
      }

      const data = await response.json();
      return data.job;
    } catch (error: any) {
      console.error('Get job by ID error:', error);
      throw error;
    }
  },

  // Apply for job
  applyForJob: async (
    jobId: string,
    applicationData?: { coverLetter?: string; resume?: string }
  ): Promise<JobApplication> => {
    try {
      const apiUrl = await getApiUrl();
      const headers = await getAuthHeaders();

      const response = await fetch(`${apiUrl}/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers,
        body: JSON.stringify(applicationData || {}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to apply for job');
      }

      const data = await response.json();
      return data.application;
    } catch (error: any) {
      console.error('Apply for job error:', error);
      throw error;
    }
  },

  // Get user's applications
  getUserApplications: async (
    page: number = 1,
    limit: number = 20
  ): Promise<{ applications: JobApplication[]; total: number; page: number; totalPages: number }> => {
    try {
      const apiUrl = await getApiUrl();
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${apiUrl}/api/jobs/applications/my-applications?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch applications');
      }

      const data = await response.json();
      return {
        applications: data.applications,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      };
    } catch (error: any) {
      console.error('Get user applications error:', error);
      throw error;
    }
  },

  // Search jobs
  searchJobs: async (
    query: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ jobs: Job[]; total: number; page: number; totalPages: number }> => {
    try {
      const apiUrl = await getApiUrl();
      const response = await fetch(
        `${apiUrl}/api/jobs/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to search jobs');
      }

      const data = await response.json();
      return {
        jobs: data.jobs,
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      };
    } catch (error: any) {
      console.error('Search jobs error:', error);
      throw error;
    }
  },
};
