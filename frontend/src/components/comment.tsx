import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import { postsService } from '../services/posts';
import { Comment } from '../types';
import { formatDate } from '../utils/format';
import {
  COLORS,
  SIZES,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
} from '../utils/constants';
import { Loading } from './Loading';

interface CommentsSectionProps {
  postId: string;
  postCommentCount: number;
  onCommentCountChange: (count: number) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  postCommentCount,
  onCommentCountChange,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async (refresh = false) => {
    try {
      setLoadingComments(true);
      const pageNum = refresh ? 1 : page;
      
      const response = await postsService.getComments(postId, pageNum, 10);
      
      if (response.success) {
        const commentsData = response.data.data;
        if (refresh) {
          setComments(commentsData);
          setPage(1);
        } else {
          setComments(prev => [...prev, ...commentsData]);
          setPage(pageNum + 1);
        }
        setHasMore(pageNum < response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const response = await postsService.addComment(postId, newComment);
      
      if (response.success) {
        setComments([response.data.comment, ...comments]);
        setNewComment('');
        onCommentCountChange(response.data.postCommentCount);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{item.author.name}</Text>
        <Text style={styles.commentTime}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text style={styles.commentText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          style={[
            styles.sendButton, 
            (!newComment.trim() || loading) && styles.sendButtonDisabled
          ]}
          onPress={handleAddComment}
          disabled={!newComment.trim() || loading}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Comments List */}
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item._id}
        style={styles.commentsList}
        contentContainerStyle={styles.commentsListContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loadingComments ? <Loading /> : null
        }
        onEndReached={() => {
          if (hasMore && !loadingComments) {
            loadComments(false);
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loadingComments ? (
            <Text style={styles.emptyText}>No comments yet</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.base,
    maxHeight: 100,
    textAlignVertical: 'center',
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginLeft: SPACING.sm,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  sendText: {
    color: COLORS.background,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  commentContainer: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  commentAuthor: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  commentTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  commentText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    lineHeight: 22,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    paddingVertical: SPACING.lg,
  },
});

export default CommentsSection;
