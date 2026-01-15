/**
 * Events API Service
 * Handles all event-related API calls to the backend
 */

import { apiRequest } from './api';

export interface CreateEventPayload {
  title: string;
  description?: string;
  category?: string;
  date?: string; // ISO date string
  time?: string;
  venue?: string;
  isOnline?: boolean;
  meetingLink?: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  date?: string;
  time?: string;
  venue?: string;
  isOnline: boolean;
  meetingLink?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  attendeeCount?: number;
  createdAt: string;
}

export interface EventRsvp {
  _id: string;
  eventId: string;
  userId: string;
  status: 'going' | 'interested' | 'notGoing';
  createdAt: string;
}

export interface EventsResponse {
  events: Event[];
  total?: number;
}

/**
 * Create a new event
 */
export const createEvent = async (eventData: CreateEventPayload): Promise<Event> => {
  const response = await apiRequest<Event>('POST', '/events', eventData);
  return response;
};

/**
 * Get all events with optional filters
 */
export const getAllEvents = async (params?: {
  search?: string;
  category?: string;
  upcoming?: boolean;
  limit?: number;
  skip?: number;
}): Promise<Event[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.upcoming) queryParams.append('upcoming', 'true');
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.skip) queryParams.append('skip', params.skip.toString());
  
  const queryString = queryParams.toString();
  const endpoint = queryString ? `/events?${queryString}` : '/events';
  
  const response = await apiRequest<Event[]>('GET', endpoint);
  return response;
};

/**
 * Get a single event by ID
 */
export const getEventById = async (eventId: string): Promise<Event> => {
  const response = await apiRequest<Event>('GET', `/events/${eventId}`);
  return response;
};

/**
 * Register for an event (RSVP)
 */
export const registerForEvent = async (eventId: string): Promise<{ message: string; rsvp: EventRsvp }> => {
  const response = await apiRequest<{ message: string; rsvp: EventRsvp }>(
    'POST',
    `/events/${eventId}/rsvp`
  );
  return response;
};

/**
 * Cancel RSVP for an event
 */
export const cancelRsvp = async (eventId: string): Promise<{ message: string }> => {
  const response = await apiRequest<{ message: string }>(
    'DELETE',
    `/events/${eventId}/rsvp`
  );
  return response;
};

/**
 * Get attendees for an event
 */
export const getEventAttendees = async (eventId: string): Promise<any[]> => {
  const response = await apiRequest<any[]>('GET', `/events/${eventId}/attendees`);
  return response;
};
