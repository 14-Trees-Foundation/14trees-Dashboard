import ApiClient from "../../../../api/apiClient/apiClient";
import { TreeApiConfig, TreeApiResponse } from "../types";

export class TreeApiService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async fetchTrees(
    offset: number,
    limit: number,
    filters: any[],
    config: TreeApiConfig
  ): Promise<TreeApiResponse> {
    try {
      switch (config.scope) {
        case 'giftable':
          return await this.apiClient.getGiftAbleTrees(
            offset,
            limit,
            filters,
            config.includeNonGiftable || false,
            config.includeAllHabitats || false
          );
        case 'all':
          return await this.apiClient.getTrees(offset, limit, filters);
        default:
          throw new Error(`Unsupported tree scope: ${config.scope}`);
      }
    } catch (error) {
      console.error('Error fetching trees:', error);
      throw error;
    }
  }

  async getPlantTypeTags(): Promise<{ results: string[] }> {
    try {
      return await this.apiClient.getPlantTypeTags();
    } catch (error) {
      console.error('Error fetching plant type tags:', error);
      throw error;
    }
  }

  async getPlots(offset: number = 0, limit: number = -1): Promise<{ results: any[] }> {
    try {
      return await this.apiClient.getPlots(offset, limit);
    } catch (error) {
      console.error('Error fetching plots:', error);
      throw error;
    }
  }

  async getPlantTypes(offset: number = 0, limit: number = -1): Promise<{ results: any[] }> {
    try {
      return await this.apiClient.getPlantTypes(offset, limit);
    } catch (error) {
      console.error('Error fetching plant types:', error);
      throw error;
    }
  }
}

export const treeApiService = new TreeApiService();