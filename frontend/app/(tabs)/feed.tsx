import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../src/context/AuthContext";
import { postsService } from "../../src/services/posts";
import { Post, FeedResponse } from "../../src/types";
import { PostCard } from "../../src/components/PostCard";
import { Loading } from "../../src/components/Loading";
import { ErrorMessage } from "../../src/components/ErrorMessage";
import { SafeArea } from "../../src/components/SafeArea";
import { COLORS, SIZES } from "../../src/utils/constants";

export default function FeedScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [liking, setLiking] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadFeed(true);
    }, [])
  );

  const loadFeed = async (refresh = false) => {
    try {
      const pageNum = refresh ? 1 : page;
      if (refresh) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response: FeedResponse = await postsService.getFeed(pageNum, 10);

      if (response.success) {
        const postsData = response.data.data;
        const pagination = response.data.pagination;

        const postsWithLikeStatus = postsData.map((post) => ({
          ...post,
          isLiked: post.isLiked ?? false,
        }));

        if (refresh) {
          setPosts(postsWithLikeStatus);
          setPage(1);
        } else {
          setPosts((prev) => [...prev, ...postsWithLikeStatus]);
          setPage(pageNum + 1);
        }

        setHasMore(pageNum < pagination.pages);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to load feed";
      setError(errorMessage);
      if (refresh) {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
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
      Alert.alert("Error", "Failed to like post");
    } finally {
      setLiking(null);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await postsService.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      Alert.alert("Success", "Post deleted successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to delete post");
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
    contentContainer: {
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.md,
    },
  });

  if (loading && posts.length === 0) {
    return (
      <SafeArea style={styles.safeArea}>
        <Loading fullScreen />
      </SafeArea>
    );
  }

  if (error && posts.length === 0) {
    return (
      <SafeArea style={styles.safeArea}>
        <ErrorMessage
          message={error}
          onRetry={() => loadFeed(true)}
          fullScreen
        />
      </SafeArea>
    );
  }

  return (
    <SafeArea style={styles.safeArea}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() =>
              router.push({
                pathname: "/post-detail",
                params: { postId: item._id },
              })
            }
            onLike={handleLike}
            onDelete={handleDeletePost}
            currentUserId={user?._id}
            isLiking={liking === item._id}
          />
        )}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadFeed(true);
            }}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={() => {
          if (hasMore && !loadingMore) {
            loadFeed(false);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <Loading /> : null}
        scrollIndicatorInsets={{ right: 1 }}
      />
    </SafeArea>
  );
}
