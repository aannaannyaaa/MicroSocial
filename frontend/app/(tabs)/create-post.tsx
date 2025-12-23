import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../src/context/AuthContext';
import { postsService } from '../../src/services/posts';
import { SafeArea } from '../../src/components/SafeArea';
import { Button } from '../../src/components/Button';
import {
  COLORS,
  SIZES,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  BORDER_RADIUS,
} from '../../src/utils/constants';

export default function CreatePostScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'We need access to your media library to upload images'
        );
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
  
      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  

  const uploadImage = async (uri: string): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match}` : 'image/jpeg';

      formData.append('image', {
        uri,
        name: filename || 'photo.jpg',
        type,
      } as any);

      const response = await postsService.uploadImage(formData);
      return response?.url || null;
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert('Validation', 'Please enter some content');
      return;
    }

    setLoading(true);
    try {
      let imageUrl: string | undefined = undefined;

      if (selectedImage) {
        const url = await uploadImage(selectedImage);
        if (url) {
          imageUrl = url;
        }
      }

      await postsService.createPost(content);
      Alert.alert('Success', 'Post created successfully!');
      setContent('');
      setSelectedImage(null);
      router.push('/(app)/feed');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

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
      textTransform: 'uppercase',
    },
    authorSection: {
      flexDirection: 'row',
      alignItems: 'center',
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
      textAlignVertical: 'top',
      marginBottom: SPACING.md,
    },
    imagePreviewContainer: {
      marginVertical: SPACING.md,
    },
    imagePreview: {
      width: '100%',
      height: 250,
      borderRadius: BORDER_RADIUS.md,
      marginBottom: SPACING.md,
      backgroundColor: COLORS.surface,
    },
    removeImageButton: {
      backgroundColor: COLORS.danger,
      paddingVertical: SIZES.md,
      paddingHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
    },
    removeImageText: {
      color: COLORS.background,
      fontWeight: FONT_WEIGHTS.semibold,
      fontSize: FONT_SIZES.sm,
    },
    imageButtonContainer: {
      marginBottom: SPACING.md,
    },
    imageButton: {
      borderWidth: 2,
      borderColor: COLORS.primary,
      borderStyle: 'dashed',
      borderRadius: BORDER_RADIUS.md,
      paddingVertical: SPACING.lg,
      paddingHorizontal: SPACING.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 102, 255, 0.05)',
    },
    imageButtonText: {
      fontSize: FONT_SIZES.base,
      color: COLORS.primary,
      fontWeight: FONT_WEIGHTS.semibold,
      marginTop: SIZES.sm,
    },
    buttonContainer: {
      flexDirection: 'row',
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Author Section */}
          <View style={styles.authorSection}>
            <Image
              source={{
                uri: user?.avatar || 'https://via.placeholder.com/48',
              }}
              style={styles.avatar}
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{user?.name}</Text>
              <Text style={styles.authorHandle}>@{user?.username}</Text>
            </View>
          </View>

          {/* Content Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's on your mind?</Text>
            <TextInput
              multiline
              numberOfLines={6}
              style={styles.contentInput}
              placeholder="Share your thoughts..."
              placeholderTextColor={COLORS.textSecondary}
              value={content}
              onChangeText={setContent}
              editable={!loading && !uploadingImage}
            />
          </View>

          {/* Image Section */}
          <View style={styles.section}>
            {selectedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.sectionTitle}>Image Preview</Text>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                  disabled={loading || uploadingImage}
                >
                  <Text style={styles.removeImageText}>Remove Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imageButtonContainer}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={pickImage}
                  disabled={loading || uploadingImage}
                >
                  <Text style={{ fontSize: 32 }}>📷</Text>
                  <Text style={styles.imageButtonText}>Add Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => {
                setContent('');
                setSelectedImage(null);
                router.back();
              }}
              variant="outline"
              style={styles.cancelButton}
              disabled={loading || uploadingImage}
            />
            <Button
              title={uploadingImage ? 'Uploading...' : 'Publish'}
              onPress={handleCreatePost}
              loading={loading}
              style={styles.publishButton}
              disabled={uploadingImage}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
