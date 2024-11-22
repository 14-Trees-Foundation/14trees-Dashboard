import axios from "axios";
import ApiClient from "../api/apiClient/apiClient";


class AWSUtils {

    async uploadFileToS3(type: string, file: File, folder?: string, setUploadProgress?: any) {
        const key = folder ? folder + "/" + file.name : file.name;
        const apiClient = new ApiClient();
        const signedUrl = await apiClient.getSignedPutUrl(type, key);

        try {
            const response = await axios.put(signedUrl, file, {
                headers: {
                    'Content-Type': file.type
                },
                onUploadProgress: (evt) => {
                    setUploadProgress && setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
                }
            })
    
            if (!response.status) {
                throw new Error(`Failed to upload file. Status: ${response.status}`);
            }

            const urlObject = new URL(signedUrl);
            urlObject.search = '';  // Clear the query parameters
            return urlObject.toString(); // Object Url
        } catch (error) {
            throw error;
        }
    }

    // check if public file exists in s3 or not
    async checkIfPublicFileExists(key: string): Promise<boolean> {
        try {
            const response = await axios.get(`https://14treesplants.s3.amazonaws.com/${key}`, {responseType: 'arraybuffer'});
            if (!response.status) {
                throw new Error(`Failed to check if public file exists. Status: ${response.status}`);
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    getS3UrlForKey(key: string): string {
        return `https://14treesplants.s3.amazonaws.com/${key}`
    }
}

export { AWSUtils }