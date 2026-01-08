import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { postsService } from '../../src/services/posts';
import { Post, PostResponse } from '../../src/types';
import { SafeArea } from '../../src/components/SafeArea';
import { Loading } from '../../src/components/Loading';
import { ErrorMessage } from '../../src/components/ErrorMessage';
import { formatDate, formatNumber } from '../../src/utils/format';
import {
  COLORS,
  SIZES,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
} from '../../src/utils/constants';
import  CommentsSection from '../../src/components/comment';

export default function PostDetailScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    loadPostDetail();
  }, [postId]);

  const loadPostDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!postId) {
        setError('Post not found');
        return;
      }

      const response: PostResponse = await postsService.getPostById(postId as string);

      if (response.success && response.data) {
        setPost(response.data);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load post';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      setLiking(true);
      
      // Call toggle endpoint
      const result = await postsService.toggleLike(post._id);
      
      // Update local state with server response
      setPost({
        ...post,
        isLiked: result.isLiked,
        likesCount: result.likeCount,
      });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to toggle like');
    } finally {
      setLiking(false);
    }
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.lg,
    },
    postContainer: {
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: SPACING.md,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text,
    },
    authorHandle: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textSecondary,
      marginTop: 2,
    },
    timestamp: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textSecondary,
      marginTop: SIZES.sm,
    },
    content: {
      padding: SPACING.md,
    },
    contentText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.text,
      lineHeight: 24,
    },
    statsSection: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.primary,
    },
    statLabel: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textSecondary,
      marginTop: SIZES.sm,
    },
    actionsSection: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      flex: 1,
      justifyContent: 'center',
    },
    actionButtonActive: {
      backgroundColor: '#FFE5E5',
    },
    actionText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
      marginLeft: SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
    },
    actionTextActive: {
      color: COLORS.danger,
    },
  });

  if (loading) {
    return (
      <SafeArea style={styles.safeArea}>
        <Loading fullScreen />
      </SafeArea>
    );
  }

  if (error || !post) {
    return (
      <SafeArea style={styles.safeArea}>
        <ErrorMessage
          message={error || 'Post not found'}
          onRetry={loadPostDetail}
          fullScreen
        />
      </SafeArea>
    );
  }

  return (
    <SafeArea style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.postContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{
                uri: post.author.avatar || 'https://via.placeholder.com/50',
              }}
              style={styles.avatar}
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.authorHandle}>@{post.author.username}</Text>
              <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.contentText}>{post.content}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatNumber(post.likesCount)}
              </Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatNumber(post.commentsCount)}
              </Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                post.isLiked && styles.actionButtonActive,
              ]}
              onPress={handleLike}
              disabled={liking}
            >
              <Text style={{ fontSize: FONT_SIZES.lg }}>
                {post.isLiked ? '❤️' : '🤍'}
              </Text>
              <Text
                style={[
                  styles.actionText,
                  post.isLiked && styles.actionTextActive,
                ]}
              >
                {post.isLiked ? 'Unlike' : 'Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={{ fontSize: FONT_SIZES.lg }}>💬</Text>
              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={{ fontSize: FONT_SIZES.lg }}>📤</Text>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>

          {post && (
            <CommentsSection
              postId={post._id}
              postCommentCount={post.commentsCount}
              onCommentCountChange={(count: any) =>
                setPost(prev => prev ? { ...prev, commentsCount: count } : null)
              }
            />
          )}
        </View>
      </ScrollView>
    </SafeArea>
  );
}
