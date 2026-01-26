export interface CreateJobRequest {
  title: string;
  companyName: string;
  description: string;
  location: string;
  jobType: "Internship" | "Full-time" | "Part-time";
}

export interface JobResponse {
  _id: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  jobType: "Internship" | "Full-time" | "Part-time";
  createdBy: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface JobListResponse {
  data: JobResponse[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export interface ApplyForJobRequest {
  resumeUrl: string;
}

export interface JobApplicationResponse {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    companyName: string;
    location?: string;
    jobType?: string;
  };
  applicantId: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  resumeUrl: string;
  status: "Applied" | "Reviewed" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplicationListResponse {
  data: JobApplicationResponse[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export interface UpdateApplicationStatusRequest {
  status: "Applied" | "Reviewed" | "Rejected";
}
