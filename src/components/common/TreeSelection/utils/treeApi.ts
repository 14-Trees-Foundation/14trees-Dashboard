import ApiClient from "../../../../api/apiClient/apiClient";
import { TreeApiConfig, TreeApiResponse } from "../types";
import { Tree as GlobalTree } from "../../../../types/tree";
import { Tree as UnifiedTree } from "../types";

export class TreeApiService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  // Convert GlobalTree to UnifiedTree format
  private convertToUnifiedTree = (tree: GlobalTree): UnifiedTree => ({
    id: tree.id,
    sapling_id: tree.sapling_id,
    plant_type: tree.plant_type || '',
    plot: tree.plot || '',
    plot_name: tree.site_name || tree.plot || '',
    plot_id: tree.plot_id,
    status: tree.tree_status || 'Unknown',
    tags: tree.tags || [],
    assigned_to: tree.assigned_to_name,
    planted_date: tree.created_at?.toString(),
    tree_id: tree.id,
  });

  async fetchTrees(
    offset: number,
    limit: number,
    filters: any[],
    config: TreeApiConfig
  ): Promise<TreeApiResponse> {
    try {
      let response;
      switch (config.scope) {
        case 'giftable':
          response = await this.apiClient.getGiftAbleTrees(
            offset,
            limit,
            filters,
            config.includeNonGiftable || false,
            config.includeAllHabitats || false
          );
          break;
        case 'all':
          response = await this.apiClient.getTrees(offset, limit, filters);
          break;
        default:
          throw new Error(`Unsupported tree scope: ${config.scope}`);
      }

      // Convert GlobalTree[] to UnifiedTree[]
      return {
        results: response.results.map(this.convertToUnifiedTree),
        total: response.total,
        offset: response.offset,
      };
    } catch (error) {
      console.error('Error fetching trees:', error);
      throw error;
    }
  }

  async fetchAllFilteredTrees(
    filters: any[],
    config: TreeApiConfig,
    maxLimit: number = 500
  ): Promise<TreeApiResponse> {
    try {
      return await this.fetchTrees(0, maxLimit, filters, config);
    } catch (error) {
      console.error('Error fetching all filtered trees:', error);
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