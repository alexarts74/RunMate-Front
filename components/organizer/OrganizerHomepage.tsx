import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { eventService } from "@/service/api/event";
import { groupService } from "@/service/api/group";
import { organizerProfileService } from "@/service/api/organizerProfile";
import { Event } from "@/interface/Event";
import { GroupInfo } from "@/interface/Group";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassAvatar from "@/components/ui/GlassAvatar";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { useThemeColors, palette, radii } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

function StatCard({
  icon,
  label,
  value,
  accent,
  subtitle,
  onPress,
  delay = 0,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  accent: string;
  subtitle?: string;
  onPress?: () => void;
  delay?: number;
}) {
  const { colors, shadows } = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify()}
      style={[{ flex: 1 }]}
    >
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        }}
        style={animatedStyle}
      >
        <GlassCard style={{ minHeight: 110 }}>
          <View
            style={[
              styles.statIconWrap,
              { backgroundColor: accent + "18" },
            ]}
          >
            <Ionicons name={icon} size={20} color={accent} />
          </View>
          <Text
            style={[styles.statValue, { color: colors.text.primary }]}
            numberOfLines={1}
          >
            {value}
          </Text>
          <Text
            style={[styles.statLabel, { color: colors.text.secondary }]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {subtitle && (
            <Text
              style={[styles.statSubtitle, { color: accent }]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </GlassCard>
      </AnimatedPressable>
    </Animated.View>
  );
}

function EventCard({
  event,
  index,
  onPress,
}: {
  event: Event;
  index: number;
  onPress: () => void;
}) {
  const { colors, shadows } = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = new Date(event.start_date) > new Date();
  const spotsPercent = event.spots_left !== undefined && event.max_participants
    ? Math.round(
        ((event.max_participants - event.spots_left) / event.max_participants) *
          100
      )
    : null;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).duration(400).springify()}
    >
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        }}
        style={[animatedStyle, styles.eventCardWrap]}
      >
        <GlassCard noPadding style={[shadows.md, { width: 260 }]}>
          {/* Image */}
          <View style={styles.eventImageWrap}>
            {event.cover_image ? (
              <Image
                source={{ uri: event.cover_image }}
                style={styles.eventImage}
              />
            ) : (
              <LinearGradient
                colors={[palette.primary.DEFAULT, palette.primary.dark]}
                style={styles.eventImage}
              >
                <Ionicons name="calendar" size={32} color="rgba(255,255,255,0.5)" />
              </LinearGradient>
            )}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.5)"]}
              style={styles.eventImageOverlay}
            />
            {/* Date badge */}
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>
                {formatDate(event.start_date)}
              </Text>
            </View>
            {/* Status badge */}
            {isUpcoming && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: palette.success + "E6" },
                ]}
              >
                <Text style={styles.statusBadgeText}>A venir</Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.eventContent}>
            <Text
              style={[styles.eventTitle, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {event.name}
            </Text>

            <View style={styles.eventMeta}>
              <Ionicons
                name="location-outline"
                size={13}
                color={colors.text.tertiary}
              />
              <Text
                style={[styles.eventMetaText, { color: colors.text.secondary }]}
                numberOfLines={1}
              >
                {event.location || "Lieu non défini"}
              </Text>
            </View>

            {event.start_time && (
              <View style={styles.eventMeta}>
                <Ionicons
                  name="time-outline"
                  size={13}
                  color={colors.text.tertiary}
                />
                <Text
                  style={[
                    styles.eventMetaText,
                    { color: colors.text.secondary },
                  ]}
                >
                  {event.start_time}
                  {event.distance ? ` · ${event.distance} km` : ""}
                </Text>
              </View>
            )}

            {/* Participants bar */}
            <View style={styles.participantsRow}>
              <View style={styles.participantsInfo}>
                <Ionicons
                  name="people"
                  size={13}
                  color={colors.primary.DEFAULT}
                />
                <Text
                  style={[
                    styles.participantsText,
                    { color: colors.text.secondary },
                  ]}
                >
                  {event.participants_count || 0}
                  {event.max_participants
                    ? `/${event.max_participants}`
                    : ""}
                </Text>
              </View>
              {spotsPercent !== null && (
                <View
                  style={[
                    styles.progressBarBg,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(spotsPercent, 100)}%`,
                        backgroundColor:
                          spotsPercent > 80
                            ? palette.warning
                            : palette.primary.DEFAULT,
                      },
                    ]}
                  />
                </View>
              )}
            </View>
          </View>
        </GlassCard>
      </AnimatedPressable>
    </Animated.View>
  );
}

function GroupCard({
  group,
  index,
  onPress,
}: {
  group: GroupInfo;
  index: number;
  onPress: () => void;
}) {
  const { colors, shadows } = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const groupName = String(group.name || "");
  const membersCount = Number(group.members_count) || 0;
  const pendingCount = Number(group.pending_requests_count) || 0;
  const coverImage =
    group.cover_image ? String(group.cover_image) : null;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).duration(400).springify()}
    >
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        }}
        style={animatedStyle}
      >
        <GlassCard
          noPadding
          style={[shadows.md, { width: 200 }]}
        >
          {/* Image */}
          <View style={styles.groupImageWrap}>
            {coverImage ? (
              <Image
                source={{ uri: coverImage }}
                style={styles.groupImage}
              />
            ) : (
              <LinearGradient
                colors={[colors.surface, colors.elevated]}
                style={[styles.groupImage, styles.groupImagePlaceholder]}
              >
                <Ionicons
                  name="people"
                  size={28}
                  color={colors.text.tertiary}
                />
              </LinearGradient>
            )}
            {pendingCount > 0 && (
              <View style={styles.pendingBadge}>
                <Ionicons name="notifications" size={10} color="#FFFFFF" />
                <Text style={styles.pendingBadgeText}>{pendingCount}</Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.groupContent}>
            <Text
              style={[styles.groupTitle, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {groupName}
            </Text>
            <View style={styles.groupMeta}>
              <Ionicons
                name="people-outline"
                size={13}
                color={colors.text.tertiary}
              />
              <Text
                style={[
                  styles.groupMetaText,
                  { color: colors.text.secondary },
                ]}
              >
                {membersCount} membre{membersCount > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </GlassCard>
      </AnimatedPressable>
    </Animated.View>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { colors } = useThemeColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
        {title}
      </Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text
            style={[styles.sectionAction, { color: colors.primary.DEFAULT }]}
          >
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function DashboardSkeleton() {
  const { colors } = useThemeColors();
  return (
    <View style={{ paddingHorizontal: 20 }}>
      {/* Stats skeleton */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
        <View style={{ flex: 1 }}>
          <SkeletonLoader variant="card" height={110} />
        </View>
        <View style={{ flex: 1 }}>
          <SkeletonLoader variant="card" height={110} />
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
        <View style={{ flex: 1 }}>
          <SkeletonLoader variant="card" height={110} />
        </View>
        <View style={{ flex: 1 }}>
          <SkeletonLoader variant="card" height={110} />
        </View>
      </View>
      {/* Actions skeleton */}
      <SkeletonLoader width="40%" height={20} style={{ marginBottom: 16 }} />
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
        <SkeletonLoader variant="card" height={80} style={{ flex: 1 }} />
        <SkeletonLoader variant="card" height={80} style={{ flex: 1 }} />
      </View>
      {/* Events skeleton */}
      <SkeletonLoader width="50%" height={20} style={{ marginBottom: 16 }} />
      <View style={{ flexDirection: "row", gap: 12 }}>
        <SkeletonLoader variant="card" height={200} style={{ width: 260 }} />
        <SkeletonLoader variant="card" height={200} style={{ width: 260 }} />
      </View>
    </View>
  );
}

export function OrganizerHomepage() {
  const { user } = useAuth();
  const { unreadCount } = useUnreadMessages();
  const { colors, shadows, gradients } = useThemeColors();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [myGroups, setMyGroups] = useState<GroupInfo[]>([]);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalGroups: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadOrganizerProfile = async () => {
    try {
      const profile = await organizerProfileService.getProfile();
      if (profile?.organization_name) {
        setOrganizationName(profile.organization_name);
      }
    } catch (error) {
      // Profile may not exist yet
    }
  };

  const loadData = async () => {
    try {
      if (!refreshing) setIsLoading(true);

      await loadOrganizerProfile();

      const eventsResponse = await eventService.getMyEvents();
      const createdEvents = eventsResponse.created || [];
      setMyEvents(createdEvents);

      const groupsData = await groupService.getGroups();
      const myCreatedGroups = groupsData.filter(
        (g: GroupInfo) => g.is_admin
      );
      setMyGroups(myCreatedGroups);

      const totalParticipants = createdEvents.reduce(
        (sum: number, event: Event) => sum + (event.participants_count || 0),
        0
      );
      const upcomingEvents = createdEvents.filter(
        (event: Event) => new Date(event.start_date) > new Date()
      ).length;

      setStats({
        totalEvents: createdEvents.length,
        totalGroups: myCreatedGroups.length,
        totalParticipants,
        upcomingEvents,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  return (
    <WarmBackground>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary.DEFAULT}
            />
          }
        >
          {/* ─── Header ─────────────────────────────── */}
          <View style={styles.header}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Animated.Text
                entering={FadeInDown.duration(500)}
                style={[styles.greeting, { color: colors.text.tertiary }]}
              >
                {getGreeting()}
              </Animated.Text>
              <Animated.Text
                entering={FadeInDown.delay(100).duration(500)}
                style={[styles.orgName, { color: colors.text.primary }]}
                numberOfLines={2}
              >
                {organizationName || "Votre organisation"}
              </Animated.Text>
            </View>

            <View style={styles.headerActions}>
              {/* Notifications */}
              <Pressable
                onPress={() => router.push("/messages")}
                style={[
                  styles.headerIconBtn,
                  {
                    backgroundColor: colors.glass.light,
                    borderColor: colors.glass.border,
                  },
                ]}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={20}
                  color={colors.text.primary}
                />
                {unreadCount > 0 && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: palette.error },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Avatar */}
              <Pressable onPress={() => router.push("/(tabs)/profile")}>
                <GlassAvatar
                  uri={user?.profile_image}
                  size={40}
                  showRing
                />
              </Pressable>
            </View>
          </View>

          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* ─── Stats Grid ──────────────────────── */}
              <View style={styles.statsSection}>
                <View style={styles.statsRow}>
                  <StatCard
                    icon="calendar"
                    label="Événements"
                    value={stats.totalEvents}
                    accent={palette.primary.DEFAULT}
                    subtitle={
                      stats.upcomingEvents > 0
                        ? `${stats.upcomingEvents} à venir`
                        : undefined
                    }
                    onPress={() =>
                      router.push("/(app)/organizer/events/all")
                    }
                    delay={0}
                  />
                  <StatCard
                    icon="people"
                    label="Groupes"
                    value={stats.totalGroups}
                    accent={palette.info}
                    onPress={() => router.push("/(app)/groups/all")}
                    delay={80}
                  />
                </View>
                <View style={styles.statsRow}>
                  <StatCard
                    icon="person"
                    label="Participants"
                    value={stats.totalParticipants}
                    accent={palette.success}
                    delay={160}
                  />
                  <StatCard
                    icon="rocket"
                    label="A venir"
                    value={stats.upcomingEvents}
                    accent={palette.warning}
                    delay={240}
                  />
                </View>
              </View>

              {/* ─── Quick Actions ────────────────────── */}
              <View style={styles.section}>
                <SectionHeader title="Actions rapides" />
                <Animated.View
                  entering={FadeInDown.delay(300).duration(500).springify()}
                  style={styles.actionsRow}
                >
                  <Pressable
                    onPress={() => router.push("/(app)/events/create")}
                    style={{ flex: 1 }}
                  >
                    <LinearGradient
                      colors={
                        gradients.primaryButton as unknown as [
                          string,
                          string,
                          ...string[]
                        ]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.actionCard, shadows.md]}
                    >
                      <View style={styles.actionIconWrap}>
                        <Ionicons
                          name="add-circle"
                          size={24}
                          color="#FFFFFF"
                        />
                      </View>
                      <Text style={styles.actionTitle}>Nouvel événement</Text>
                      <Text style={styles.actionSub}>Organiser une course</Text>
                    </LinearGradient>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push("/(app)/groups/create")}
                    style={{ flex: 1 }}
                  >
                    <View
                      style={[
                        styles.actionCard,
                        shadows.sm,
                        {
                          backgroundColor: colors.elevated,
                          borderWidth: 1,
                          borderColor: colors.glass.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.actionIconWrap,
                          {
                            backgroundColor: palette.primary.subtle,
                          },
                        ]}
                      >
                        <Ionicons
                          name="people-circle"
                          size={24}
                          color={palette.primary.DEFAULT}
                        />
                      </View>
                      <Text
                        style={[
                          styles.actionTitle,
                          { color: colors.text.primary },
                        ]}
                      >
                        Nouveau groupe
                      </Text>
                      <Text
                        style={[
                          styles.actionSub,
                          { color: colors.text.tertiary },
                        ]}
                      >
                        Créer une communauté
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              </View>

              {/* ─── Events ──────────────────────────── */}
              {myEvents.length > 0 && (
                <View style={styles.section}>
                  <View style={{ paddingHorizontal: 20 }}>
                    <SectionHeader
                      title="Mes événements"
                      actionLabel="Voir tout"
                      onAction={() =>
                        router.push("/(app)/organizer/events/all")
                      }
                    />
                  </View>
                  <FlatList
                    data={myEvents.slice(0, 5)}
                    keyExtractor={(item, index) => item.id ? String(item.id) : `event-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingHorizontal: 20,
                      gap: 14,
                    }}
                    renderItem={({ item, index }) => (
                      <EventCard
                        event={item}
                        index={index}
                        onPress={() =>
                          router.push(
                            `/(app)/organizer/events/${String(item.id)}`
                          )
                        }
                      />
                    )}
                  />
                </View>
              )}

              {/* ─── Groups ──────────────────────────── */}
              {myGroups.length > 0 && (
                <View style={styles.section}>
                  <View style={{ paddingHorizontal: 20 }}>
                    <SectionHeader
                      title="Mes groupes"
                      actionLabel="Voir tout"
                      onAction={() => router.push("/(app)/groups/all")}
                    />
                  </View>
                  <FlatList
                    data={myGroups.slice(0, 5)}
                    keyExtractor={(item, index) => item.id ? String(item.id) : `group-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingHorizontal: 20,
                      gap: 14,
                    }}
                    renderItem={({ item, index }) => (
                      <GroupCard
                        group={item}
                        index={index}
                        onPress={() =>
                          router.push(
                            `/(app)/organizer/groups/${String(item.id)}`
                          )
                        }
                      />
                    )}
                  />
                </View>
              )}

              {/* ─── Empty State ─────────────────────── */}
              {myEvents.length === 0 && myGroups.length === 0 && (
                <View style={styles.emptySection}>
                  <Animated.View
                    entering={FadeInDown.delay(400).duration(600).springify()}
                  >
                    <GlassCard variant="medium">
                      <View style={styles.emptyContent}>
                        <LinearGradient
                          colors={
                            gradients.primaryButton as unknown as [
                              string,
                              string,
                              ...string[]
                            ]
                          }
                          style={styles.emptyIconWrap}
                        >
                          <Ionicons
                            name="rocket-outline"
                            size={32}
                            color="#FFFFFF"
                          />
                        </LinearGradient>
                        <Text
                          style={[
                            styles.emptyTitle,
                            { color: colors.text.primary },
                          ]}
                        >
                          Lancez votre communauté
                        </Text>
                        <Text
                          style={[
                            styles.emptyDesc,
                            { color: colors.text.secondary },
                          ]}
                        >
                          Créez votre premier événement ou groupe pour
                          rassembler des coureurs autour de vous.
                        </Text>

                        <View style={styles.emptyCtas}>
                          <Pressable
                            onPress={() =>
                              router.push("/(app)/events/create")
                            }
                            style={{ flex: 1 }}
                          >
                            <LinearGradient
                              colors={
                                gradients.primaryButton as unknown as [
                                  string,
                                  string,
                                  ...string[]
                                ]
                              }
                              style={styles.emptyBtn}
                            >
                              <Ionicons
                                name="calendar-outline"
                                size={18}
                                color="#FFFFFF"
                              />
                              <Text style={styles.emptyBtnText}>
                                Créer un événement
                              </Text>
                            </LinearGradient>
                          </Pressable>

                          <Pressable
                            onPress={() =>
                              router.push("/(app)/groups/create")
                            }
                            style={[
                              styles.emptyBtnSecondary,
                              {
                                borderColor: colors.primary.DEFAULT,
                                flex: 1,
                              },
                            ]}
                          >
                            <Ionicons
                              name="people-outline"
                              size={18}
                              color={colors.primary.DEFAULT}
                            />
                            <Text
                              style={[
                                styles.emptyBtnSecondaryText,
                                { color: colors.primary.DEFAULT },
                              ]}
                            >
                              Créer un groupe
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </GlassCard>
                  </Animated.View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </WarmBackground>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  greeting: {
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    marginBottom: 4,
  },
  orgName: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 24,
    lineHeight: 30,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontFamily: "Nunito-Bold",
    fontSize: 10,
  },

  // Stats
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
    gap: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 28,
    lineHeight: 32,
  },
  statLabel: {
    fontFamily: "Nunito-Medium",
    fontSize: 13,
    marginTop: 2,
  },
  statSubtitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 11,
    marginTop: 4,
  },

  // Sections
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 19,
  },
  sectionAction: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
  },

  // Actions
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    borderRadius: radii.lg,
    padding: 16,
    minHeight: 120,
    justifyContent: "space-between",
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  actionSub: {
    fontFamily: "Nunito-Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },

  // Event cards
  eventCardWrap: {
    marginRight: 0,
  },
  eventImageWrap: {
    height: 130,
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "center",
  },
  eventImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  dateBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateBadgeText: {
    color: "#FFFFFF",
    fontFamily: "Nunito-Bold",
    fontSize: 11,
    textTransform: "uppercase",
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontFamily: "Nunito-Bold",
    fontSize: 11,
  },
  eventContent: {
    padding: 14,
  },
  eventTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 15,
    marginBottom: 6,
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  eventMetaText: {
    fontFamily: "Nunito-Medium",
    fontSize: 12,
    flex: 1,
  },
  participantsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  participantsInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  participantsText: {
    fontFamily: "Nunito-Medium",
    fontSize: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },

  // Group cards
  groupImageWrap: {
    height: 100,
    position: "relative",
  },
  groupImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  groupImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  pendingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(229, 184, 103, 0.9)",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  pendingBadgeText: {
    color: "#FFFFFF",
    fontFamily: "Nunito-Bold",
    fontSize: 10,
  },
  groupContent: {
    padding: 12,
  },
  groupTitle: {
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    marginBottom: 4,
  },
  groupMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  groupMetaText: {
    fontFamily: "Nunito-Medium",
    fontSize: 12,
  },

  // Empty state
  emptySection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 8,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDesc: {
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  emptyCtas: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    borderRadius: 9999,
    paddingHorizontal: 16,
  },
  emptyBtnText: {
    color: "#FFFFFF",
    fontFamily: "Nunito-Bold",
    fontSize: 13,
  },
  emptyBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    borderRadius: 9999,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  emptyBtnSecondaryText: {
    fontFamily: "Nunito-Bold",
    fontSize: 13,
  },
});
