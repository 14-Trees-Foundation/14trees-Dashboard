export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '') return true;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // International phone number validation
  return phoneRegex.test(phone);
};

export const generateDefaultEmail = (name: string): string => {
  return name.toLowerCase().split(" ").join('.') + ".donor@14trees";
};

export const isValidTreeId = (treeId: string): boolean => {
  if (!treeId || treeId.trim() === '') return false;
  // Basic tree ID validation - adjust pattern based on your tree ID format
  const treeIdRegex = /^[A-Z0-9]{3,10}$/i; // Alphanumeric, 3-10 characters
  return treeIdRegex.test(treeId.trim());
};

export const validateUser = (user: any, requestType?: 'Gift Request' | 'Visit'): boolean => {
  const basicValidation = isValidEmail(user.recipient_email) && 
                         isValidPhone(user.recipient_phone) && 
                         user.recipient_name !== '';
  
  // Additional validation for Visit type
  if (requestType === 'Visit') {
    return basicValidation && isValidTreeId(user.tree_id);
  }
  
  return basicValidation;
};