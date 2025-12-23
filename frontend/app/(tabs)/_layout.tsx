import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../../src/utils/constants';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 80 : 56,
        },
        headerStyle: {
          backgroundColor: COLORS.background,
          borderBottomColor: COLORS.border,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontSize: FONT_SIZES.lg,
          fontWeight: FONT_WEIGHTS.bold,
          color: COLORS.text,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          headerTitle: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="create-post"
        options={{
          title: 'Create Post',
          headerTitle: 'Create Post',
          tabBarLabel: 'Create',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✍️</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
      <Tabs.Screen
        name="post-detail"
        options={{
          href: null,
          headerShown: true,
        }}
      />
    </Tabs>
  );
}
