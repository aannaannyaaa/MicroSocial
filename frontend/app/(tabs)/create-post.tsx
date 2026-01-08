import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { postsService } from "../../src/services/posts";
import { SafeArea } from "../../src/components/SafeArea";
import { Button } from "../../src/components/Button";
import {
  COLORS,
  SIZES,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
} from "../../src/utils/constants";

const MAX_CONTENT_LENGTH = 280;

export default function CreatePostScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeText = (text: string) => {
    if (text.length <= MAX_CONTENT_LENGTH) {
      setContent(text);
    } else {
      // hard limit, ignore extra chars
      setContent(text.slice(0, MAX_CONTENT_LENGTH));
    }
  };

  const handleCreatePost = async () => {
    const trimmed = content.trim();

    if (!trimmed) {
      Alert.alert("Validation", "Please enter some content");
      return;
    }

    setLoading(true);
    try {
      await postsService.createPost(trimmed);
      Alert.alert("Success", "Post created successfully!");
      setContent("");
      router.push("/(app)/feed");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create post";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const remaining = MAX_CONTENT_LENGTH - content.length;

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
    },
    section: {
      marginBottom: SPACING.lg,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.textSecondary,
      marginBottom: SIZES.md,
      textTransform: "uppercase",
    },
    authorSection: {
      flexDirection: "row",
      alignItems: "center",
      paddingBottom: SPACING.md,
      borderBottomColor: COLORS.border,
      borderBottomWidth: 1,
      marginBottom: SPACING.md,
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
    contentInput: {
      minHeight: 120,
      maxHeight: 300,
      backgroundColor: COLORS.surface,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      fontSize: FONT_SIZES.base,
      color: COLORS.text,
      textAlignVertical: "top",
      marginBottom: SPACING.xs,
    },
    counterRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    counterText: {
      fontSize: FONT_SIZES.xs,
      color: remaining < 0 ? COLORS.danger : COLORS.textSecondary,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: SPACING.md,
      marginTop: SPACING.lg,
    },
    cancelButton: {
      flex: 1,
    },
    publishButton: {
      flex: 1,
    },
  });

  return (
    <SafeArea style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.authorSection}>
            <View
              style={styles.avatar}
            >
              {/* optionally initial */}
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{user?.name}</Text>
              <Text style={styles.authorHandle}>@{user?.username}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's on your mind?</Text>
            <TextInput
              multiline
              numberOfLines={6}
              style={styles.contentInput}
              placeholder="Share your thoughts..."
              placeholderTextColor={COLORS.textSecondary}
              value={content}
              onChangeText={handleChangeText}
              editable={!loading}
            />
            <View style={styles.counterRow}>
              <Text style={styles.counterText}>
                {content.length}/{MAX_CONTENT_LENGTH}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => {
                setContent("");
                router.back();
              }}
              variant="outline"
              style={styles.cancelButton}
              disabled={loading}
            />
            <Button
              title="Publish"
              onPress={handleCreatePost}
              loading={loading}
              style={styles.publishButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
