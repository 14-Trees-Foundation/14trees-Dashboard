import { toast } from 'react-toastify';

/**
 * Utility function to handle API errors consistently across gift card components
 * @param error - The error object from the API call
 * @param defaultMessage - Default message to show if no specific error message is available
 * @param logContext - Additional context for logging
 */
export const handleGiftCardError = (
    error: any, 
    defaultMessage: string = "Something went wrong!", 
    logContext?: string
) => {
    // Extract the error message from various possible error structures
    let errorMessage = defaultMessage;
    
    if (error?.message) {
        errorMessage = error.message;
    } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
    } else if (error?.data?.message) {
        errorMessage = error.data.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    // Display the error to the user
    toast.error(errorMessage);

    // Log the error for debugging
    const logMessage = logContext ? `Gift card error (${logContext}):` : 'Gift card error:';
    console.error(logMessage, {
        message: errorMessage,
        originalError: error,
        timestamp: new Date().toISOString()
    });

    return errorMessage;
};

/**
 * Utility function to handle successful operations consistently
 * @param message - Success message to display
 * @param logContext - Additional context for logging
 */
export const handleGiftCardSuccess = (
    message: string,
    logContext?: string
) => {
    toast.success(message);
    
    if (logContext) {
        console.log(`Gift card success (${logContext}):`, {
            message,
            timestamp: new Date().toISOString()
        });
    }
};

/**
 * Common error messages for gift card operations
 */
export const GIFT_CARD_ERROR_MESSAGES = {
    BOOKING_FAILED: "Failed to book trees for gift card request",
    CREATION_FAILED: "Failed to create gift card request",
    UPDATE_FAILED: "Failed to update gift card request",
    DELETION_FAILED: "Failed to delete gift card request",
    FETCH_FAILED: "Failed to fetch gift card data",
    PLOT_ASSIGNMENT_FAILED: "Failed to assign plots to gift card request",
    INSUFFICIENT_TREES: "Not enough trees available for this request",
    TREES_ALREADY_ASSIGNED: "Some trees are already assigned to another request",
    INVALID_REQUEST: "Invalid request data provided",
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
    GENERIC: "Something went wrong. Please try again later."
} as const;