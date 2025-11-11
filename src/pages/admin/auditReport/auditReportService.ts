import ApiClient from "../../../api/apiClient/apiClient";
import { AuditReportResponse } from "../../../types/auditReport";
import { GridFilterItem } from "@mui/x-data-grid";

export const fetchFieldAuditReport = async (
  offset: number,
  limit: number,
  filters: GridFilterItem[],
  sortBy?: string,
  sortDir?: string
): Promise<AuditReportResponse> => {
  const apiClient = new ApiClient();
  
  try {
    const response = await apiClient.getAuditReport(
      offset,
      limit,
      filters,
      sortBy,
      sortDir
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch audit report:", error);
    throw error;
  }
};
