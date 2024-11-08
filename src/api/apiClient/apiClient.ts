import axios, { AxiosInstance } from 'axios';
import { PlantType } from '../../types/plantType';
import { Plot } from '../../types/plot';
import { BulkUserGroupMappingResponse, Group } from '../../types/Group';
import { Pond, PondWaterLevelUpdate } from '../../types/pond';
import { User } from '../../types/user';
import { Site } from '../../types/site';
import { Donation } from '../../types/donation';
import { OnsiteStaff } from '../../types/onSiteStaff';
import { MapTreesUsingPlotIdRequest, MapTreesUsingSaplingIdsRequest, Tree } from '../../types/tree';
import { UserTree, UserTreeCountPaginationResponse } from '../../types/userTree';
import { PaginatedResponse } from '../../types/pagination';
import { Event } from '../../types/event';
import { Visit, BulkVisitUsersMappingResponse } from '../../types/visits';
import { TreeImage } from '../../types/tree_snapshots';
import { GiftCard, GiftCardUser } from '../../types/gift_card';
import { Tag } from '../../types/tag';


class ApiClient {
    private api: AxiosInstance;

    constructor() {
        const baseURL = process.env.REACT_APP_BASE_URL;
        this.api = axios.create({
            baseURL: baseURL,
        });
    }

    /*
        Model- PlantTypes: CRUD Operations/Apis for tree types 
    */

