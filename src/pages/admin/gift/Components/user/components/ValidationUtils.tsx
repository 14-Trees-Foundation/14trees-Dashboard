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

export const validateUser = (user: any): boolean => {
  return isValidEmail(user.recipient_email) && 
         isValidPhone(user.recipient_phone) && 
         user.recipient_name !== '';
};