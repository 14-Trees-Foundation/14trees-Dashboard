import axios, {AxiosInstance} from 'axios';
import { TreeType, TreeTypesDataState } from '../../types/treeType';
import { Plot } from '../../types/plot';
import { Organization } from '../../types/organization';
import { Pond } from '../../types/pond';
import { User } from '../../types/user';
import { OnsiteStaff } from '../../types/onSiteStaff';
import { Tree } from '../../types/tree';
import { UserTree } from '../../types/userTree';

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
            throw new Error('Failed to create tree type.');
        }
    }

    async updateTreeType(data: TreeType): Promise<TreeType> {
        try {
            const response = await axios.put<TreeType>(`/trees/treetypes/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update tree type');
        }
    }

    async deleteTreeType(data: TreeType): Promise<string> {
        try {
            await axios.delete<any>(`/trees/treetypes/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete tree type');
        }
    }


    /*
        Model- Plot: CRUD Operations/Apis for plots
    */

    async getPlots(): Promise<Plot[]> {
        const url = `/plots/`;
        try {
            const response = await this.api.get<Plot[]>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch plots: ${error.message}`);
        }
    }

    async createPlot(data: Plot): Promise<Plot> {
        try {
            const response = await axios.post<Plot>(`/plots/add`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create plot');
        }
    }

    async updatePlot(data: Plot): Promise<Plot> {
        try {
            const response = await axios.post<Plot>(`/plots/update`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update plot');
        }
    }

    async deletePlot(data: Plot): Promise<string> {
        try {
            await axios.delete<any>(`/plots/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete plot');
        }
    }

    /*
        Model- Organization: CRUD Operations/Apis for organizations
    */

    async getOrganizations(): Promise<Organization[]> {
        const url = `/organizations/`;
        try {
            const response = await this.api.get<Organization[]>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch organizations: ${error.message}`);
        }
    }

    async createOrganization(data: Organization): Promise<Organization> {
        try {
            const response = await axios.post<Organization>(`/organizations/add`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Organization');
        }
    }

    async updateOrganization(data: Organization): Promise<Organization> {
        try {
            const response = await axios.put<Organization>(`/organizations/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update Organization');
        }
    }

    async deleteOrganization(data: Organization): Promise<string> {
        try {
            await axios.delete<any>(`/organizations/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete organization');
        }
    }

    /*
        Model- Pond: CRUD Operations/Apis for ponds
    */

    async getPonds(): Promise<Pond[]> {
        const url = `/ponds/`;
        try {
            const response = await this.api.get<Pond[]>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch ponds: ${error.message}`);
        }
    }

    async createPond(data: Pond): Promise<Pond> {
        try {
            const response = await axios.post<Pond>(`/ponds/`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Pond');
        }
    }

    async updatePond(data: Pond): Promise<Pond> {
        try {
            const response = await axios.put<Pond>(`/ponds/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update Pond');
        }
    }

    async deletePond(data: Pond): Promise<string> {
        try {
            await axios.delete<any>(`/ponds/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete Pond');
        }
    }

    async getPondHistory(): Promise<Pond[]> {
        try {
            let response = await axios.get<Pond[]>(`/ponds/history`);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to pond history');
        }
    }

    /*
        Model- User: CRUD Operations/Apis for users
    */

    async getUsers(): Promise<User[]> {
        const url = `/users/`;
        try {
            const response = await this.api.get<User[]>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    async createUser(data: User): Promise<User> {
        try {
            const response = await axios.post<User>(`/users/`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create User');
        }
    }

    async updateUser(data: User): Promise<User> {
        try {
            const response = await axios.put<User>(`/users/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update User');
        }
    }

    async deleteUser(data: User): Promise<string> {
        try {
            await axios.delete<any>(`/users/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete User');
        }
    }

    async createUsersBulk(data: Blob): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('csvFile', data, 'users_data.csv');
            await axios.post<any>(`/users/bulk`, );
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create users in bulk');
        }
    }

    /*
        Model- OnsiteStaff: CRUD Operations/Apis for Onsite staff
    */

    async getOnsiteStaffs(): Promise<OnsiteStaff[]> {
        const url = `/onsitestaff/`;
        try {
            const response = await this.api.get<OnsiteStaff[]>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch OnsiteStaffs: ${error.message}`);
        }
    }

    async createOnsiteStaff(data: OnsiteStaff): Promise<OnsiteStaff> {
        try {
            const response = await axios.post<OnsiteStaff>(`/onsitestaff/`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create OnsiteStaff');
        }
    }

    async updateOnsiteStaff(data: OnsiteStaff): Promise<OnsiteStaff> {
        try {
            const response = await axios.put<OnsiteStaff>(`/onsitestaff/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update OnsiteStaff');
        }
    }

    async deleteOnsiteStaff(data: OnsiteStaff): Promise<string> {
        try {
            await axios.delete<any>(`/onsitestaff/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete OnsiteStaff');
        }
    }

    /*
        Model- Tree: CRUD Operations/Apis for trees
    */

    async getTrees(): Promise<Tree[]> {
        const url = `/trees/`;
        try {
            const response = await this.api.get<Tree[]>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch Trees: ${error.message}`);
        }
    }

    async createTree(data: Tree): Promise<Tree> {
        try {
            const response = await axios.post<Tree>(`/trees/`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Tree');
        }
    }

    async updateTree(data: Tree): Promise<Tree> {
        try {
            const response = await axios.put<Tree>(`/trees/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update Tree');
        }
    }

    async deleteTree(data: Tree): Promise<string> {
        try {
            await axios.delete<any>(`/trees/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete Tree');
        }
    }

    async createTreeBulk(data: Blob): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('csvFile', data, 'trees_data.csv');
            await axios.post<any>(`/trees/bulk`, );
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    /*
        Model- UserTree: CRUD Operations/Apis for user_tree_regs
    */

    async getUserTrees(): Promise<UserTree[]> {
        const url = `/profile/`;
        try {
            const response = await this.api.get<UserTree[]>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch user tree profile: ${error.message}`);
        }
    }

    async createUserTree(data: UserTree): Promise<UserTree> {
        try {
            const response = await axios.post<UserTree>(`/profile/`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create user tree profile');
        }
    }

    async updateUserTree(data: UserTree): Promise<UserTree> {
        try {
            const response = await axios.put<UserTree>(`/profile/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update user tree profile');
        }
    }

    async deleteUserTree(data: UserTree): Promise<string> {
        try {
            await axios.delete<any>(`/profile/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete user tree profile');
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
