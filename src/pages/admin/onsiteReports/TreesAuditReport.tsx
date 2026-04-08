import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography, Divider, Tabs, Tab, IconButton, Tooltip } from "@mui/material";
import { Help } from "@mui/icons-material";
import { GridFilterItem } from "@mui/x-data-grid";
import type { TableColumnsType } from 'antd';
import getColumnSearchProps, { getColumnDateFilter, getSortIcon } from "../../../components/Filter";
import { getFormattedDate } from "../../../helpers/utils";
import GeneralTable from "../../../components/GenTable";
import { UserPlotTreesAuditRow } from "../../../types/onsiteReports";
import { Order } from "../../../types/common";
import { fetchTreesAuditReport } from "./treeAuditReportService";
import StructuredSearchComponent from "../../../components/StructuredSearch";
import { getCachedSearchOptions, SearchOption } from "./structuredSearchService";
import QuickSearchPresets from "../../../components/QuickSearchPresets";
import SearchHelpDialog from "../../../components/SearchHelpDialog";
import DailyAuditChart from "../../../components/DailyAuditChart";

export const TreesAuditReport = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [orderBy, setOrderBy] = useState<Order[]>([]);
  const [tableRows, setTableRows] = useState<UserPlotTreesAuditRow[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchMode, setSearchMode] = useState<'data' | 'structured' | 'quick'>('data');
  
  // Cache for storing results per tab
  const [tabCache, setTabCache] = useState<{
    data: {
      rows: UserPlotTreesAuditRow[];
      total: number;
      filters: Record<string, GridFilterItem>;
      page: number;
      pageSize: number;
      orderBy: Order[];
    };
    quick: {
      rows: UserPlotTreesAuditRow[];
      total: number;
      filters: Record<string, GridFilterItem>;
      page: number;
      pageSize: number;
      orderBy: Order[];
    };
    structured: {
      rows: UserPlotTreesAuditRow[];
      total: number;
      filters: Record<string, GridFilterItem>;
      page: number;
      pageSize: number;
      orderBy: Order[];
    };
  }>({
    data: { rows: [], total: 0, filters: {}, page: 0, pageSize: 10, orderBy: [] },
    quick: { rows: [], total: 0, filters: {}, page: 0, pageSize: 10, orderBy: [] },
    structured: { rows: [], total: 0, filters: {}, page: 0, pageSize: 10, orderBy: [] }
  });

  const [searchOptions, setSearchOptions] = useState<{
    staff: SearchOption[];
    sites: SearchOption[];
    plots: SearchOption[];
  }>({ staff: [], sites: [], plots: [] });
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(true);

  const handlePaginationChange = (page: number, pageSize: number) => {
    const newPage = page - 1;
    const newPageSize = pageSize;
    
    setPage(newPage);
    setPageSize(newPageSize);
    setShouldFetchData(true);
    
    // Update cache for current tab
    setTabCache(prev => ({
      ...prev,
      [searchMode]: {
        ...prev[searchMode],
        page: newPage,
        pageSize: newPageSize
      }
    }));
  };

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    const newPage = 0;
    setPage(newPage);
    setFilters(filters);
    setShouldFetchData(true);
    
    // Update cache for current tab
    setTabCache(prev => ({
      ...prev,
      [searchMode]: {
        ...prev[searchMode],
        filters,
        page: newPage
      }
    }));
  };

  const handleSortingChange = (sorter: any) => {
    let newOrder = [...orderBy];
    const updateOrder = (item: { column: string, order: 'ASC' | 'DESC' }) => {
      const index = newOrder.findIndex((item) => item.column === sorter.field);
      if (index > -1) {
        if (sorter.order) newOrder[index].order = sorter.order;
        else newOrder = newOrder.filter((item) => item.column !== sorter.field);
      } else if (sorter.order) {
        newOrder.push({ column: sorter.field, order: sorter.order });
      }
    }

    if (sorter.field) {
      const newPage = 0;
      setPage(newPage);
      updateOrder(sorter);
      setOrderBy(newOrder);
      setShouldFetchData(true);
      
      // Update cache for current tab
      setTabCache(prev => ({
        ...prev,
        [searchMode]: {
          ...prev[searchMode],
          orderBy: newOrder,
          page: newPage
        }
      }));
    }
  };

  const getSortableHeader = (header: string, key: string) => {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
        {header} {getSortIcon(key, orderBy.find((item) => item.column === key)?.order, handleSortingChange)}
      </div>
    )
  };

  useEffect(() => {
    if (shouldFetchData) {
      getTreesAuditReportData();
    }
  }, [filters, page, pageSize, orderBy, shouldFetchData]);

  useEffect(() => {
    loadSearchOptions();
  }, []);

  const loadSearchOptions = async () => {
    try {
      setLoadingOptions(true);
      const options = await getCachedSearchOptions();
      setSearchOptions(options);
    } catch (error) {
      console.error("Failed to load search options:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleStructuredSearch = (structuredFilters: GridFilterItem[]) => {
    // Convert GridFilterItem[] to Record<string, GridFilterItem>
    const filterRecord: Record<string, GridFilterItem> = {};
    structuredFilters.forEach(filter => {
      filterRecord[filter.columnField] = filter;
    });
    const newPage = 0;
    setPage(newPage);
    setFilters(filterRecord);
    setShouldFetchData(true);
    
    // Update cache for structured tab
    setTabCache(prev => ({
      ...prev,
      structured: {
        ...prev.structured,
        filters: filterRecord,
        page: newPage
      }
    }));
  };

  const handleStructuredClear = () => {
    const newPage = 0;
    setFilters({});
    setPage(newPage);
    setShouldFetchData(true);
    
    // Update cache for structured tab
    setTabCache(prev => ({
      ...prev,
      structured: {
        ...prev.structured,
        filters: {},
        page: newPage
      }
    }));
  };

  const handleQuickSearch = (quickFilters: GridFilterItem[], description: string) => {
    // Convert GridFilterItem[] to Record<string, GridFilterItem>
    const filterRecord: Record<string, GridFilterItem> = {};
    quickFilters.forEach(filter => {
      filterRecord[filter.columnField] = filter;
    });
    const newPage = 0;
    setPage(newPage);
    setFilters(filterRecord);
    setShouldFetchData(true);
    
    // Update cache for quick tab
    setTabCache(prev => ({
      ...prev,
      quick: {
        ...prev.quick,
        filters: filterRecord,
        page: newPage
      }
    }));
  };

  const getTreesAuditReportData = async () => {
    let filtersData = Object.values(filters);
    setLoading(true);
    try {
      const sortBy = orderBy.length > 0 ? orderBy[0].column : undefined;
      const sortDir = orderBy.length > 0 ? orderBy[0].order?.toLowerCase() : undefined;

      const response = await fetchTreesAuditReport(
        page * pageSize,
        pageSize,
        filtersData,
        sortBy,
        sortDir
      );
      const results = response.results || [];
      const total = response.total || 0;
      
      setTableRows(results);
      setTotalRecords(total);
      
      // Update cache for current tab
      setTabCache(prev => ({
        ...prev,
        [searchMode]: {
          ...prev[searchMode],
          rows: results,
          total: total
        }
      }));
    } catch (error) {
      console.error("Failed to fetch trees audit report:", error);
      setTableRows([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Function to restore tab state from cache
  const restoreTabState = (newMode: 'data' | 'structured' | 'quick') => {
    const cachedData = tabCache[newMode];
    
    // Only restore if we have cached data for this tab
    if (cachedData.rows.length > 0 || Object.keys(cachedData.filters).length > 0) {
      setShouldFetchData(false); // Disable fetching when restoring from cache
      setPage(cachedData.page);
      setPageSize(cachedData.pageSize);
      setFilters(cachedData.filters);
      setOrderBy(cachedData.orderBy);
      setTableRows(cachedData.rows);
      setTotalRecords(cachedData.total);
    } else {
      // If no cache, set defaults for the tab and enable fetching
      setShouldFetchData(true);
      setPage(0);
      setPageSize(10);
      setFilters({});
      setOrderBy([]);
      // Don't clear table data immediately, let useEffect handle the API call
    }
  };

  const handleTabChange = (newValue: 'data' | 'structured' | 'quick') => {
    // Save current tab state to cache before switching
    setTabCache(prev => ({
      ...prev,
      [searchMode]: {
        ...prev[searchMode],
        rows: tableRows,
        total: totalRecords,
        filters,
        page,
        pageSize,
        orderBy
      }
    }));

    setSearchMode(newValue);
    restoreTabState(newValue);
  };

  const getAllTreesAuditReportData = async () => {
    let filtersData = Object.values(filters);
    try {
      const sortBy = orderBy.length > 0 ? orderBy[0].column : undefined;
      const sortDir = orderBy.length > 0 ? orderBy[0].order?.toLowerCase() : undefined;

      const response = await fetchTreesAuditReport(
        0,
        totalRecords,
        filtersData,
        sortBy,
        sortDir
      );
      return response.results || [];
    } catch (error) {
      console.error("Failed to fetch all trees audit report data:", error);
      return [];
    }
  };

  const columns: TableColumnsType<UserPlotTreesAuditRow> = [
    {
      dataIndex: "audit_date",
      key: "audit_date",
      title: getSortableHeader("Audit Date", "audit_date"),
      align: "center",
      width: 150,
      render: (value: string) => getFormattedDate(value),
      filteredValue: filters['audit_date']?.value || null,
      ...getColumnDateFilter({ dataIndex: 'audit_date', filters, handleSetFilters, label: 'Audit Date' })
    },
    {
      dataIndex: "user_name",
      key: "user_name",
      title: "Field Staff",
      align: "center",
      width: 200,
      filteredValue: filters['user_name']?.value || null,
      ...getColumnSearchProps('user_name', filters, handleSetFilters)
    },
    {
      dataIndex: "plot_name",
      key: "plot_name",
      title: "Plot Name",
      align: "center",
      width: 200,
      filteredValue: filters['plot_name']?.value || null,
      ...getColumnSearchProps('plot_name', filters, handleSetFilters)
    },
    {
      dataIndex: "site_name",
      key: "site_name",
      title: "Site Name",
      align: "center",
      width: 200,
      filteredValue: filters['site_name']?.value || null,
      ...getColumnSearchProps('site_name', filters, handleSetFilters)
    },
    {
      dataIndex: "trees_audited",
      key: "trees_audited",
      title: getSortableHeader("Trees Audited", "trees_audited"),
      align: "center",
      width: 150,
      filteredValue: filters['trees_audited']?.value || null,
      ...getColumnSearchProps('trees_audited', filters, handleSetFilters)
    },
    {
      dataIndex: "trees_added",
      key: "trees_added",
      title: getSortableHeader("Trees Added", "trees_added"),
      align: "center",
      width: 150,
      filteredValue: filters['trees_added']?.value || null,
      ...getColumnSearchProps('trees_added', filters, handleSetFilters)
    },
  ];

  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px 12px",
        }}
      >
        <Typography variant="h6" style={{ marginTop: '5px' }}>Tree Audit Reports</Typography>
        <Tooltip title="Search Help Guide">
          <IconButton 
            onClick={() => setShowHelpDialog(true)}
            color="primary"
            size="small"
          >
            <Help />
          </IconButton>
        </Tooltip>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      
      {/* Search Mode Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={searchMode} 
          onChange={(_, newValue) => handleTabChange(newValue)}
        >
          <Tab label="Data View" value="data" />
          <Tab label="Quick Search" value="quick" />
          <Tab label="Advanced Search" value="structured" />
        </Tabs>
      </Box>

      {/* Daily Audit Chart - Only show in Data View */}
      {searchMode === 'data' && (
        <DailyAuditChart 
          data={tableRows}
          loading={loading}
        />
      )}

      {/* Quick Search Component */}
      {searchMode === 'quick' && (
        <QuickSearchPresets
          onSearch={handleQuickSearch}
          staffOptions={searchOptions.staff}
          siteOptions={searchOptions.sites}
        />
      )}

      {/* Structured Search Component */}
      {searchMode === 'structured' && (
        <StructuredSearchComponent
          onSearch={handleStructuredSearch}
          onClear={handleStructuredClear}
          loading={loading || loadingOptions}
          staffOptions={searchOptions.staff}
          siteOptions={searchOptions.sites}
          plotOptions={searchOptions.plots}
        />
      )}
      
      <Box sx={{ height: searchMode === 'data' ? 600 : 840, width: "100%" }}>
        <GeneralTable
          loading={loading}
          rows={tableRows}
          columns={columns}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onDownload={getAllTreesAuditReportData}
          footer
          tableName="Trees Audit Report"
          scroll={{ x: 1000 }}
        />
      </Box>

      {/* Search Help Dialog */}
      <SearchHelpDialog 
        open={showHelpDialog} 
        onClose={() => setShowHelpDialog(false)} 
      />
    </Box>
  );
};

export default TreesAuditReport;
