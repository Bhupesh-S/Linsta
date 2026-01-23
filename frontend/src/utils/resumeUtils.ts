/**
 * Resume Utilities
 * Helper functions for resume operations
 */

import { Resume, ResumeFilters } from '../types/resume.types';

export const filterResumes = (
    resumes: Resume[],
    filters: ResumeFilters
): Resume[] => {
    let filtered = [...resumes];

    if (filters.status) {
        filtered = filtered.filter((r) => r.status === filters.status);
    }

    if (filters.targetRole) {
        filtered = filtered.filter((r) =>
            r.targetRole?.toLowerCase().includes(filters.targetRole!.toLowerCase())
        );
    }

    if (filters.minScore) {
        filtered = filtered.filter((r) => r.aiScore.overall >= filters.minScore!);
    }

    return filtered;
};

export const sortResumes = (
    resumes: Resume[],
    sortBy: ResumeFilters['sortBy'] = 'updatedAt',
    sortOrder: ResumeFilters['sortOrder'] = 'desc'
): Resume[] => {
    const sorted = [...resumes];

    sorted.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'updatedAt':
                comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
                break;
            case 'createdAt':
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                break;
            case 'score':
                comparison = a.aiScore.overall - b.aiScore.overall;
                break;
            case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
            default:
                comparison = 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
};

export const getScoreColor = (score: number): string => {
    if (score >= 90) return '#10B981';
    if (score >= 75) return '#3B82F6';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
};

export const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
};

export const calculateCompleteness = (resume: Resume): number => {
    let total = 0;
    let completed = 0;

    // Personal Info (20%)
    total += 20;
    if (resume.personalInfo.name && resume.personalInfo.email && resume.personalInfo.phone) {
        completed += 20;
    }

    // Experience (25%)
    total += 25;
    if (resume.experience.length > 0) {
        completed += 25;
    }

    // Education (15%)
    total += 15;
    if (resume.education.length > 0) {
        completed += 15;
    }

    // Skills (20%)
    total += 20;
    if (resume.skills.length >= 5) {
        completed += 20;
    }

    // Projects (10%)
    total += 10;
    if (resume.projects.length > 0) {
        completed += 10;
    }

    // Summary (10%)
    total += 10;
    if (resume.personalInfo.summary && resume.personalInfo.summary.length > 50) {
        completed += 10;
    }

    return Math.round((completed / total) * 100);
};

export const generateResumePreview = (resume: Resume): string => {
    return `
${resume.personalInfo.name}
${resume.personalInfo.email} | ${resume.personalInfo.phone}
${resume.personalInfo.location}

PROFESSIONAL SUMMARY
${resume.personalInfo.summary}

EXPERIENCE
${resume.experience.map(exp => `
${exp.role} at ${exp.company}
${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
${exp.description.join('\n')}
`).join('\n')}

EDUCATION
${resume.education.map(edu => `
${edu.degree} in ${edu.field}
${edu.institution}
${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}
`).join('\n')}

SKILLS
${resume.skills.map(s => s.name).join(', ')}
  `.trim();
};

export default {
    filterResumes,
    sortResumes,
    getScoreColor,
    getScoreLabel,
    formatDate,
    calculateCompleteness,
    generateResumePreview,
};
