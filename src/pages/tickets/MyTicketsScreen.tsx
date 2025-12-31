import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

type TicketStatus = 'All' | 'Upcoming' | 'Used' | 'Cancelled';

interface TicketItem {
  id: string;
  eventTitle: string;
  eventId: string;
  dateTime: string;
  location: string;
  status: 'Upcoming' | 'Used' | 'Cancelled';
  ticketType: string;
  price: number;
  qrCode: string;
  category: string;
  bannerColor: string;
  orderNumber: string;
  purchaseDate: string;
}

const mockTickets: TicketItem[] = [
  {
    id: 't1',
    eventTitle: 'Tech Networking Night',
    eventId: 'e1',
    dateTime: 'Jan 20, 2025 • 6:00 PM',
    location: 'Indiranagar, Bengaluru',
    status: 'Upcoming',
    ticketType: 'General Admission',
    price: 500,
    qrCode: 'QR-TNN-001',
    category: 'Networking',
    bannerColor: '#667eea',
    orderNumber: 'ORD-2024-001',
    purchaseDate: 'Dec 15, 2024'
  },
  {
    id: 't2',
    eventTitle: 'React Native Workshop',
    eventId: 'e2',
    dateTime: 'Dec 10, 2024 • 2:00 PM',
    location: 'Online',
    status: 'Used',
    ticketType: 'VIP Pass',
    price: 1200,
    qrCode: 'QR-RNW-002',
    category: 'Workshops',
    bannerColor: '#f093fb',
    orderNumber: 'ORD-2024-002',
    purchaseDate: 'Nov 25, 2024'
  },
  {
    id: 't3',
    eventTitle: 'Startup Pitch Day',
    eventId: 'e3',
    dateTime: 'Nov 12, 2024 • 11:00 AM',
    location: 'Koramangala, Bengaluru',
    status: 'Cancelled',
    ticketType: 'Early Bird',
    price: 300,
    qrCode: 'QR-SPD-003',
    category: 'Networking',
    bannerColor: '#fa709a',
    orderNumber: 'ORD-2024-003',
    purchaseDate: 'Oct 20, 2024'
  },
  {
    id: 't4',
    eventTitle: 'AI/ML Bootcamp',
    eventId: 'e4',
    dateTime: 'Feb 15, 2025 • 10:00 AM',
    location: 'HSR Layout, Bengaluru',
    status: 'Upcoming',
    ticketType: 'Standard',
    price: 800,
    qrCode: 'QR-AIB-004',
    category: 'Workshops',
    bannerColor: '#4facfe',
    orderNumber: 'ORD-2024-004',
    purchaseDate: 'Dec 28, 2024'
  },
];

const TABS: TicketStatus[] = ['All', 'Upcoming', 'Used', 'Cancelled'];

interface Props { navigation?: any }

const MyTicketsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const [tab, setTab] = useState<TicketStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  const filteredTickets = mockTickets.filter((t) => {
    const matchesTab = tab === 'All' || t.status === tab;
    const matchesSearch = t.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: mockTickets.length,
    upcoming: mockTickets.filter(t => t.status === 'Upcoming').length,
    totalSpent: mockTickets.reduce((sum, t) => sum + t.price, 0),
    used: mockTickets.filter(t => t.status === 'Used').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return '#10b981';
      case 'Used': return '#6b7280';
      case 'Cancelled': return '#ef4444';
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'time';
      case 'Used': return 'checkmark-circle';
      case 'Cancelled': return 'close-circle';
      default: return 'ellipse';
    }
  };

  const showQRCode = (ticket: TicketItem) => {
    setSelectedTicket(ticket);
    setShowQRModal(true);
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
          <Text style={[styles.header, { color: colors.text }]}>My Tickets</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="ticket-outline" size={24} color="#0284c7" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.total}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Tickets</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="calendar-outline" size={24} color="#16a34a" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.upcoming}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Upcoming</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="checkmark-done-outline" size={24} color="#ca8a04" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.used}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Attended</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#fce7f3' }]}>
              <Ionicons name="cash-outline" size={24} color="#be185d" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>₹{(stats.totalSpent / 1000).toFixed(1)}k</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Spent</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search tickets..."
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
                    {mockTickets.filter(ticket => ticket.status === t).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tickets List */}
        <View style={styles.ticketsContainer}>
          {filteredTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket.id}
              style={[styles.ticketCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate?.('EventDetail', { eventId: ticket.eventId })}
            >
              {/* Ticket Header */}
              <View style={[styles.ticketHeader, { backgroundColor: ticket.bannerColor }]}>
                <View style={styles.ticketHeaderContent}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
                    <Ionicons name={getStatusIcon(ticket.status) as any} size={12} color="#fff" />
                    <Text style={styles.statusBadgeText}>{ticket.status}</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{ticket.category}</Text>
                  </View>
                </View>
                <View style={styles.ticketNotch} />
              </View>

              {/* Ticket Content */}
              <View style={styles.ticketContent}>
                <View style={styles.ticketMainInfo}>
                  <View style={styles.ticketDetails}>
                    <Text style={[styles.ticketTitle, { color: colors.text }]} numberOfLines={2}>
                      {ticket.eventTitle}
                    </Text>

                    <View style={styles.ticketInfo}>
                      <View style={styles.ticketInfoRow}>
                        <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                        <Text style={[styles.ticketInfoText, { color: colors.textSecondary }]}>
                          {ticket.dateTime}
                        </Text>
                      </View>
                      <View style={styles.ticketInfoRow}>
                        <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                        <Text style={[styles.ticketInfoText, { color: colors.textSecondary }]} numberOfLines={1}>
                          {ticket.location}
                        </Text>
                      </View>
                      <View style={styles.ticketInfoRow}>
                        <Ionicons name="pricetag-outline" size={16} color={colors.textSecondary} />
                        <Text style={[styles.ticketInfoText, { color: colors.textSecondary }]}>
                          {ticket.ticketType}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* QR Code Preview */}
                  <TouchableOpacity
                    style={[styles.qrCodePreview, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={() => showQRCode(ticket)}
                    disabled={ticket.status === 'Cancelled'}
                  >
                    <Ionicons
                      name="qr-code"
                      size={48}
                      color={ticket.status === 'Cancelled' ? colors.textSecondary : colors.text}
                    />
                    <Text style={[styles.qrCodeText, { color: colors.textSecondary }]}>
                      {ticket.status === 'Cancelled' ? 'Invalid' : 'Tap to view'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Ticket Footer */}
                <View style={[styles.ticketFooter, { borderTopColor: colors.border }]}>
                  <View style={styles.ticketFooterItem}>
                    <Text style={[styles.ticketFooterLabel, { color: colors.textSecondary }]}>Order</Text>
                    <Text style={[styles.ticketFooterValue, { color: colors.text }]}>{ticket.orderNumber}</Text>
                  </View>
                  <View style={styles.ticketFooterItem}>
                    <Text style={[styles.ticketFooterLabel, { color: colors.textSecondary }]}>Price</Text>
                    <Text style={[styles.ticketFooterValue, { color: colors.primary }]}>₹{ticket.price}</Text>
                  </View>
                  <View style={styles.ticketFooterItem}>
                    <Text style={[styles.ticketFooterLabel, { color: colors.textSecondary }]}>Purchased</Text>
                    <Text style={[styles.ticketFooterValue, { color: colors.text }]}>{ticket.purchaseDate}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                {ticket.status === 'Upcoming' && (
                  <View style={styles.ticketActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      onPress={(e) => {
                        e.stopPropagation();
                        showQRCode(ticket);
                      }}
                    >
                      <Ionicons name="qr-code-outline" size={18} color="#fff" />
                      <Text style={styles.actionButtonTextPrimary}>Show QR Code</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButtonSecondary, { backgroundColor: colors.background, borderColor: colors.border }]}
                      onPress={(e) => {
                        e.stopPropagation();
                        // Add to calendar functionality
                      }}
                    >
                      <Ionicons name="calendar-outline" size={18} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButtonSecondary, { backgroundColor: colors.background, borderColor: colors.border }]}
                      onPress={(e) => {
                        e.stopPropagation();
                        // Share functionality
                      }}
                    >
                      <Ionicons name="share-social-outline" size={18} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Ticket Perforation */}
              <View style={styles.ticketPerforation}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <View key={i} style={[styles.perforationDot, { backgroundColor: colors.background }]} />
                ))}
              </View>
            </TouchableOpacity>
          ))}

          {/* Empty State */}
          {filteredTickets.length === 0 && (
            <View style={[styles.emptyState, { borderColor: colors.border }]}>
              <Ionicons name="ticket-outline" size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
                {searchQuery ? 'No tickets found' : `No ${tab.toLowerCase()} tickets`}
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Browse events and get your first ticket'}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation?.navigate?.('Events')}
                >
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text style={styles.emptyStateButtonText}>Browse Events</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Event Ticket</Text>
              <TouchableOpacity onPress={() => setShowQRModal(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedTicket && (
              <>
                <View style={[styles.qrCodeContainer, { backgroundColor: '#fff' }]}>
                  <View style={styles.qrCodePlaceholder}>
                    <Ionicons name="qr-code" size={200} color="#000" />
                  </View>
                  <Text style={styles.qrCodeId}>{selectedTicket.qrCode}</Text>
                </View>

                <View style={styles.modalTicketInfo}>
                  <Text style={[styles.modalEventTitle, { color: colors.text }]}>
                    {selectedTicket.eventTitle}
                  </Text>
                  <View style={styles.modalInfoRow}>
                    <Ionicons name="time" size={18} color={colors.textSecondary} />
                    <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>
                      {selectedTicket.dateTime}
                    </Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Ionicons name="location" size={18} color={colors.textSecondary} />
                    <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>
                      {selectedTicket.location}
                    </Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Ionicons name="pricetag" size={18} color={colors.textSecondary} />
                    <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>
                      {selectedTicket.ticketType} • ₹{selectedTicket.price}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.modalNote, { color: colors.textSecondary }]}>
                  Show this QR code at the event entrance for check-in
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  headerSpacer: {
    width: 40,
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
  ticketsContainer: {
    gap: 20,
  },
  ticketCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  ticketHeader: {
    height: 80,
    justifyContent: 'space-between',
    position: 'relative',
  },
  ticketHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  ticketNotch: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fafafa',
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
  ticketContent: {
    padding: 16,
    paddingTop: 20,
  },
  ticketMainInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  ticketDetails: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 24,
  },
  ticketInfo: {
    gap: 8,
  },
  ticketInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketInfoText: {
    fontSize: 14,
    flex: 1,
  },
  qrCodePreview: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  qrCodeText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    marginBottom: 16,
  },
  ticketFooterItem: {
    flex: 1,
  },
  ticketFooterLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  ticketFooterValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  ticketActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonTextPrimary: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketPerforation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  perforationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  qrCodeContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrCodeId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  modalTicketInfo: {
    gap: 12,
    marginBottom: 20,
  },
  modalEventTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalInfoText: {
    fontSize: 15,
    flex: 1,
  },
  modalNote: {
    fontSize: 13,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default MyTicketsScreen;