    async getPlantTypes(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<PlantType>> {
        const url = `/plant-types/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<PlantType>>(url, { filters: filters });
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch tree types: ${error.message}`);
        }
    }

    async searchPlantTypes(searchStr: string): Promise<PlantType[]> {
        const url = `/plant-types/${searchStr}`;
        try {
            const response = await this.api.get<PlantType[]>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch tree types: ${error.message}`);
        }
    }

    async createPlantType(data: PlantType, files: Blob[]): Promise<PlantType> {
        try {
            const formData = new FormData();
            if (files) {
                files.forEach((file) => {
                    formData.append("files", file);
                });
            }
            Object.entries(data).forEach(([key, value]) => {
                if (key != 'image') {

                    const strValue = value as string
                    formData.append(key, strValue);
                }
            });
            const response = await this.api.post<PlantType>(`/plant-types/`, formData);

            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create tree type.');
        }
    }

    async updatePlantType(data: PlantType, file?: Blob): Promise<PlantType> {
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
            const response = await this.api.put<PlantType>(`/plant-types/${data.id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update tree type');
        }
    }

    async deletePlantType(data: PlantType): Promise<number> {
        try {
            await this.api.delete<any>(`/plant-types/${data.id}`);
            return data.id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete tree type');
        }
    }

    async getPlantTypesForPlot(plotId: number): Promise<any[]> {
        try {
            const resp = await this.api.get<any[]>(`/plant-types/${plotId}`);
            return resp.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to get plant types for plot!');
        }
    }


    /*
        Model- Plot: CRUD Operations/Apis for plots
    */

    async getPlots(offset: number, limit: number, filters?: any[], orderBy?: any[]): Promise<PaginatedResponse<Plot>> {
        const url = `/plots/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Plot>>(url, { filters: filters, order_by: orderBy });
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
            const response = await this.api.post<Plot>(`/plots`, data);
            console.log("create plot response: ", response.data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create plot');
        }
    }

    async updatePlot(data: Plot): Promise<Plot> {
        try {
            const response = await this.api.put<Plot>(`/plots/${data.id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update plot');
        }
    }

    async updatePlotCoordsUsingKml(siteId: number, file: File): Promise<void> {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("site_id", String(siteId));
            const response = await this.api.post<Plot>(`/plots/kml`, formData);
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update coordinates');
        }
    }

    async deletePlot(data: Plot): Promise<number> {
        try {
            await this.api.delete<any>(`/plots/${data.id}`);
            return data.id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete plot');
        }
    }

    async assignPlotsToSite(plotIds: number[], siteId: number): Promise<void> {
        let url = `/plots/assign-site`
        try {
            await this.api.post<void>(url, { plot_ids: plotIds, site_id: siteId });
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Failed assign plots to site');
        }
    }

    async getPlotAggregations(offset: number, limit: number, filters?: any[], orderBy?: any[]): Promise<PaginatedResponse<Plot>> {
        const url = `/plots/stats?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Plot>>(url, { filters: filters, order_by: orderBy });
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch plots: ${error.message}`);
        }

    }


    /*
        Model- Group: CRUD Operations/Apis for organizations
    */

    async getTags(offset: number, limit: number): Promise<PaginatedResponse<Tag>> {
        const url = `/tags?offset${offset}&limit=${limit}`
        const response = await this.api.get<PaginatedResponse<Tag>>(url);
        return response.data;
    }
    

    /*
        Model- Group: CRUD Operations/Apis for organizations
    */

    async getGroups(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<Group>> {
        const url = `/groups/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Group>>(url, { filters });
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch groups: ${error.message}`);
        }
    }

    async createGroup(data: Group, logo?: File): Promise<Group> {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("type", data.type);
            formData.append("description", data.description);
            if (logo) {
                formData.append("logo", logo);
            }

            const response = await this.api.post<Group>(`/groups`, formData);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Group');
        }
    }

    async updateGroup(data: Group, logo?: File): Promise<Group> {
        try {

            const formData = new FormData();
            formData.append("id", data.id.toString());
            formData.append("name", data.name);
            formData.append("type", data.type);
            if (data.description) formData.append("description", data.description);
            formData.append("create_at", data.created_at as any);
            formData.append("updated_at", data.updated_at as any);
            if (logo) {
                formData.append("logo", logo);
            }
                

            const response = await this.api.put<Group>(`/groups/${data.id}`, formData);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update Group');
        }
    }

    async deleteGroup(data: Group): Promise<number> {
        try {
            await this.api.delete<any>(`/groups/${data.id}`);
            return data.id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete group');
        }
    }

    async searchGroups(offset: number, limit: number, searchStr: string): Promise<PaginatedResponse<Group>> {
        const url = `/groups/${searchStr}?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<PaginatedResponse<Group>>(url);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch groups: ${error.message}`);
        }
    }

    /*
        Model- UserGroup: CRUD Operations/Apis for user_groups
    */

    async bulkCreateUserGroupMapping(groupId: number, file: Blob): Promise<BulkUserGroupMappingResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('group_id', groupId.toString());
            const response = await this.api.post<BulkUserGroupMappingResponse>(`/user-groups/bulk`, formData);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create user group mapping');
        }
    }

    async addUserToGroup(data: any): Promise<void> {
        try {
            await this.api.post(`/user-groups`, data);
        } catch (error) {
            console.error(error)
            throw new Error('Failed to add user to group');
        }
    }

    async removeGroupUsers(groupId: number, userIds: number[]): Promise<void> {
        try {
            await this.api.delete(`/user-groups`, { data: { user_ids: userIds, group_id: groupId } });
        } catch (error) {
            console.error(error)
            throw new Error('Failed to remove users from group');
        }
    }
    /*
        Model- Pond: CRUD Operations/Apis for ponds
    */

    async getPonds(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<Pond>> {
        const url = `/ponds/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Pond>>(url, { filters: filters });
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
            const response = await this.api.post<Pond>(`/ponds/`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Pond');
        }
    }

    async updatePond(data: Pond): Promise<Pond> {
        try {
            const response = await this.api.put<Pond>(`/ponds/${data.id}`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update Pond');
        }
    }

    async deletePond(data: Pond): Promise<number> {
        try {
            await this.api.delete<any>(`/ponds/${data.id}`);
            return data.id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete Pond');
        }
    }

    /*
        Model- PondWaterLevelUpdate - Crud operations for water level updates
    */

    async getPondWaterLevelUpdates(pondId: number, offset: number, limit: number): Promise<PaginatedResponse<PondWaterLevelUpdate>> {
        try {
            let response = await this.api.get<PaginatedResponse<PondWaterLevelUpdate>>(`/ponds/waterlevel/${pondId}?offset=${offset}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to get pond history');
        }
    }

    async addPondWaterLevelUpdate(pondId: number, levelFt: number, userId: number, file?: Blob): Promise<PondWaterLevelUpdate> {
        try {
            const formData = new FormData();
            if (file) {
                formData.append("files", file);
            }
            formData.append('pond_id', pondId.toString());
            formData.append('level_ft', levelFt.toString());
            formData.append('user_id', userId.toString());
            const result = await this.api.post<PondWaterLevelUpdate>(`/ponds/waterlevel`, formData);
            return result.data;
        } catch (error) {
            throw new Error('Failed to update Pond');
        }
    }

    async updatePondWaterLevelUpdate(data: PondWaterLevelUpdate, file?: Blob): Promise<PondWaterLevelUpdate> {
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
        try {
            const response = await this.api.put<PondWaterLevelUpdate>(`/ponds/waterlevel/${data.id}`, formData);
            return response.data;
        } catch (error) {
            throw new Error('Failed to update pond water level update');
        }
    }

    async deletePondWaterLevelUpdate(data: PondWaterLevelUpdate): Promise<number> {
        try {
            await this.api.delete<any>(`/ponds/waterlevel/${data.id}`);
            return data.id;
        } catch (error) {
            throw new Error('Failed to delete pond water level update');
        }
    }

    /*
        Model- User: CRUD Operations/Apis for users
    */

    async getUsers(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<User>> {
        const url = `/users/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<User>>(url, { filters: filters });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    async searchUsers(searchStr: string): Promise<User[]> {
        const url = `/users/${searchStr}`;
        try {
            const response = await this.api.get<User[]>(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    async createUser(data: User): Promise<User> {
        try {
            const response = await this.api.post<User>(`/users/`, data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create User');
        }
    }

    async updateUser(data: User): Promise<User> {
        try {
            const response = await this.api.put<User>(`/users/${data.id}`, data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update User');
        }
    }

    async deleteUser(data: User): Promise<number> {
        try {
            await this.api.delete<any>(`/users/${data.id}`);
            return data.id;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to delete User');
        }
    }

    async createUsersBulk(data: Blob): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('file', data);
            await this.api.post<any>(`/users/bulk`, formData);
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
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

    async getTrees(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<Tree>> {
        const url = `/trees/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Tree>>(url, { filters: filters });
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
            formData.append('plant_type_id', data.plant_type_id.toString());
            formData.append('plot_id', data.plot_id.toString());
            if (data.location && data.location.coordinates && data.location.coordinates.length === 2) {
                formData.append('lat', data.location.coordinates[0].toString());
                formData.append('lng', data.location.coordinates[1].toString());
            }
            formData.append('mapped_to', data.mapped_to_user.toString());
            const response = await this.api.post<Tree>(`/trees/`, formData);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Tree');
        }
    }

    async updateTree(data: Tree, file?: Blob): Promise<Tree> {
        try {
            const formData = new FormData();

            if (file) {
                formData.append("files", file);
            }
            Object.entries(data).forEach(([key, value]) => {
                if (key != 'image' && value != null) {
                    const strValue = value as string
                    formData.append(key, strValue);
                }
            });
            const response = await this.api.put<Tree>(`/trees/${data.id}`, formData);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to update Tree');
        }
    }

    async deleteTree(data: Tree): Promise<number> {
        try {
            await this.api.delete<any>(`/trees/${data.id}`);
            return data.id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete Tree');
        }
    }

    async createTreeBulk(data: Blob): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('csvFile', data, 'trees_data.csv');
            await this.api.post<any>(`/trees/bulk`,);
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async mapTrees(request: MapTreesUsingSaplingIdsRequest): Promise<void> {
        try {
            await this.api.post<any>(`/mapping/map`, request);
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async mapTreesForPlot(request: MapTreesUsingPlotIdRequest): Promise<void> {
        try {
            await this.api.post<any>(`/mapping/map-plot-trees`, request);
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async removeTreeMappings(saplingIds: string[]): Promise<void> {
        try {
            await this.api.post<any>(`/mapping/unmap`, { sapling_ids: saplingIds });
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async getMappedTrees(email: string): Promise<void> {
        try {
            await this.api.post<any>(`/mapping/${email}`);
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async getUserTreeCount(offset: number, limit: number, filters?: any): Promise<UserTreeCountPaginationResponse> {
        let url = `/mapping/count/usertreescount?offset=${offset}&limit=${limit}`
        try {
            let result = await this.api.post<UserTreeCountPaginationResponse>(url, { filters: filters });
            return result.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Trees in bulk');
        }
    }

    async changeTreesPlot(treeIds: number[], plotId: number): Promise<void> {
        let url = `/trees/change-plot`
        try {
            await this.api.post<void>(url, { tree_ids: treeIds, plot_id: plotId });
        } catch (error: any) {
            if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            }
            throw new Error('Failed change trees plot');
        }
    }

    async getAssignedTrees(userId: number): Promise<Tree[]> {
        let url = `/trees/assigned/${userId}`;
        try {
            let result = await this.api.get<Tree[]>(url);
            return result.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to get assigned trees');
        }
    }

    async getGiftAbleTrees(offset: number, limit: number, filters: any[]): Promise<PaginatedResponse<Tree>> {
        let url = `/trees/get-giftable?offset=${offset}&limit=${limit}`;
        try {
            let result = await this.api.post<PaginatedResponse<Tree>>(url, { filters });
            return result.data;
        } catch (error: any) {
            if (error.response?.data?.message) throw new Error(error.response.data.message);
            throw new Error('Failed to get giftable trees');
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
        } catch (error: any) {
            console.error(error)
            throw new Error(error.message);
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

    async assignUserTrees(data: FormData): Promise<void> {
        try {
            await this.api.post<void>(`/profile/usertreereg/multi`, data);
        } catch (error) {
            console.error(error)
            throw new Error('Failed unassign user trees.');
        }
    }

    /*
        Model- Site: CRUD Operations/Apis for sites
    */

    async getSites(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<Site>> {
        const url = `/sites/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Site>>(url, { filters: filters });
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch sites: ${error.message}`);
        }
    }

    async createSite(data: Site, file?: Blob): Promise<Site> {
        try {

            const formData = new FormData();
            if (file) {
                formData.append("file", file);
            }
            Object.entries(data).forEach(([key, value]) => {
                if (value === null || value === "") return;
                if (key !== 'google_earth_link' && key !== 'tags') {
                    const strValue = value as string
                    formData.append(key, strValue);
                }
                if (key === 'tags') {
                    formData.append(key, JSON.stringify(value));
                }
            });

            const response = await this.api.post<Site>(`/sites/`, formData);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Site');
        }
    }

    async updateSite(data: Site, file?: Blob): Promise<Site> {
        try {

            const formData = new FormData();
            if (file) {
                formData.append("file", file);
            }
            Object.entries(data).forEach(([key, value]) => {
                if (value === null || value === "") return;
                if (key !== 'google_earth_link' && key !== 'tags') {
                    const strValue = value as string
                    formData.append(key, strValue);
                }
                if (key === 'tags') {
                    formData.append(key, JSON.stringify(value));
                }
            });

            const response = await this.api.put<Site>(`/sites/${data.id}`, formData);
            return response.data;
        } catch (error: any) {
            console.error(error)
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update Site');
        }
    }

    async deleteSite(data: Site): Promise<number> {
        try {
            await this.api.delete<any>(`/sites/${data.id}`);
            return data.id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete Site');
        }
    }

    async syncSitesDataFromNotion(): Promise<void> {
        await this.api.post<void>(`/sites/sync-sites`);
        return ;
    }

    async getSitesStats(offset: number = 0, limit: number = -1, filters?: any, orderBy?: { column: string, order: 'ASC' | 'DESC' }[]): Promise<PaginatedResponse<any>> {
        try {
            const response = await this.api.post<PaginatedResponse<any>>(`/sites/stats?offset=${offset}&limit=${limit}`, { filters: filters, order_by: orderBy });
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch Sites stats');
        }
    }

    async getTreesCountForDistricts(offset: number = 0, limit: number = 10, filters?: any, orderBy?: { column: string, order: 'ASC' | 'DESC' }[]): Promise<PaginatedResponse<any>> {
        try {
            const response = await this.api.post<PaginatedResponse<any>>(`/sites/stats/district?offset=${offset}&limit=${limit}`, { filters: filters, order_by: orderBy });
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch Sites stats');
        }
    }

    async getTreesCountForTalukas(offset: number = 0, limit: number = 10, filters?: any, orderBy?: { column: string, order: 'ASC' | 'DESC' }[]): Promise<PaginatedResponse<any>> {
        try {
            const response = await this.api.post<PaginatedResponse<any>>(`/sites/stats/taluka?offset=${offset}&limit=${limit}`, { filters: filters, order_by: orderBy });
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch Sites stats');
        }
    }

    async getTreesCountForVillages(offset: number = 0, limit: number = 10, filters?: any, orderBy?: { column: string, order: 'ASC' | 'DESC' }[]): Promise<PaginatedResponse<any>> {
        try {
            const response = await this.api.post<PaginatedResponse<any>>(`/sites/stats/village?offset=${offset}&limit=${limit}`, { filters: filters, order_by: orderBy });
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch Sites stats');
        }
    }

    async getTreesCountForLandTypes(offset: number = 0, limit: number = 10, filters?: any, orderBy?: { column: string, order: 'ASC' | 'DESC' }[]): Promise<PaginatedResponse<any>> {
        try {
            const response = await this.api.post<PaginatedResponse<any>>(`/sites/stats/land_type?offset=${offset}&limit=${limit}`, { filters: filters, order_by: orderBy });
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch Sites stats');
        }
    }

    async getTreesCountForPlotCategories(filters?: any): Promise<PaginatedResponse<any>> {
        try {
            const response = await this.api.post<PaginatedResponse<any>>(`/sites/stats/category?offset=0&limit=10`, { filters });
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch Site type stats');
        }
    }

    async getDistricts(): Promise<any> {
        try {
            const response = await this.api.get<any>(`/sites/districts`);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch Sites districts');
        }
    }

    async getTreeCountsForTags(offset: number = 0, limit: number = 10, filters?: any[], orderBy?: { column: string, order: 'ASC' | 'DESC' }[]): Promise<any> {
        try {
            const response = await this.api.post<any>(`/sites/tags?offset=${offset}&limit=${limit}`, { filters, order_by: orderBy });
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch tree counts for tags');
        }
    }

    async getTreeCountForCorporate(groupId: number, orderBy?: { column: string, order: 'ASC' | 'DESC' }[]): Promise<any> {
        try {
            const response = await this.api.get<any>(`/sites/corporate/${groupId}`);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to fetch tree counts for corporate');
        }
    }


    /*
       Model- Donation: CRUD Operations/Apis for Donations
   */

    async getDonations(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<Donation>> {
        const url = `/donations/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Donation>>(url, { filters: filters });
            console.log("Response in api client: ", response);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch donations: ${error.message}`);
        }
    }


    async createDonation(data: Donation): Promise<Donation> {
        try {
            const response = await this.api.post<Donation>(`/donations`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create Donation');
        }
    }


    async updateDonation(data: Donation): Promise<Donation> {
        try {
            const response = await this.api.put<Donation>(`/donations/${data.id}`, data);
            return response.data;
        } catch (error: any) {
            console.error(error)
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update donation');
        }
    }

    async deleteDonation(data: Donation): Promise<number> {
        try {
            await this.api.delete<any>(`/donations/${data.id}`);
            return data.id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete Donation');
        }
    }

    async assignTreesToDonation(donationId: number): Promise<boolean> {
        try {
            const response = await this.api.post<void>(`/profile/assignbulk/${donationId}`);
            return response.status === 200;
        } catch (error: any) {
            console.error(error)
            throw new Error(error?.response?.data?.message || 'Failed to assign trees to donation users');
        }
    }

    async createWorkOrderForDonation(donationId: number): Promise<boolean> {
        try {
            const response = await this.api.post<void>(`/donations/work-order/${donationId}`);
            return response.status === 200;
        } catch (error: any) {
            console.error(error)
            throw new Error(error?.response?.data?.message || 'Failed to assign trees to donation users');
        }
    }

    /*
          Model- Event : CRUD Operations/Apis for Event
      */

    async getEvents(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<Event>> {
        const url = `/events/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Event>>(url, { filters: filters });
            console.log("Response in api client: ", response);
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch events: ${error.message}`);
        }
    }


    /*
       Model- Visit: CRUD Operations/Apis for visits
   */
    async getVisits(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<Visit>> {
        const url = `/visits/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Visit>>(url, { filters: filters });
            return response.data;
        } catch (error: any) {
            console.error(error)
            throw new Error(`Failed to fetch Visits: ${error.message}`);
        }
    }

    async createVisit(data: Visit): Promise<Visit> {
        try {
            const response = await this.api.post<Visit>(`/visits/`, data);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create visit');
        }
    }

    async updateVisit(data: Visit): Promise<Visit> {
        try {
            const response = await this.api.put<Visit>(`/visits/${data.id}`, data);
            return response.data;
        } catch (error: any) {
            console.error(error)
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update visit');
        }
    }

    async deleteVisit(data: Visit): Promise<number> {
        try {
            await this.api.delete<any>(`/visits/${data.id}`);
            return data.id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete visit');
        }
    }
    /*
         Model- VisitUser: CRUD Operations/Apis for visit-user
     */

    async getVisitUsers(visitId: number, offset: number, limit: number): Promise<PaginatedResponse<User>> {
        const url = `/visit-users?visit_id=${visitId}&offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<PaginatedResponse<User>>(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch visit users: ${error.message}`);
        }
    }

    async addUserToVisit(data: any): Promise<void> {
        try {
            await this.api.post(`/visit-users`, data);
        } catch (error) {
            console.error(error)
            throw new Error('Failed to add user to visit');
        }
    }

    async removeVisitUsers(visitId: number, userIds: number[]): Promise<void> {
        try {
            await this.api.delete(`/visit-users`, { data: { user_ids: userIds, visit_id: visitId } });
        } catch (error) {
            console.error(error)
            throw new Error('Failed to remove users from visit');
        }
    }

    async bulkCreateVisitUsersMapping(visitId: number, file: Blob): Promise<BulkVisitUsersMappingResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('visit_id', visitId.toString());
            const response = await this.api.post<BulkVisitUsersMappingResponse>(`/visit-users/bulk`, formData);
            return response.data;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to create visit user mapping');
        }
    }

    /* 
        Tree Images / Snapshots
    */

    async getTreeImages(saplingId: string, offset: number, limit: number): Promise<PaginatedResponse<TreeImage>> {
        const url = `/tree-snapshots/${saplingId}?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<PaginatedResponse<TreeImage>>(url);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch tree images: ${error.message}`);
        }
    }

    /*
        Gift Cards
    */

    async getGiftCards(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<GiftCard>> {
        const url = `/gift-cards/requests/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<GiftCard>>(url, { filters: filters });
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to fetch gift cards: ${error.message}`);
        }
    }


    async createGiftCard(request_id: string, no_of_cards: number, user_id: number, group_id?: number, logo?: File, messages?: any, file?: File): Promise<GiftCard> {
        try {
            const formData = new FormData();
            formData.append('request_id', request_id);
            formData.append('no_of_cards', no_of_cards.toString());
            formData.append('user_id', user_id.toString());
            if (messages) {
                formData.append('primary_message', messages.primaryMessage);
                formData.append('secondary_message', messages.secondaryMessage);
                formData.append('event_name', messages.eventName);
                formData.append('planted_by', messages.plantedBy);
                formData.append('logo_message', messages.logoMessage);
            }
            if (group_id) formData.append('group_id', group_id.toString());
            if (logo) formData.append('logo', logo, logo.name);
            if (file) formData.append('csv_file', file, file.name);

            const response = await this.api.post<GiftCard>(`/gift-cards/requests`, formData);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create gift card');
        }
    }

    async updateGiftCard(request: GiftCard, no_of_cards: number, user_id: number, group_id?: number, logo?: File, messages?: any, file?: File): Promise<GiftCard> {
        try {
            const formData = new FormData();
            for (const [key, value] of Object.entries(request)) {
                if (value) formData.append(key, value.toString());
            }

            if (formData.has('no_of_cards')) formData.set('no_of_cards', no_of_cards.toString());
            else formData.append('no_of_cards', no_of_cards.toString());

            if (formData.has('user_id')) formData.set('user_id', user_id.toString());
            else formData.append('user_id', user_id.toString());

            if (group_id && formData.has('group_id')) formData.set('group_id', group_id.toString());
            else if (group_id) formData.append('group_id', group_id.toString());

            if (logo && formData.has('logo')) formData.set('logo', logo, logo.name);
            else if (logo) formData.append('logo', logo, logo.name);

            if (file && formData.has('csv_file')) formData.set('csv_file', file, file.name);
            else if (file) formData.append('csv_file', file, file.name);

            if (messages) {
                if (formData.has('primary_message')) formData.set('primary_message', messages.primaryMessage);
                else formData.append('primary_message', messages.primaryMessage);

                if (formData.has('secondary_message')) formData.set('secondary_message', messages.secondaryMessage);
                else formData.append('secondary_message', messages.secondaryMessage);

                if (messages.eventName && formData.has('event_name')) formData.set('event_name', messages.eventName);
                else if (messages.eventName) formData.append('event_name', messages.eventName);

                if (formData.has('planted_by')) formData.set('planted_by', messages.plantedBy);
                else formData.append('planted_by', messages.plantedBy);

                if (formData.has('logo_message')) formData.set('logo_message', messages.logoMessage);
                else formData.append('logo_message', messages.logoMessage);
            }

            const response = await this.api.put<GiftCard>(`/gift-cards/requests/${request.id}`, formData);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create gift card');
        }
    }

    async deleteGiftCardRequest(gift_card_request_id: number): Promise<void> {
        await this.api.delete<void>(`/gift-cards/requests/${gift_card_request_id}`);
    }

    async cloneGiftCardRequest(gift_card_request_id: number, request_id: string): Promise<GiftCard> {
        try {
            const response = await this.api.post<GiftCard>(`/gift-cards/requests/clone`, { gift_card_request_id, request_id });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to clone gift card request');
        }
    }

    async createGiftCardUsers(gift_card_request_id: number, users: any[]): Promise<GiftCard> {
        try {
            const response =await this.api.post<GiftCard>(`/gift-cards`, { gift_card_request_id, users });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create gift card');
        }
    }

    async createGiftCardPlots(gift_card_request_id: number, plot_ids: number[]): Promise<void> {
        try {
            await this.api.post<any>(`/gift-cards/plots`, { gift_card_request_id, plot_ids });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create gift card');
        }
    }

    async bookGiftCards(gift_card_request_id: number, gift_card_trees?: any[]): Promise<void> {
        try {
            await this.api.post<any>(`/gift-cards/book`, { gift_card_request_id, gift_card_trees });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to book gift cards');
        }
    }

    async getBookedGiftCards(gift_card_request_id: number, offset: number = 0, limit: number = 10): Promise<PaginatedResponse<GiftCardUser>> {
        try {
            const response = await this.api.get<PaginatedResponse<GiftCardUser>>(`/gift-cards/${gift_card_request_id}?offset=${offset}&limit=${limit}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to get gift cards');
        }
    }

    async generateCardTemplate(request_id: string, primary_message: string, secondary_message: string, logo_message: string, logo?: string): Promise<{ presentation_id: string, slide_id: string }> {
        try {
            const resp = await this.api.post<any>(`/gift-cards/generate-template`, { request_id, primary_message, secondary_message, logo_message, logo });
            return resp.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to generate gift cards');
        }
    }

    async updateGiftCardTemplate(slide_id: string, primary_message: string, secondary_message: string, logo_message: string, logo?: string): Promise<void> {
        try {
            await this.api.post<any>(`/gift-cards/update-template`, { slide_id, primary_message, secondary_message, logo_message, logo });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to generate gift cards');
        }
    }

    async redeemGiftCardTemplate(gift_card_user_id: number, sapling_id: string, tree_id: number, user: User): Promise<GiftCardUser> {
        try {
            const resp = await this.api.post<GiftCardUser>(`/gift-cards/card/redeem`, { gift_card_user_id, sapling_id, tree_id, user });
            return resp.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to generate gift cards');
        }
    }

    async autoAssignTrees(gift_card_request_id: number): Promise<void> {
        try {
            const resp = await this.api.post<void>(`/gift-cards/auto-assign`, { gift_card_request_id });
            return resp.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to generate gift cards');
        }
    }

    async generateGiftCardTemplates(gift_card_request_id: number): Promise<void> {
        try {
            const resp = await this.api.get<any>(`/gift-cards/generate/${gift_card_request_id}`);
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to generate gift cards');
        }
    }

    async downloadGiftCards(gift_card_request_id: number, type: 'pdf' | 'ppt' | 'zip'): Promise<any> {
        try {
            const resp = await this.api.get<any>(`/gift-cards/download/${gift_card_request_id}?downloadType=${type}`, {
                responseType: 'blob',
            });

            return resp.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to generate gift cards');
        }
    }

    async sendEmailToGiftRequestUsers(gift_card_request_id: number, attach_card: boolean, cc_mails?: string[], test_mails?: string[]): Promise<void> {
        try {
            const resp = await this.api.post<void>(`/gift-cards/email`, { attach_card, cc_mails, test_mails, gift_card_request_id });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to send emails to users');
        }
    }

    async updateAlbumImagesForGiftRequest(gift_card_request_id: number, album_id: number): Promise<void> {
        try {
            await this.api.post<void>(`/gift-cards/update-album/`, { gift_card_request_id, album_id});
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update album images for gift request!');
        }
    }

    async updateGiftRequestUserDetails(users: GiftCard[]): Promise<void> {
        try {
            await this.api.post<void>(`/gift-cards/update-users/`, { users });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update gift request users!');
        }
    }

    // Utils
    async getSignedUrlForRequestId(gift_card_request_id: string, filename: string): Promise<string> {
        try {
            const response = await this.api.get<{ url: string }>(`/utils/s3/${gift_card_request_id}?filename=${filename}`);
            return response.data.url;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to generate gift cards');
        }
    }

    async scrapImagesFromWebPage(request_id: string, url: string): Promise<string[]> {
        try {
            const response = await this.api.post<{ urls: string[] }>(`/utils/scrap`, { url, request_id });
            return response.data.urls;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to get images');
        }
    }

    async getImagesForRequestId(request_id: string): Promise<string[]> {
        try {
            const response = await this.api.get<{ urls: string[] }>(`/utils/s3keys/${request_id}`);
            return response.data.urls;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to get images');
        }
    }

    /*
        Albums
    */

    async createAlbum(albumName: string, userName: string, email: string, images: File[]) {
        const formData = new FormData();
        formData.append("album_name", albumName);
        formData.append("name", userName);
        const imagesNames: string[] = [];
        for (const image of images) {
            formData.append("images", image);
            imagesNames.push(image.name);
        }
        formData.append("file_names", imagesNames.join(','));

        try {
            const response = await this.api.post<{ album: any }>(`/albums/${email}`, formData);
            return response.data.album;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create album');
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
