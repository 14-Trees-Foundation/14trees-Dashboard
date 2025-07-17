import moment from "moment";

export function strEquals(s1: string, s2: string) {

    if (s1 == null && s2 !== null) {
        return false
    }

    if (s1 !== null && s2 == null) {
        return false
    }

    if (s1 == null && s2 == null) {
        return true
    }

    const a = s1.trim(), b = s2.trim()

    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}

export function getFormattedDate(dateStr: string) { 
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const isValidDate = !isNaN(date.getDate()) && date.getTime() > 0;
        return isValidDate ? `${day}-${month}-${year}` : ''
}

export function getHumanReadableDate(dateStr: string | number) { 
    const date = new Date(dateStr);
    const isValidDate = !isNaN(date.getDate()) && date.getTime() > 0;
    return isValidDate ? moment(date).format('MMMM DD, YYYY') : '';
}

export function getHumanReadableDateTime(dateStr: string | number) { 
    const date = new Date(dateStr);
    const isValidDate = !isNaN(date.getDate()) && date.getTime() > 0;
    return isValidDate ? moment(date).format('MMMM DD, YYYY hh:mm') : '';
}

export const getUniqueRequestId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Generate dashboard URL for a given sapling ID
 * Uses environment variable for base URL with fallback to production
 */
export const getDashboardUrl = (saplingId: string): string => {
    const dashboardBaseUrl = import.meta.env.VITE_DASHBOARD_BASE_URL || 'https://dashboard.14trees.org';
    return `${dashboardBaseUrl}/profile/${saplingId}`;
};

/**
 * Generate any external URL based on environment configuration
 * Useful for creating links to different parts of the application ecosystem
 */
export const getExternalUrl = (baseUrlEnvVar: string, fallbackUrl: string, path: string): string => {
    const baseUrl = import.meta.env[baseUrlEnvVar] || fallbackUrl;
    return `${baseUrl}${path}`;
};

export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.result) {
                resolve(reader.result.toString());
            } else {
                reject(new Error("File could not be read"));
            }
        };

        reader.onerror = () => {
            reject(new Error("Error reading file"));
        };

        reader.readAsDataURL(file);
    });
};