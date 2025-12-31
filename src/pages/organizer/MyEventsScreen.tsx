import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

type Status = 'All' | 'Upcoming' | 'Draft' | 'Past';

interface MyEventItem {
  id: string;
  title: string;
  status: 'Upcoming' | 'Draft' | 'Past';
  dateTime: string;
  registrations: number;
  capacity?: number;
  revenue?: number;
  category: string;
  location: string;
  bannerColor: string;
}

const mockEvents: MyEventItem[] = [
  {
    id: 'e1',
    title: 'Tech Networking Night',
    status: 'Upcoming',
    dateTime: 'Jan 20, 2025 • 6:00 PM',
    registrations: 128,
    capacity: 200,
    revenue: 12800,
    category: 'Networking',
    location: 'Indiranagar, Bengaluru',
    bannerColor: '#667eea'
  },
  {
    id: 'e2',
    title: 'React Native Workshop',
    status: 'Draft',
    dateTime: 'Feb 5, 2025 • 7:00 PM',
    registrations: 0,
    capacity: 100,
    revenue: 0,
    category: 'Workshops',
    location: 'Online',
    bannerColor: '#f093fb'
  },
  {
    id: 'e3',
    title: 'Startup Pitch Day',
    status: 'Past',
    dateTime: 'Nov 12, 2024 • 11:00 AM',
    registrations: 220,
    capacity: 220,
    revenue: 44000,
    category: 'Networking',
    location: 'Koramangala, Bengaluru',
    bannerColor: '#fa709a'
  },
  {
    id: 'e4',
    title: 'AI/ML Bootcamp',
    status: 'Upcoming',
    dateTime: 'Feb 15, 2025 • 10:00 AM',
    registrations: 85,
    capacity: 150,
    revenue: 17000,
    category: 'Workshops',
    location: 'HSR Layout, Bengaluru',
    bannerColor: '#4facfe'
  },
];

const TABS: Status[] = ['All', 'Upcoming', 'Draft', 'Past'];

interface Props { navigation?: any }

const MyEventsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [tab, setTab] = useState<Status>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = mockEvents.filter((e) => {
    const matchesTab = tab === 'All' || e.status === tab;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: mockEvents.length,
    upcoming: mockEvents.filter(e => e.status === 'Upcoming').length,
    totalRegistrations: mockEvents.reduce((sum, e) => sum + e.registrations, 0),
    totalRevenue: mockEvents.reduce((sum, e) => sum + (e.revenue || 0), 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return '#10b981';
      case 'Draft': return '#f59e0b';
      case 'Past': return '#6b7280';
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'calendar';
      case 'Draft': return 'document-text';
      case 'Past': return 'checkmark-circle';
      default: return 'ellipse';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Enhanced Header */}
      <View style={[styles.headerBar, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack?.()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.header, { color: colors.text }]}>My Events</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation?.navigate?.('CreateEvent')}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="calendar-outline" size={24} color="#0284c7" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.total}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Events</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="rocket-outline" size={24} color="#16a34a" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.upcoming}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Upcoming</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="people-outline" size={24} color="#ca8a04" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.totalRegistrations}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Attendees</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#fce7f3' }]}>
              <Ionicons name="cash-outline" size={24} color="#be185d" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>₹{(stats.totalRevenue / 1000).toFixed(1)}k</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Revenue</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search events..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[
                styles.tab,
                {
                  borderColor: colors.border,
                  backgroundColor: tab === t ? colors.primary : colors.surface
                }
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, { color: tab === t ? '#fff' : colors.text }]}>
                {t}
              </Text>
              {t !== 'All' && (
                <View style={[styles.tabBadge, { backgroundColor: tab === t ? 'rgba(255,255,255,0.3)' : colors.border }]}>
                  <Text style={[styles.tabBadgeText, { color: tab === t ? '#fff' : colors.textSecondary }]}>
                    {mockEvents.filter(e => e.status === t).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Events List */}
        <View style={styles.eventsContainer}>
          {filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate?.('EventDetail', { eventId: event.id })}
            >
              {/* Event Banner */}
              <View style={[styles.eventBanner, { backgroundColor: event.bannerColor }]}>
                <View style={styles.eventBannerOverlay}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
                    <Ionicons name={getStatusIcon(event.status) as any} size={12} color="#fff" />
                    <Text style={styles.statusBadgeText}>{event.status}</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{event.category}</Text>
                  </View>
                </View>
              </View>

              {/* Event Content */}
              <View style={styles.eventContent}>
                <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
                  {event.title}
                </Text>

                <View style={styles.eventInfo}>
                  <View style={styles.eventInfoRow}>
                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.eventInfoText, { color: colors.textSecondary }]}>
                      {event.dateTime}
                    </Text>
                  </View>
                  <View style={styles.eventInfoRow}>
                    <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.eventInfoText, { color: colors.textSecondary }]} numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                </View>

                {/* Event Stats */}
                <View style={styles.eventStats}>
                  <View style={styles.eventStatItem}>
                    <Ionicons name="people" size={18} color={colors.primary} />
                    <Text style={[styles.eventStatText, { color: colors.text }]}>
                      {event.registrations}/{event.capacity || '∞'}
                    </Text>
                  </View>
                  {event.revenue && event.revenue > 0 && (
                    <View style={styles.eventStatItem}>
                      <Ionicons name="cash" size={18} color="#10b981" />
                      <Text style={[styles.eventStatText, { color: colors.text }]}>
                        ₹{event.revenue.toLocaleString()}
                      </Text>
                    </View>
                  )}
                  <View style={[styles.fillPercentage, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.fillPercentageBar,
                        {
                          width: `${event.capacity ? (event.registrations / event.capacity) * 100 : 0}%`,
                          backgroundColor: event.capacity && event.registrations / event.capacity > 0.8 ? '#10b981' : colors.primary
                        }
                      ]}
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.eventActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      navigation?.navigate?.('EditEvent', { eventId: event.id });
                    }}
                  >
                    <Ionicons name="create-outline" size={18} color={colors.primary} />
                    <Text style={[styles.actionButtonText, { color: colors.primary }]}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      navigation?.navigate?.('EventAttendees', { eventId: event.id });
                    }}
                  >
                    <Ionicons name="people-outline" size={18} color={colors.text} />
                    <Text style={[styles.actionButtonText, { color: colors.text }]}>Attendees</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      // Share functionality
                    }}
                  >
                    <Ionicons name="share-social-outline" size={18} color={colors.text} />
                    <Text style={[styles.actionButtonText, { color: colors.text }]}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <View style={[styles.emptyState, { borderColor: colors.border }]}>
              <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                {searchQuery ? 'No events found' : `No ${tab.toLowerCase()} events`}
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first event to get started'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation?.navigate?.('CreateEvent')}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                  <Text style={styles.emptyStateButtonText}>Create Event</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  addButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  tabsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  eventsContainer: {
    gap: 16,
  },
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  eventBanner: {
    height: 120,
    justifyContent: 'flex-end',
  },
  eventBannerOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#262626',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 24,
  },
  eventInfo: {
    gap: 8,
    marginBottom: 12,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventInfoText: {
    fontSize: 14,
    flex: 1,
  },
  eventStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  eventStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventStatText: {
    fontSize: 14,
    fontWeight: '600',
  },
  fillPercentage: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fillPercentageBar: {
    height: '100%',
    borderRadius: 3,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    padding: 48,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default MyEventsScreen;
