import ApiClient from "../../../api/apiClient/apiClient";
import { UserPlotTreesAuditResponse } from "../../../types/onsiteReports";
import { GridFilterItem } from "@mui/x-data-grid";

export const fetchTreesAuditReport = async (
  offset: number,
  limit: number,
  filters: GridFilterItem[],
  sortBy?: string,
  sortDir?: string
): Promise<UserPlotTreesAuditResponse> => {
  const apiClient = new ApiClient();
  
  try {
    const response = await apiClient.getOnsiteTreeAuditReport(
      offset,
      limit,
      filters,
      sortBy,
      sortDir
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch trees audit report:", error);
    throw error;
  }
};
