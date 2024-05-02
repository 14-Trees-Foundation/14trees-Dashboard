import axios, {AxiosInstance} from 'axios';
import { TreeType, TreeTypesDataState } from '../../types/treeType';

class ApiClient {
    private api: AxiosInstance;
    
    constructor() {
        const baseURL = process.env.REACT_APP_BASE_URL;
        this.api = axios.create({
          baseURL: baseURL,
        });
    }

    /*
        Model- TreeTypes: CRUD Operations/Apis for tree types 
    */

    async getTreeTypes(): Promise<TreeType[]> {
        const url = `/trees/treetypes`;
        try {
            const response = await this.api.get<TreeType[]>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch tree types: ${error.message}`);
        }
    }

    async createTreeType(data: TreeType): Promise<TreeType> {
        try {
            const response = await axios.post<TreeType>(`/trees/addtreetype`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create book');
        }
    }
    
}

// new function to fetch data form localStorage
export const fetchDataFromLocal = (key: string) => {
    return JSON.parse(localStorage.getItem(key) || "{}");
};

// new function to set data in localStorage
export const setDataToLocal = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
};



export default ApiClient;
