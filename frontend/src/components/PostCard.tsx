import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Post } from '../types';
import { formatDate, formatNumber } from '../utils/format';
import {
  COLORS,
  SIZES,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from '../utils/constants';

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  currentUserId?: string;
  isLiking?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onLike,
  onDelete,
  currentUserId,
  isLiking = false,
}) => {
  const isOwnPost = currentUserId === post.author._id;

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => onDelete(post._id),
          style: 'destructive',
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: COLORS.surface,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.border,
      overflow: 'hidden',
      ...SHADOWS.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    authorSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: SPACING.md,
      backgroundColor: COLORS.primary,
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
    },
    moreButton: {
      padding: SPACING.sm,
    },
    content: {
      padding: SPACING.md,
    },
    contentText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.text,
      lineHeight: 24,
      marginBottom: post.image ? SPACING.md : 0,
    },
    image: {
      width: '100%',
      height: 300,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: COLORS.surface,
      marginBottom: SPACING.md,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.sm,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    action: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      flex: 1,
      justifyContent: 'center',
    },
    actionActive: {
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
    statCount: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textSecondary,
      marginLeft: SIZES.xs,
    },
    deleteButton: {
      padding: SPACING.sm,
    },
    moreButtonText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.textSecondary,
    },
  });

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorSection}>
          <Image
            source={{
              uri: post.author.avatar || 'https://via.placeholder.com/48',
            }}
            style={styles.avatar}
          />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            <Text style={styles.authorHandle}>@{post.author.username}</Text>
            <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>

        {isOwnPost && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.moreButtonText}>⋯</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.content}>
          <Text style={styles.contentText}>{post.content}</Text>
          {post.image && (
            <Image
              source={{ uri: post.image }}
              style={styles.image}
            />
          )}
        </View>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.action, post.isLiked && styles.actionActive]}
          onPress={() => onLike(post._id)}
          disabled={isLiking}
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
            Like
          </Text>
          <Text style={styles.statCount}>{formatNumber(post.likesCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={onPress}
        >
          <Text style={{ fontSize: FONT_SIZES.lg }}>💬</Text>
          <Text style={styles.actionText}>Comment</Text>
          <Text style={styles.statCount}>{formatNumber(post.commentsCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={onPress}
        >
          <Text style={{ fontSize: FONT_SIZES.lg }}>📤</Text>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
