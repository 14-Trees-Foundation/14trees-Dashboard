import ApiClient from "../../../api/apiClient/apiClient";
import { AuditReportResponse } from "../../../types/auditReport";
import { GridFilterItem } from "@mui/x-data-grid";

export const fetchOnsiteTreeAuditReport = async (
  offset: number,
  limit: number,
  filters: GridFilterItem[],
  sortBy?: string,
  sortDir?: string
): Promise<AuditReportResponse> => {
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
    console.error("Failed to fetch onsite tree audit report:", error);
    throw error;
  }
};
