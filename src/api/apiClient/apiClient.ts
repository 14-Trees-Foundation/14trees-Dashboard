import axios, { AxiosInstance } from 'axios';
import { PlantType } from '../../types/plantType';
import { Plot } from '../../types/plot';
import { BulkUserGroupMappingResponse, Group } from '../../types/Group';
import { Pond, PondWaterLevelUpdate } from '../../types/pond';
import { User } from '../../types/user';
import { Site } from '../../types/site';
import { Donation, DonationTree, DonationUser } from '../../types/donation';
import { BirthdayResponse } from '../../types/notification';
import { OnsiteStaff } from '../../types/onSiteStaff';
import { MapTreesUsingPlotIdRequest, MapTreesUsingSaplingIdsRequest, Tree } from '../../types/tree';
import { UserTree, UserTreeCountPaginationResponse } from '../../types/userTree';
import { PaginatedResponse } from '../../types/pagination';
import { Event, EventMessage } from '../../types/event';
import { Visit, BulkVisitUsersMappingResponse } from '../../types/visits';
import { TreeImage } from '../../types/tree_snapshots';
import { GiftCard, GiftCardUser, GiftRequestUser } from '../../types/gift_card';
import { Tag } from '../../types/tag';
import { EmailTemplate } from '../../types/email_template';
import { Payment, PaymentHistory } from '../../types/payment';
import { Order } from '../../types/common';
import { View } from '../../types/viewPermission';
import { GiftRedeemTransaction } from '../../types/gift_redeem_transaction';


class ApiClient {
    private api: AxiosInstance;
    private token: string | null;

