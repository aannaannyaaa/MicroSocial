export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
  };
  
  export const validatePassword = (password: string): boolean => {
    return !!password && password.length >= 6 && password.length <= 128;
  };
  
  export const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
  };
  
  export const validatePostContent = (content: string): boolean => {
    return typeof content === 'string' && content.trim().length > 0 && content.length <= 500;
  };
  
  export const validateCommentContent = (content: string): boolean => {
    return typeof content === 'string' && content.trim().length > 0 && content.length <= 300;
  };
  
  export const validateBio = (bio: string): boolean => {
    return !bio || (typeof bio === 'string' && bio.length > 0 && bio.length <= 500);
  };
  
  export const validateImageUrl = (imageUrl: string): boolean => {
    try {
      new URL(imageUrl);
      return true;
    } catch {
      return false;
    }
  };
  
  export const isValidMongoId = (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };
  
  export const checkValidation = (validations: boolean[], messages: string[]) => {
    for (let i = 0; i < validations.length; i++) {
      if (!validations[i]) {
        return { valid: false, message: messages[i] };
      }
    }
    return { valid: true, message: '' };
  };
  