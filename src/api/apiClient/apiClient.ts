import axios, {AxiosInstance} from 'axios';
import { CreateTreeTypeResponse, TreeType, TreeTypePaginationResponse, TreeTypesDataState } from '../../types/treeType';
import { Plot, PlotPaginationResponse, UpsertPlotResponse } from '../../types/plot';
import { Organization, OrganizationPaginationResponse } from '../../types/organization';
import { CreatePondResponse, Pond, PondPaginationResponse } from '../../types/pond';
import { User, UserPaginationResponse } from '../../types/user';
import { OnsiteStaff } from '../../types/onSiteStaff';
import { PaginationTreeResponse, Tree } from '../../types/tree';
import { UserTree, UserTreeCountPaginationResponse } from '../../types/userTree';

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

    async getTreeTypes(offset: number, limit: number): Promise<TreeTypePaginationResponse> {
        const url = `/trees/treetypes?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<TreeTypePaginationResponse>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch tree types: ${error.message}`);
        }
    }

    async searchTreeTypes(searchStr: string): Promise<TreeType[]> {
        const url = `/trees/${searchStr}`;
        try {
            const response = await this.api.get<TreeType[]>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch tree types: ${error.message}`);
        }
    }

    async createTreeType(data: TreeType, file?: Blob): Promise<TreeType> {
        try {
            const formData = new FormData();
            if (file) {
                formData.append("files", file);
            }
            Object.entries(data).forEach(([key, value]) => {
                if (key != 'image') {
                    const strValue = value as string
                    formData.append(key, strValue);
                }
              });
            const response = await this.api.post<CreateTreeTypeResponse>(`/trees/addtreetype`, formData);
            return response.data.treetype;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create tree type.');
        }
    }

    async updateTreeType(data: TreeType, file?: Blob): Promise<TreeType> {
        try {
            const formData = new FormData();
            if (file) {
                formData.append("files", file);
            }
            Object.entries(data).forEach(([key, value]) => {
                if (key != 'image') {
                    const strValue = value as string
                    formData.append(key, strValue);
                }
              });
            const response = await this.api.put<TreeType>(`/trees/treetypes/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update tree type');
        }
    }

    async deleteTreeType(data: TreeType): Promise<string> {
        try {
            await this.api.delete<any>(`/trees/treetypes/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete tree type');
        }
    }


    /*
        Model- Plot: CRUD Operations/Apis for plots
    */

    async getPlots(offset: number, limit: number): Promise<PlotPaginationResponse> {
        const url = `/plots/?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<PlotPaginationResponse>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch plots: ${error.message}`);
        }
    }

    async searchPlots(searchStr: string): Promise<Plot[]> {
        const url = `/plots/${searchStr}`;
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
            const response = await this.api.post<UpsertPlotResponse>(`/plots/add`, data);
            return response.data.plot;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create plot');
        }
    }

    async updatePlot(data: Plot): Promise<Plot> {
        try {
            const response = await this.api.post<UpsertPlotResponse>(`/plots/update`, { 'shortname': data.plot_id, 'boundaries': data.boundaries.coordinates[0]});
            return response.data.plot;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update plot');
        }
    }

    async deletePlot(data: Plot): Promise<string> {
        try {
            await this.api.delete<any>(`/plots/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete plot');
        }
    }

    /*
        Model- Organization: CRUD Operations/Apis for organizations
    */

    async getOrganizations(offset: number, limit: number): Promise<OrganizationPaginationResponse> {
        const url = `/organizations/?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<OrganizationPaginationResponse>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch organizations: ${error.message}`);
        }
    }

    async searchOrganizations(searchStr: string): Promise<Organization[]> {
        const url = `/organizations/${searchStr}`;
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
            const response = await this.api.post<Organization>(`/organizations/add`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Organization');
        }
    }

    async updateOrganization(data: Organization): Promise<Organization> {
        try {
            const response = await this.api.put<Organization>(`/organizations/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update Organization');
        }
    }

    async deleteOrganization(data: Organization): Promise<string> {
        try {
            await this.api.delete<any>(`/organizations/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete organization');
        }
    }

    /*
        Model- Pond: CRUD Operations/Apis for ponds
    */

    async getPonds(offset: number, limit: number): Promise<PondPaginationResponse> {
        const url = `/ponds/?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<PondPaginationResponse>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch ponds: ${error.message}`);
        }
    }

    async searchPonds(searchStr: string): Promise<Pond[]> {
        const url = `/ponds/${searchStr}`;
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
            const response = await this.api.post<CreatePondResponse>(`/ponds/`, data);
            return response.data.pond;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Pond');
        }
    }

    async updatePond(data: Pond): Promise<Pond> {
        try {
            const response = await this.api.put<Pond>(`/ponds/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update Pond');
        }
    }

    async updatePondWaterLevel(pondName: string, levelFt: number, userId: string, file?: Blob): Promise<void> {
        try {
            const formData = new FormData();
            if (file) {
                formData.append("files", file);
            }
            formData.append('pond_name', pondName);
            formData.append('levelFt', levelFt.toString());
            formData.append('user_id', userId);
            await this.api.post<any>(`/ponds/update-pond-level`, formData);
            return;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update Pond');
        }
    }

    async deletePond(data: Pond): Promise<string> {
        try {
            await this.api.delete<any>(`/ponds/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete Pond');
        }
    }

    async getPondHistory(): Promise<Pond[]> {
        try {
            let response = await this.api.get<Pond[]>(`/ponds/history`);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to pond history');
        }
    }

    /*
        Model- User: CRUD Operations/Apis for users
    */

    async getUsers(offset: number, limit: number): Promise<UserPaginationResponse> {
        const url = `/users/?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<UserPaginationResponse>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    async searchUsers(searchStr: string): Promise<User[]> {
        const url = `/users/${searchStr}`;
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
            const response = await this.api.post<User>(`/users/`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create User');
        }
    }

    async updateUser(data: User): Promise<User> {
        try {
            const response = await this.api.put<User>(`/users/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update User');
        }
    }

    async deleteUser(data: User): Promise<string> {
        try {
            await this.api.delete<any>(`/users/${data._id}`);
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
            await this.api.post<any>(`/users/bulk`, );
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
            const response = await this.api.post<OnsiteStaff>(`/onsitestaff/`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create OnsiteStaff');
        }
    }

    async updateOnsiteStaff(data: OnsiteStaff): Promise<OnsiteStaff> {
        try {
            const response = await this.api.put<OnsiteStaff>(`/onsitestaff/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update OnsiteStaff');
        }
    }

    async deleteOnsiteStaff(data: OnsiteStaff): Promise<string> {
        try {
            await this.api.delete<any>(`/onsitestaff/${data._id}`);
            return data._id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete OnsiteStaff');
        }
    }

    /*
        Model- Tree: CRUD Operations/Apis for trees
    */

    async getTrees(offset: number, limit: number): Promise<PaginationTreeResponse> {
        const url = `/trees/?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<PaginationTreeResponse>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch Trees: ${error.message}`);
        }
    }

    async createTree(data: Tree, file?: Blob): Promise<Tree> {
        try {
            const formData = new FormData();
            if (file) {
                formData.append("files", file);
                formData.append("images", (file as File).name);
            }
            formData.append('sapling_id', data.sapling_id);
            formData.append('tree_id', data.tree_id);
            formData.append('plot_id', data.plot_id);
            if (data.location && data.location.coordinates && data.location.coordinates.length === 2) {
                formData.append('lat', data.location.coordinates[0].toString());
                formData.append('lng', data.location.coordinates[1].toString());
            }
            formData.append('mapped_to', data.mapped_to);
            formData.append('user_id', data.user_id);
            const response = await this.api.post<Tree>(`/trees/`, formData);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Tree');
        }
    }

    async updateTree(data: Tree, file?:Blob): Promise<Tree> {
        try {
            const formData = new FormData();
            console.log(file)

            if (file) {
                formData.append("files", file);
            }
            Object.entries(data).forEach(([key, value]) => {
                if (key != 'image') {
                    const strValue = value as string
                    formData.append(key, strValue);
                }
              });
            console.log(formData)
            const response = await this.api.put<Tree>(`/trees/${data._id}`, formData);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update Tree');
        }
    }

    async deleteTree(data: Tree): Promise<string> {
        try {
            await this.api.delete<any>(`/trees/${data._id}`);
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
            await this.api.post<any>(`/trees/bulk`, );
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async mapTrees(saplingIds: string[], email: string): Promise<void> {
        try {
            await this.api.post<any>(`/mytrees/assign`, { saplingids: saplingIds.join(',') , email: email});
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async mapTreesForPlot(email: string, plotId: string, count: number): Promise<void> {
        try {
            await this.api.post<any>(`/mytrees/map-plot-trees`, { email: email, plot_id: plotId, count: count});
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async removeTreeMappings(saplingIds: string[]): Promise<void> {
        try {
            await this.api.post<any>(`/mytrees/unmap`, { sapling_ids: saplingIds});
        } catch (error) { 
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async getMappedTrees(email: string): Promise<void> {
        try {
            await this.api.post<any>(`/mytrees/${email}`);
        } catch (error) { 
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async getUserTreeCount(offset: number, limit: number, filters?: any): Promise<UserTreeCountPaginationResponse> {
        let url = `/mytrees/count/usertreescount?offset=${offset}&limit=${limit}`
        try {
            let result = await this.api.post<UserTreeCountPaginationResponse>(url, {filters: filters});
            return result.data;
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
            const response = await this.api.post<UserTree>(`/profile/`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create user tree profile');
        }
    }

    async updateUserTree(data: UserTree): Promise<UserTree> {
        try {
            const response = await this.api.put<UserTree>(`/profile/${data._id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update user tree profile');
        }
    }

    async unassignUserTrees(saplingIds: string[]): Promise<void> {
        try {
            await this.api.post<void>(`/profile`, { sapling_ids: saplingIds });
        } catch (error) {
            console.error(error)
            throw new Error('Failed unassign user trees.');
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
