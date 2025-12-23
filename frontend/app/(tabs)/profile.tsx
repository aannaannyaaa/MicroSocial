import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../src/context/AuthContext';
import { postsService } from '../../src/services/posts';
import { Post, FeedResponse } from '../../src/types';
import { PostCard } from '../../src/components/PostCard';
import { SafeArea } from '../../src/components/SafeArea';
import { Button } from '../../src/components/Button';
import { Loading } from '../../src/components/Loading';
import { ErrorMessage } from '../../src/components/ErrorMessage';
import { formatNumber } from '../../src/utils/format';
import {
  COLORS,
  SIZES,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
} from '../../src/utils/constants';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadUserPosts();
    }, [user?._id])
  );

  const loadUserPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?._id) return;

      const response: FeedResponse = await postsService.getUserPosts(
        user._id,
        1
      );

      if (response.success) {
        const postsWithLikeStatus = response.data.map((post) => ({
          ...post,
          isLiked: post.likes.includes(user?._id || ''),
        }));
        setPosts(postsWithLikeStatus);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load posts';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      setLiking(postId);
      const post = posts.find((p) => p._id === postId);

      if (post?.isLiked) {
        await postsService.unlikePost(postId);
      } else {
        await postsService.likePost(postId);
      }

      setPosts((prevPosts) =>
        prevPosts.map((p) => {
          if (p._id === postId) {
            return {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            };
          }
          return p;
        })
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    } finally {
      setLiking(null);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postsService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      Alert.alert('Success', 'Post deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete post');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    headerCard: {
      backgroundColor: COLORS.surface,
      paddingVertical: SPACING.lg,
      paddingHorizontal: SPACING.md,
      borderBottomColor: COLORS.border,
      borderBottomWidth: 1,
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: SPACING.md,
      backgroundColor: COLORS.primary,
    },
    nameText: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text,
      marginBottom: SIZES.sm,
    },
    usernameText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.textSecondary,
      marginBottom: SPACING.md,
    },
    bioText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.text,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: SPACING.md,
      paddingVertical: SPACING.md,
      borderTopColor: COLORS.border,
      borderTopWidth: 1,
      borderBottomColor: COLORS.border,
      borderBottomWidth: 1,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
    statLabel: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textSecondary,
      marginTop: SIZES.sm,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginTop: SPACING.lg,
    },
    editButton: {
      flex: 1,
    },
    logoutButton: {
      flex: 1,
    },
    postsHeader: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
      borderBottomColor: COLORS.border,
      borderBottomWidth: 1,
    },
    postsTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text,
    },
    contentContainer: {
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.md,
    },
    emptyContainer: {
      paddingVertical: SPACING.xl,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.textSecondary,
      marginTop: SPACING.md,
    },
  });

  if (loading && posts.length === 0) {
    return (
      <SafeArea style={styles.safeArea}>
        <Loading fullScreen />
      </SafeArea>
    );
  }

  return (
    <SafeArea style={styles.safeArea}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            <View style={styles.headerCard}>
              <View style={styles.profileHeader}>
                <Image
                  source={{
                    uri: user?.avatar || 'https://via.placeholder.com/100',
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.nameText}>{user?.name}</Text>
                <Text style={styles.usernameText}>@{user?.username}</Text>
                {user?.bio && <Text style={styles.bioText}>{user.bio}</Text>}
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {formatNumber(user?.postsCount || 0)}
                  </Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {formatNumber(user?.followersCount || 0)}
                  </Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {formatNumber(user?.followingCount || 0)}
                  </Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <Button
                  title="Edit Profile"
                  variant="outline"
                  style={styles.editButton}
                  onPress={() => {
                    Alert.alert('Coming Soon', 'Edit profile feature coming soon');
                  }}
                />
                <Button
                  title="Logout"
                  variant="outline"
                  style={styles.logoutButton}
                  onPress={handleLogout}
                />
              </View>
            </View>

            {posts.length > 0 && (
              <View style={styles.postsHeader}>
                <Text style={styles.postsTitle}>Your Posts</Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => {}}
            onLike={handleLike}
            onDelete={handleDeletePost}
            currentUserId={user?._id}
            isLiking={liking === item._id}
          />
        )}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={
          error ? (
            <ErrorMessage message={error} onRetry={loadUserPosts} fullScreen />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 48 }}>📝</Text>
              <Text style={styles.emptyText}>No posts yet</Text>
            </View>
          )
        }
      />
    </SafeArea>
  );
}