    constructor() {
        const baseURL = import.meta.env.VITE_APP_BASE_URL;
        this.api = axios.create({
            baseURL: baseURL,
        });
        const token = localStorage.getItem("token")
        this.token = token ? JSON.parse(token) : null;
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

    async getPlantTypeTags(): Promise<PaginatedResponse<string>> {
        try {
            const resp = await this.api.get<PaginatedResponse<string>>(`/plant-types/tags/get`);
            return resp.data;
        } catch (error: any) {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error('Failed to get plant type tags!');
        }
    }

    async getTreeCountsForPlantTypes(offset: number, limit: number, filters?: any[], orderBy?: any[]): Promise<PaginatedResponse<any>> {
        try {
            const resp = await this.api.post<PaginatedResponse<any>>(`/plant-types/states`, { offset, limit, filters, order_by: orderBy });
            return resp.data;
        } catch (error: any) {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error('Failed to get plant type states!');
        }
    }

    async getPlantTypeStateForPlots(offset: number, limit: number, filters?: any[], orderBy?: any[]): Promise<PaginatedResponse<any>> {
        try {
            const resp = await this.api.post<PaginatedResponse<any>>(`/plant-types/plot-states`, { offset, limit, filters, order_by: orderBy });
            return resp.data;
        } catch (error: any) {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error('Failed to get plant type states!');
        }
    }

    async addPlantTypeTemplate(plant_type: string, template_id: string): Promise<any> {
        try {
            const resp = await this.api.post<any>(`/plant-types/templates/`, { plant_type, template_id });
            return resp.data;
        } catch (error: any) {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error('Failed to add plant type template!');
        }
    }

    async getPlantTypeStatsForCorporate(offset: number, limit: number, group_id?: number, filters?: any[]): Promise<PaginatedResponse<any>> {
        const url = `/plant-types/corporate-stats?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<any>>(url, { group_id, filters: filters });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch CSR plant types analytics: ${error.message}`);
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

    async getPlotStatsForCorporate(offset: number, limit: number, group_id?: number, filters?: any[], orderBy?: any[]): Promise<PaginatedResponse<any>> {
        const url = `/plots/corporate-stats?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<any>>(url, { group_id, filters: filters, order_by: orderBy });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch CSR plot analytics: ${error.message}`);
        }

    }

    async getCSRAnalytics(groupId?: number): Promise<any> {
        const url = `/plots/corporate-analytics?group_id=${groupId}`;
        try {
            const response = await this.api.get<any>(url);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch CSR analytics: ${error.message}`);
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

    async getGroups(offset: number, limit: number, filters?: any[], orderBy?: Order[]): Promise<PaginatedResponse<Group>> {
        const url = `/groups/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Group>>(url, {
                filters: filters,
                order_by: orderBy
            });
            return response.data;
        } catch (error: any) {
            console.error("Error fetching groups:", error);
            // Return empty results instead of throwing to prevent breaking the UI
            return {
                offset: offset,
                total: 0,
                results: []
            };
        }
    }

    async createGroup(data: Group, logo?: File): Promise<Group> {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("type", data.type);
            formData.append("description", data.description);
            if (data.address) formData.append("address", data.address);
            if (data.logo_url) formData.append("logo_url", data.logo_url);
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
            if (data.address) formData.append("address", data.address);
            if (data.logo_url) formData.append("logo_url", data.logo_url);
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

    async mergeGroups(primary_group: number, secondary_group: number, delete_secondary: boolean): Promise<void> {
        try {
            await this.api.post<any>(`/groups/merge`, { primary_group, secondary_group, delete_secondary });
        } catch (error: any) {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to merge groups!');
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

    async combineUsers(primary_user: number, secondary_user: number, delete_secondary: boolean): Promise<void> {
        try {
            await this.api.post<any>(`/users/combine`, { primary_user, secondary_user, delete_secondary });
        } catch (error: any) {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to combine users!');
        }
    }

    async checkGroupBirthdays(groupId: number): Promise<BirthdayResponse> {
        try {
            const response = await this.api.get(`/users/birthday/notifications?group_id=${groupId}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update User');
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

    async getTrees(offset: number, limit: number, filters?: any[], order_by?: Order[]): Promise<PaginatedResponse<Tree>> {
        const url = `/trees/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Tree>>(url, { filters: filters, order_by });
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
            if (data.tags && data.tags.length > 0) {
                data.tags.forEach(tag => { formData.append("tags", tag) });
            }
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
                if (key === "tags" && value) {
                    (value as any)?.forEach((tag: string) => { formData.append("tags", tag) });
                } else if (key === "location") {

                } else if (key != 'image' && key !== "location") {
                    const strValue = value as any
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

    async getTreeTags(): Promise<PaginatedResponse<string>> {
        try {
            const resp = await this.api.get<PaginatedResponse<string>>(`/trees/tags`,);
            return resp.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error('Failed to fetch tree tags');
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
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to unmap trees');
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

    async getMappedTreesForTheUser(userId: number, offset: number, limit: number): Promise<PaginatedResponse<Tree>> {
        const url = `/trees/mapped/${userId}?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<PaginatedResponse<Tree>>(url);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error(`Failed to fetch trees!`);
        }
    }

    async getMappedTreesForGroup(groupId: number, offset: number, limit: number): Promise<PaginatedResponse<Tree>> {
        const url = `/trees/mapped/group/${groupId}?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.get<PaginatedResponse<Tree>>(url);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error(`Failed to fetch trees!`);
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

    async getGiftAbleTrees(offset: number, limit: number, filters: any[], include_no_giftable: boolean = false, include_all_habits: boolean = false): Promise<PaginatedResponse<Tree>> {
        let url = `/trees/get-giftable?offset=${offset}&limit=${limit}`;
        try {
            let result = await this.api.post<PaginatedResponse<Tree>>(url, { filters, include_no_giftable, include_all_habits });
            return result.data;
        } catch (error: any) {
            if (error.response?.data?.message) throw new Error(error.response.data.message);
            throw new Error('Failed to get giftable trees');
        }
    }

    async getTreesCountForUser(userId: number) {
        let url = `/trees/count/user/${userId}`;
        try {
            let result = await this.api.get<any>(url);
            return result.data;
        } catch (error: any) {
            if (error.response?.data?.message) throw new Error(error.response.data.message);
            throw new Error('Failed to get trees count for user');
        }
    }

    async getCSRTreesLoggedByYear(groupId?: number): Promise<any[]> {
        const url = `/trees/corporate-stats/tree-logged?group_id=${groupId}`;
        try {
            const response = await this.api.get<any[]>(url);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch CSR analytics: ${error.message}`);
        }

    }

    async getMappedGiftTrees(offset: number, limit: number, type: 'group' | 'user', id: number, filters?: any[]): Promise<PaginatedResponse<Tree>> {
        const url = `/trees/mapped-gift/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Tree>>(url, { [type === 'group' ? 'group_id' : 'user_id']: id, filters });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch reserved gift trees: ${error.message}`);
        }
    }

    async getMappedGiftTreesAnalytics(type: 'group' | 'user', id: number): Promise<any> {
        const url = `/trees/mapped-gift/analytics`;
        try {
            const response = await this.api.post<any>(url, { [type === 'group' ? 'group_id' : 'user_id']: id });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch reserved gift trees: ${error.message}`);
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
        return;
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

    async getSiteStatsForCorporate(offset: number, limit: number, group_id?: number, filters?: any[], orderBy?: any[]): Promise<PaginatedResponse<any>> {
        const url = `/sites/corporate-stats?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<any>>(url, { group_id, filters: filters, order_by: orderBy });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error(`Failed to fetch CSR site analytics: ${error.message}`);
        }

    }


    /*
       Model- Donation: CRUD Operations/Apis for Donations
   */

    async getDonations(offset: number, limit: number, filters?: any[], order_by?: Order[]): Promise<PaginatedResponse<Donation>> {
        const url = `/donations/requests/get?offset=${offset}&limit=${limit}`; // No need to add query params since it's a POST request

        try {
            const response = await this.api.post<PaginatedResponse<Donation>>(url, {
                filters: filters || [],
                order_by: order_by || []
            });

            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error("Failed to fetch donations");
        }
    }

    async getDonationTags(): Promise<PaginatedResponse<string>> {
        const url = `/donations/tags`;
        try {
            const response = await this.api.get<PaginatedResponse<string>>(url);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to fetch donation tags: ${error.message}`);
        }
    }

    async createDonation(request_id: string, created_by: number, user_id: number, pledged: number | null, pledged_area: number | null, category: string, grove: string | null, preference: string, event_name: string, alternate_email: string, users: any[], payment_id?: number, group_id?: number, logo?: string | null): Promise<Donation> {
        try {
            const response = await this.api.post<Donation>(`/donations`, { request_id, created_by, user_id, pledged, pledged_area, category, group_id, logo, grove, payment_id, users, preference, event_name, alternate_email });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create Donation');
        }
    }


    async updateDonation(donation: Donation, users: any): Promise<Donation> {
        try {
            // Extract the fields that we want to update
            const updateFields = [
                'user_id',
                'payment_id',
                'category',
                'grove',
                'grove_type_other',
                'trees_count',
                'contribution_options',
                'names_for_plantation',
                'comments',
                'pledged',
                'pledged_area',
                'group_id',
                'preference',
                'event_name',
                'alternate_email',
                'tags'
            ];

            // Format request to match backend expectations
            const payload = {
                updateFields: updateFields,
                data: donation,
                users: users
            };

            console.log("Sending donation update payload:", payload);
            const response = await this.api.put<Donation>(`/donations/requests/${donation.id}`, payload);
            return response.data;
        } catch (error: any) {
            console.error("Update donation error:", error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update donation');
        }
    }

    async updateDonationFeedback(request_id: string, feedback: string, source_info: string): Promise<void> {
        try {
            await this.api.post<void>(`/donations/update-feedback`, { request_id, feedback, source_info });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update donation');
        }
    }

    async deleteDonation(data: Donation): Promise<number> {
        try {
            await this.api.delete<any>(`/donations/requests/${data.id}`);
            return data.id;
        } catch (error) {
            console.error(error)
            throw new Error('Failed to delete Donation');
        }
    }

    async autoProcessDonation(donation_id: number): Promise<Donation> {
        try {
            const response = await this.api.post<Donation>(`/donations/requests/auto-process`, { donation_id });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to process donation');
        }
    }

    async pickDonation(donationId: number, userId: number): Promise<{ success: boolean }> {
        try {
            const response = await this.api.post<{ success: boolean }>(
                `/donations/${donationId}/process`,
                { userId }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to pick donation');
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

    async getDonationUsers(offset: number, limit: number, filters?: any[], order_by?: Order[]): Promise<PaginatedResponse<DonationUser>> {
        try {

            const response = await this.api.post<PaginatedResponse<DonationUser>>(
                `/donations/users/get?offset=${offset}&limit=${limit}`,
                { filters, order_by }
            );

            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to fetch recipient users for donation!');
        }
    }

    async reserveTreesForDonation(donation_id: number, tree_ids: number[], auto_reserve: boolean, plots: { plot_id: number, trees_count: number }[], diversify: boolean, book_all_habits: boolean = false) {
        try {
            const resp = await this.api.post<Donation>('/donations/trees/reserve', { donation_id, tree_ids, auto_reserve, plots, diversify, book_all_habits });
            return resp.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to reserve trees for donation!');
        }
    }

    async unreserveTreesForDonation(donation_id: number, tree_ids?: number[], unreserve_all: boolean = false): Promise<Donation> {
        const url = `/donations/trees/unreserve`;
        try {
            const response = await this.api.post<Donation>(url, { donation_id, tree_ids, unreserve_all });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to unreserve trees for donation');
        }
    }

    async mapAssignedTreesToDonation(donation_id: number, tree_ids: number[]) {
        try {
            const resp = await this.api.post<Donation>('/donations/trees/map', {
                donation_id,
                tree_ids
            });
            return resp.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to map trees to donation!');
        }
    }

    async unmapAssignedTreesFromDonation(donation_id: number, tree_ids: number[]) {
        try {
            const resp = await this.api.post<Donation>('/donations/trees/unmap', {
                donation_id,
                tree_ids
            });
            return resp.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to unmap trees from donation!');
        }
    }

    async getMappedTreesByDonation(donation_id: number, offset: number = 0, limit: number = 20, filters: any[] = [], orderBy: any[] = []) {
        try {
            const resp = await this.api.post<Tree[]>('donations/trees/getmapped', { donation_id, offset, limit, filters, orderBy });
            return resp.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to get mapped trees for donation!');
        }
    }

    async sendAckEmailToDonor(donation_id: number, test_mails: string[], cc_mails: string[]) {
        try {
            await this.api.post<void>(`/donations/emails/ack`, { donation_id, test_mails, cc_mails });
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to send acknowledgement email!');
        }
    }

    async sendEmailForDonation(donation_id: number, test_mails: string[], sponsor_cc_mails: string[] = [], recipient_cc_mails: string[] = [], assignee_cc_mails: string[] = [],
        event_type: string = 'default', email_sponsor: boolean = true, email_recipient: boolean = false, email_assignee: boolean = false) {
        try {
            await this.api.post<void>(`/donations/emails/send`, { donation_id, test_mails, sponsor_cc_mails, recipient_cc_mails, assignee_cc_mails, event_type, email_sponsor, email_recipient, email_assignee });
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to send email for donation');
        }
    }

    async updateDonationUser(data: any): Promise<any> {
        try {
            // Extract the donation ID
            let donationId = data.donation_id;
            if (!donationId) {
                throw new Error('Missing donation_id');
            }

            // Format the user data according to what the backend expects
            // The backend expects recipient/assignee IDs to be included if they exist
            const userPayload = {
                id: data.id,
                // Here we extract the fields the backend needs
                recipient: data.recipient, // Keep recipient ID if available
                assignee: data.assignee, // Keep assignee ID if available
                recipient_name: data.recipient_name,
                recipient_email: data.recipient_email,
                recipient_phone: data.recipient_phone || '',
                assignee_name: data.assignee_name,
                assignee_email: data.assignee_email,
                assignee_phone: data.assignee_phone || '',
                relation: data.relation || '',
                trees_count: data.trees_count || data.gifted_trees || 1,
                profile_image_url: data.profile_image_url || null
            };

            // Prepare the payload in the format expected by the backend
            const payload = {
                donation_id: donationId,
                user: userPayload
            };

            console.log('Updating donation user:', payload);

            // Use the PUT /donations/users endpoint that the backend expects
            const response = await this.api.put('/donations/users', payload);
            return response.data;
        } catch (error: any) {
            console.error('Error updating donation user:', error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update donation user');
        }
    }

    async createDonationUser(data: any): Promise<any> {
        try {
            // Extract the donation ID
            let donationId = data.donation_id;
            if (!donationId) {
                throw new Error('Missing donation_id');
            }

            // Format the user data according to what the backend expects
            const userPayload = {
                // No ID for new user
                recipient_name: data.recipient_name,
                recipient_email: data.recipient_email,
                recipient_phone: data.recipient_phone || '',
                assignee_name: data.assignee_name || data.recipient_name,
                assignee_email: data.assignee_email || data.recipient_email,
                assignee_phone: data.assignee_phone || data.recipient_phone || '',
                relation: data.relation || '',
                // Use trees_count as the primary field name for consistency
                trees_count: data.trees_count || data.gifted_trees || 1,
                profile_image_url: data.profile_image_url || null
            };

            // Prepare the payload in the format expected by the backend
            const payload = {
                donation_id: donationId,
                user: userPayload
            };

            console.log('Creating donation user:', payload);

            // Use the existing PUT /donations/users endpoint that also handles creation
            // The backend determines if it's a create or update based on whether there's an ID
            const response = await this.api.put('/donations/users', payload);
            return response.data;
        } catch (error: any) {
            console.error('Error creating donation user:', error);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create donation user');
        }
    }


    async getDonationTrees(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<DonationTree>> {
        const url = `/donations/trees/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<DonationTree>>(url, { filters: filters });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to get donation trees');
        }
    }


    async assignTreesToDonationUsers(donation_id: number, auto_assign: boolean, user_trees?: { du_id: number, tree_id: number }[]): Promise<Donation> {
        try {
            const response = await this.api.post<Donation>(`/donations/trees/assign`, { donation_id, auto_assign, user_trees });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to assign trees to donation users');
        }
    }

    async unassignDonationTrees(donation_id: number, unassign_all: boolean, tree_ids: number[]): Promise<Donation> {
        try {
            const response = await this.api.post<Donation>(`/donations/trees/unassign`, { donation_id, unassign_all, tree_ids });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to unassign trees from donation users');
        }
    }

    /*
        Model- Event : CRUD Operations/Apis for Event
    */

    async getEvents(offset: number, limit: number, filters?: any[]): Promise<PaginatedResponse<Event>> {
        const url = `/events/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<Event>>(url, { filters: filters });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error("Faield fetch events");
        }
    }

    async getEventMessages(event_link: string): Promise<EventMessage[]> {
        const url = `/events/messages/${event_link}`;
        try {
            const response = await this.api.get<EventMessage[]>(url);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error("Faield fetch event messages");
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

    async getGiftRequestTags(): Promise<PaginatedResponse<string>> {
        const url = `/gift-cards/requests/tags`;
        try {
            const response = await this.api.get<PaginatedResponse<string>>(url);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to fetch gift cards: ${error.message}`);
        }
    }

    async getGiftCards(offset: number, limit: number, filters?: any[], order_by?: Order[]): Promise<PaginatedResponse<GiftCard>> {
        const url = `/gift-cards/requests/get?offset=${offset}&limit=${limit}`;
        try {
            const response = await this.api.post<PaginatedResponse<GiftCard>>(url, { filters, order_by });
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to fetch gift cards: ${error.message}`);
        }
    }


    async createGiftCard(request_id: string, created_by: number, no_of_cards: number, user_id: number, sponsor_id: number | null, category: string, grove: string | null, requestType: string, giftedOn: string, group_id?: number, payment_id?: number, logo?: string, messages?: any, file?: File): Promise<GiftCard> {
        try {
            const formData = new FormData();
            formData.append('request_id', request_id);
            formData.append('no_of_cards', no_of_cards.toString());
            formData.append('created_by', created_by ? created_by.toString() : user_id.toString());
            formData.append('user_id', user_id.toString());
            formData.append('category', category);
            formData.append('gifted_on', giftedOn);
            formData.append('request_type', requestType);
            if (messages) {
                formData.append('primary_message', messages.primaryMessage);
                formData.append('secondary_message', messages.secondaryMessage);
                formData.append('event_name', messages.eventName);
                formData.append('event_type', messages.eventType);
                formData.append('planted_by', messages.plantedBy);
                formData.append('logo_message', messages.logoMessage);
            }
            if (grove) formData.append('grove', grove);
            if (group_id) formData.append('group_id', group_id.toString());
            if (sponsor_id) formData.append('sponsor_id', sponsor_id.toString());
            if (payment_id) formData.append('payment_id', payment_id.toString());
            if (logo) formData.append('logo_url', logo);
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

    async updateGiftCard(request: GiftCard, no_of_cards: number, user_id: number, sponsor_id: number | null, category: string, grove: string | null, requestType: string, giftedOn: string, group_id?: number, payment_id?: number, logo?: string, messages?: any, file?: File): Promise<GiftCard> {
        try {
            const formData = new FormData();
            for (const [key, value] of Object.entries(request)) {
                if (value) {
                    if (Array.isArray(value)) value.forEach(item => formData.append(key, item.toString()))
                    else formData.append(key, value.toString());
                }
            }

            if (formData.has('no_of_cards')) formData.set('no_of_cards', no_of_cards.toString());
            else formData.append('no_of_cards', no_of_cards.toString());

            if (formData.has('user_id')) formData.set('user_id', user_id.toString());
            else formData.append('user_id', user_id.toString());

            if (sponsor_id && formData.has('sponsor_id')) formData.set('sponsor_id', sponsor_id.toString());
            else if (sponsor_id) formData.append('sponsor_id', sponsor_id.toString());
            else formData.delete('sponsor_id')

            if (formData.has('category')) formData.set('category', category);
            else formData.append('category', category);

            if (grove && formData.has('grove')) formData.set('grove', grove);
            else if (grove) formData.append('grove', grove);

            if (giftedOn && formData.has('gifted_on')) formData.set('gifted_on', giftedOn);
            else if (giftedOn) formData.append('gifted_on', giftedOn);

            if (requestType && formData.has('request_type')) formData.set('request_type', requestType);
            else if (requestType) formData.append('request_type', requestType);

            if (group_id && formData.has('group_id')) formData.set('group_id', group_id.toString());
            else if (group_id) formData.append('group_id', group_id.toString());
            else formData.delete('group_id');

            if (payment_id && formData.has('payment_id')) formData.set('payment_id', payment_id.toString());
            else if (payment_id) formData.append('payment_id', payment_id.toString());

            if (logo && formData.has('logo_url')) formData.set('logo_url', logo);
            else if (logo) formData.append('logo_url', logo);

            if (file && formData.has('csv_file')) formData.set('csv_file', file, file.name);
            else if (file) formData.append('csv_file', file, file.name);

            if (messages) {
                if (formData.has('primary_message')) formData.set('primary_message', messages.primaryMessage);
                else formData.append('primary_message', messages.primaryMessage);

                if (formData.has('secondary_message')) formData.set('secondary_message', messages.secondaryMessage);
                else formData.append('secondary_message', messages.secondaryMessage);

                if (messages.eventName && formData.has('event_name')) formData.set('event_name', messages.eventName);
                else if (messages.eventName) formData.append('event_name', messages.eventName);
                else formData.delete('event_name')

                if (messages.eventType && formData.has('event_type')) formData.set('event_type', messages.eventType);
                else if (messages.eventType) formData.append('event_type', messages.eventType);

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

    async autoProcessGiftRequest(gift_request_id: number): Promise<GiftCard> {
        try {
            const response = await this.api.post<GiftCard>(`/gift-cards/requests/auto-process`, { gift_request_id });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to process gift request!');
        }
    }

    async pickGiftCardRequest(giftCardId: number, userId: number): Promise<{ success: boolean }> {
        try {
            const response = await this.api.post<{ success: boolean }>(
                `/gift-cards/${giftCardId}/process`,
                { userId }
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to request gift card');
        }
    }

    async getGiftRequestUsers(gift_card_request_id: number): Promise<GiftRequestUser[]> {
        try {
            const response = await this.api.get<GiftRequestUser[]>(`/gift-cards/users/${gift_card_request_id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to fetch recipient details!');
        }
    }

    async upsertGiftCardUsers(gift_card_request_id: number, users: any[]): Promise<GiftCard> {
        try {
            const response = await this.api.post<GiftCard>(`/gift-cards/users`, { gift_card_request_id, users });
            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to register recipient details!');
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

    async bookGiftCards(gift_card_request_id: number, gift_card_trees?: any[], book_non_giftable: boolean = false, diversify: boolean = false, book_all_habits: boolean = false): Promise<void> {
        try {
            await this.api.post<any>(`/gift-cards/book`, { gift_card_request_id, gift_card_trees, book_non_giftable, diversify, book_all_habits });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to book gift cards');
        }
    }

    async getBookedGiftTrees(gift_card_request_id: number, offset: number = 0, limit: number = 10): Promise<PaginatedResponse<GiftCardUser>> {
        try {
            const response = await this.api.get<PaginatedResponse<GiftCardUser>>(`/gift-cards/trees/${gift_card_request_id}?offset=${offset}&limit=${limit}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to get gift cards');
        }
    }

    async unBookGiftTrees(gift_card_request_id: number, tree_ids: number[], unmap_all: boolean = false): Promise<void> {
        try {
            const response = await this.api.post<void>(`/gift-cards/unbook`, { gift_card_request_id, tree_ids, unmap_all });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to unmap trees!');
        }
    }

    async generateCardTemplate(request_id: string, primary_message: string, logo_message: string, logo?: string | null, sapling_id?: string | null, user_name?: string | null, gifted_by?: string | null, plant_type?: string | null, is_personal?: boolean): Promise<{ presentation_id: string, slide_id: string }> {
        try {
            const resp = await this.api.post<any>(`/gift-cards/generate-template`, { request_id, primary_message, logo_message, logo, sapling_id, plant_type, user_name, gifted_by, is_personal });
            return resp.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to generate gift cards');
        }
    }

    async updateGiftCardTemplate(slide_id: string, primary_message: string, logo_message: string, logo?: string | null, sapling_id?: string | null, user_name?: string | null, gifted_by?: string | null, trees_count?: number): Promise<void> {
        try {
            await this.api.post<any>(`/gift-cards/update-template`, { slide_id, primary_message, logo_message, logo, sapling_id, user_name, gifted_by, trees_count });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to generate gift cards');
        }
    }

    async redeemGiftCardTemplate(type: 'group' | 'user', id: number | null, gift_card_id: number, sapling_id: string, tree_id: number, user: User, profile_image_url?: string | null, messages?: Record<string, any>): Promise<GiftCardUser> {
        try {
            const requesting_user = localStorage.getItem("userId");
            const resp = await this.api.post<GiftCardUser>(`/gift-cards/card/redeem`, { requesting_user, [type === 'group' ? 'sponsor_group' : 'sponsor_user']: id, gift_card_id, sapling_id, tree_id, ...user, user, profile_image_url, ...messages });
            return resp.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to redeem gift card');
        }
    }

    async redeemMultipleGiftCardTemplate(trees_count: number, type: 'group' | 'user', id: number, user: User, profile_image_url?: string | null, messages?: Record<string, any>): Promise<void> {
        try {
            const requesting_user = localStorage.getItem("userId");
            await this.api.post<void>(`/gift-cards/card/redeem-multi`, { requesting_user, trees_count, [type === 'group' ? 'sponsor_group' : 'sponsor_user']: id, ...user, user, profile_image_url, ...messages });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to redeem gift cards');
        }
    }

    async bulkRedeemGiftCardTemplate(type: 'group' | 'user', id: number, users: any[], messages?: Record<string, any>): Promise<void> {
        try {
            const requesting_user = localStorage.getItem("userId");
            await this.api.post<void>(`/gift-cards/card/bulk-redeem`, { requesting_user, [type === 'group' ? 'sponsor_group' : 'sponsor_user']: id, users, ...messages });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to redeem gift cards');
        }
    }

    async assignTrees(gift_card_request_id: number, trees: GiftCardUser[], auto_assign: boolean): Promise<void> {
        try {
            await this.api.post<void>(`/gift-cards/assign`, { gift_card_request_id, trees, auto_assign });
        } catch (error: any) {
            if (error.response?.data?.message) {
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

    async updateGiftCardImages(gift_card_request_id: number): Promise<void> {
        try {
            const resp = await this.api.get<any>(`/gift-cards/update-card-images/${gift_card_request_id}`);
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update gift card images');
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

    async sendEmailToGiftRequestUsers(gift_card_request_id: number, email_sponsor: boolean, email_receiver: boolean, email_assignee: boolean, event_type: string, attach_card: boolean, sponsor_cc_mails?: string[], receiver_cc_mails?: string[], test_mails?: string[]): Promise<void> {
        try {
            const resp = await this.api.post<void>(`/gift-cards/email`, { attach_card, email_sponsor, email_receiver, email_assignee, event_type, sponsor_cc_mails, receiver_cc_mails, test_mails, gift_card_request_id });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to send emails to users');
        }
    }

    async updateAlbumImagesForGiftRequest(gift_card_request_id: number, album_id?: number): Promise<void> {
        try {
            await this.api.post<void>(`/gift-cards/update-album/`, { gift_card_request_id, album_id });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update album images for gift request!');
        }
    }

    async updateGiftRequestUserDetails(users: GiftRequestUser[]): Promise<void> {
        try {
            await this.api.post<void>(`/gift-cards/update-users/`, { users });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update gift request users!');
        }
    }

    async generateFundRequest(giftCardRequestId: number): Promise<string> {
        try {
            const resp = await this.api.get<{ url: string }>(`/gift-cards/requests/fund-request/${giftCardRequestId}`);
            return resp.data.url;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to generate fund request for gift request!');
        }
    }

    async getGiftTransactions(offset: number, limit: number, type: 'group' | 'user', id: number, search?: string): Promise<PaginatedResponse<GiftRedeemTransaction>> {
        try {
            const resp = await this.api.get<PaginatedResponse<GiftRedeemTransaction>>(`/gift-cards/transactions/${id}?type=${type}&offset=${offset}&limit=${limit}` + (search ? `&search=${search}` : ''));
            return resp.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed fetch gifted trees data!');
        }
    }

    async sendEmailToGiftTransaction(transaction_id: number, event_type: string, recipient_email: string, cc_emails: string[]): Promise<void> {
        try {
            await this.api.post<void>(`/gift-cards/transactions/send-email`, { transaction_id, event_type, recipient_email, cc_emails });
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to send email to gift transaction user!');
        }
    }

    async updateTransaction(transaction_id: number, mask: string[], data: Record<string, any>): Promise<void> {
        try {
            await this.api.patch(`/gift-cards/transactions/update`, { transaction_id, mask, data });
        } catch (error: any) {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error('Failed to update transaction details!');
        }
    }


    async getTransactionTreeCardImages(transaction_id: number): Promise<string[]> {
        try {
            const resp = await this.api.get<string[]>(`/gift-cards/transactions/tree-cards/${transaction_id}`);
            return resp.data;
        } catch (error: any) {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw new Error('Failed to get transaction tree cards!');
        }
    }

    // Utils
    async getSignedPutUrl(type: string, key: string): Promise<string> {
        try {
            const response = await this.api.get<{ url: string }>(`/utils/signedPutUrl?type=${type}&key=${key}`);
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
            if (error.response?.data?.message) {
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
        Payments
    */

    async getPayment(paymentId: number) {
        try {
            const response = await this.api.get<Payment>(`/payments/${paymentId}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to get payment');
        }
    }

    async createPayment(amount: number, donor_type: string, pan_number: string | null, consent: boolean) {
        try {
            const response = await this.api.post<Payment>(`/payments`, { amount, donor_type, pan_number, consent });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create payment');
        }
    }

    async updatedPayment(data: Payment) {
        try {
            const response = await this.api.put<Payment>(`/payments/${data.id}`, data);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update payment');
        }
    }

    async createPaymentHistory(payment_id: number, amount: number, payment_method: string, payment_proof: string | null) {
        try {
            const response = await this.api.post<PaymentHistory>(`/payments/history`, { payment_id, amount, payment_method, payment_proof });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create payment');
        }
    }

    async updatePaymentHistory(paymentHistory: PaymentHistory) {
        try {
            const response = await this.api.put<PaymentHistory>(`/payments/history/${paymentHistory.id}`, paymentHistory);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create payment');
        }
    }

    async verifyPayment(order_id: string, razorpay_payment_id: string, razorpay_signature: string) {
        try {
            await this.api.post<PaymentHistory>(`/payments/verify`, { order_id, razorpay_payment_id, razorpay_signature });
        } catch (error: any) {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to verify payment');
        }
    }

    async getPaymentsForOrder(order_id: string) {
        try {
            const response = await this.api.get<any[]>(`/payments/order-payments/${order_id}`);
            return response.data;
        } catch (error: any) {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to fetch payments');
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

    async updateAlbum(albumId: number, images: (File | string)[]) {
        const formData = new FormData();
        formData.append("album_id", albumId.toString());
        const files: { file_name?: string, file_url?: string }[] = []
        for (const image of images) {
            if (typeof image === 'string') {
                files.push({ file_url: image })
            } else {
                files.push({ file_name: image.name })
                formData.append("images", image);
            }
        }
        formData.append('files', JSON.stringify(files));

        try {
            const response = await this.api.put<any>(`/albums/`, formData);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update album');
        }
    }

    async getAlbum(albumId: number) {
        try {
            const response = await this.api.get<any>(`/albums/id/${albumId}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to get album');
        }
    }

    async deleteAlbum(albumId: number) {
        try {
            await this.api.delete<void>(`/albums/${albumId}`);
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to delete album');
        }
    }

    /*
        Email Templates
    */

    async getEmailTemplates(): Promise<EmailTemplate[]> {
        try {
            const response = await this.api.get<EmailTemplate[]>(`/email-templates/`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to get email template');
        }
    }


    /*
        View Permissions
    */

    async verifyViewAccess(view_id: string, user_id: number, path: string, metadata?: Record<string, any>): Promise<{ code: number, message: string, view_name: string }> {
        try {
            const response = await this.api.post<any>(`/view/verify-access/`, { view_id, user_id, path, metadata }, {
                headers: {
                    "x-access-token": this.token,
                    "content-type": "application/json",
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to fetch the page');
        }
    }

    async getViewDetails(path: string): Promise<View | null> {
        try {
            const response = await this.api.get<View | null>(`/view?path=${path}`, {
                headers: {
                    "x-access-token": this.token,
                    "content-type": "application/json",
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to fetch view details');
        }
    }

    async createNewView(name: string, path: string, users: any[]): Promise<View> {
        try {
            const response = await this.api.post<View>(`/view`, { name, path, users }, {
                headers: {
                    "x-access-token": this.token,
                    "content-type": "application/json",
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to create view details');
        }
    }

    async updateView(viewData: View): Promise<View> {
        try {
            const response = await this.api.put<View>(`/view`, viewData, {
                headers: {
                    "x-access-token": this.token,
                    "content-type": "application/json",
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update view details');
        }
    }

    async updateViewUsers(view_id: number, users: any[]): Promise<View> {
        try {
            const response = await this.api.post<View>(`/view/users`, { view_id, users }, {
                headers: {
                    "x-access-token": this.token,
                    "content-type": "application/json",
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to update permission details');
        }
    }

    /**
     * Campaign
     */

    async getCampaignAnalytics(c_key: string): Promise<{
        summary: {
            donationCount: number;
            giftRequestCount: number;
            totalAmount: number;
            treesCount: number;
        };
        champion: {
            name: string;
            email: string;
            referralDonationsCount: number;
            amountRaised: number;
            treesSponsored: number;
        } | null;
    }> {
        try {
            const response = await this.api.get<{
                summary: {
                    donationCount: number;
                    giftRequestCount: number;
                    totalAmount: number;
                    treesCount: number;
                };
                champion: {
                    name: string;
                    email: string;
                    referralDonationsCount: number;
                    amountRaised: number;
                    treesSponsored: number;
                } | null;
            }>(`/campaigns/${c_key}/analytics`);

            return response.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to fetch campaign analytics');
        }
    }

    async getReferralCounts(): Promise<{ personalReferrals: number, campaignReferrals: number, totalReferrals: number; }> {
        try {
            const response = await this.api.get<{ personalReferrals: number, campaignReferrals: number, totalReferrals: number; }>('/campaigns/referralcount');

            return {
                personalReferrals: response.data.personalReferrals,
                campaignReferrals: response.data.campaignReferrals,
                totalReferrals: response.data.totalReferrals
            };
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to fetch referral counts');
        }
    }

    async getReferralDashboard(rfrCode: string) {
        try {
            // Changed to match backend route exactly
            const response = await this.api.get(`/campaigns/referral/${encodeURIComponent(rfrCode)}`);

            return {
                totalRaised: response.data.totalRaised || 0,
                totalTrees: response.data.totalTrees || 0,
                donations: response.data.donations || [],
                gifts: response.data.gifts || []
            };
        } catch (error: unknown) {
            if (error instanceof Error && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                if (axiosError.response?.data?.message) {
                    throw new Error(axiosError.response.data.message);
                }
            }
            throw new Error('Failed to fetch referral dashboard data');
        }
    }

    async getUserNameByReferral(rfrCode: string): Promise<{ name: string }> {
        try {
            const response = await this.api.post('/referrals/referralname', { rfr: rfrCode });
            return {
                name: response.data.name
            };
        } catch (error: unknown) {
            if (error instanceof Error && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                if (axiosError.response?.data?.message) {
                    throw new Error(axiosError.response.data.message);
                }
            }
            throw new Error('Failed to fetch user name by referral code');
        }
    }

    /**
     * Gen AI
     */
    async serveUserQuery(message: string, history: any[]): Promise<{ text_output: string, sponsor_details?: any }> {
        try {
            const response = await this.api.post<{ text_output: string, sponsor_details: any }>(`/gift-cards/gen-ai`, { message, history }, {
                headers: {
                    "x-access-token": this.token,
                    "content-type": "application/json",
                }
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Failed to connect with our AI bot!');
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
