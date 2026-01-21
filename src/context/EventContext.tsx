import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventFormData } from '../utils/eventFormTypes';

export interface UserEvent extends EventFormData {
  id: string;
  createdAt: string;
  publishedAt?: string;
  status: 'draft' | 'published';
  hasRSVPd?: boolean;
  attendeeCount?: number;
}

interface EventContextType {
  userEvents: UserEvent[];
  addEvent: (eventData: EventFormData) => Promise<void>;
  saveDraft: (eventData: EventFormData) => Promise<void>;
  getDraft: () => Promise<EventFormData | null>;
  clearDraft: () => Promise<void>;
  updateEventRSVP: (eventId: string, hasRSVPd: boolean, attendeeCount?: number) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const EVENTS_STORAGE_KEY = '@linsta_user_events';
const DRAFT_STORAGE_KEY = '@linsta_event_draft';

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);

  // Load events from AsyncStorage on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsJson = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
      if (eventsJson) {
        const events: UserEvent[] = JSON.parse(eventsJson);
        // Sort by publishedAt (newest first)
        events.sort((a, b) => {
          const timeA = new Date(a.publishedAt || a.createdAt).getTime();
          const timeB = new Date(b.publishedAt || b.createdAt).getTime();
          return timeB - timeA;
        });
        setUserEvents(events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const addEvent = async (eventData: EventFormData) => {
    try {
      const newEvent: UserEvent = {
        ...eventData,
        id: eventData.id || `user_event_${Date.now()}`,
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        status: 'published',
      };

      const updatedEvents = [newEvent, ...userEvents];
      setUserEvents(updatedEvents);
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const saveDraft = async (eventData: EventFormData) => {
    try {
      const draft: EventFormData = {
        ...eventData,
        status: 'draft',
      };
      await AsyncStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const getDraft = async (): Promise<EventFormData | null> => {
    try {
      const draftJson = await AsyncStorage.getItem(DRAFT_STORAGE_KEY);
      if (draftJson) {
        return JSON.parse(draftJson);
      }
      return null;
    } catch (error) {
      console.error('Error getting draft:', error);
      return null;
    }
  };

  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  };

  const updateEventRSVP = async (eventId: string, hasRSVPd: boolean, attendeeCount?: number) => {
    try {
      const updatedEvents = userEvents.map(event => {
        if (event.id === eventId) {
          const updated: any = { ...event, hasRSVPd };
          if (attendeeCount !== undefined) {
            updated.attendeeCount = attendeeCount;
          }
          return updated;
        }
        return event;
      });
      setUserEvents(updatedEvents);
      await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Error updating RSVP:', error);
    }
  };

  return (
    <EventContext.Provider value={{ userEvents, addEvent, saveDraft, getDraft, clearDraft, updateEventRSVP }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
