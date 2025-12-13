import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { GridFilterItem } from "@mui/x-data-grid";
import type { TableColumnsType } from 'antd';
import getColumnSearchProps, { getColumnDateFilter, getSortIcon } from "../../../components/Filter";
import { getFormattedDate } from "../../../helpers/utils";
import GeneralTable from "../../../components/GenTable";
import { UserPlotTreesAuditRow } from "../../../types/onsiteReports";
import { Order } from "../../../types/common";
import { fetchTreesAuditReport } from "./treeAuditReportService";

export const TreesAuditReport = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, GridFilterItem>>({});
  const [orderBy, setOrderBy] = useState<Order[]>([]);
  const [tableRows, setTableRows] = useState<UserPlotTreesAuditRow[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page - 1);
    setPageSize(pageSize);
  };

  const handleSetFilters = (filters: Record<string, GridFilterItem>) => {
    setPage(0);
    setFilters(filters);
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
      setPage(0);
      updateOrder(sorter);
      setOrderBy(newOrder);
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
    getTreesAuditReportData();
  }, [filters, page, pageSize, orderBy]);

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
      setTableRows(response.results || []);
      setTotalRecords(response.total || 0);
    } catch (error) {
      console.error("Failed to fetch trees audit report:", error);
      setTableRows([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
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
      title: getSortableHeader(t('onsiteReports.tableHeaders.auditDate'), "audit_date"),
      align: "center",
      width: 150,
      render: (value: string) => getFormattedDate(value),
      filteredValue: filters['audit_date']?.value || null,
      ...getColumnDateFilter({ dataIndex: 'audit_date', filters, handleSetFilters, label: 'Audit Date' })
    },
    {
      dataIndex: "user_name",
      key: "user_name",
      title: t('onsiteReports.tableHeaders.fieldStaff'),
      align: "center",
      width: 200,
      filteredValue: filters['user_name']?.value || null,
      ...getColumnSearchProps('user_name', filters, handleSetFilters)
    },
    {
      dataIndex: "plot_name",
      key: "plot_name",
      title: t('common.tableHeaders.plotName'),
      align: "center",
      width: 200,
      filteredValue: filters['plot_name']?.value || null,
      ...getColumnSearchProps('plot_name', filters, handleSetFilters)
    },
    {
      dataIndex: "site_name",
      key: "site_name",
      title: t('common.tableHeaders.siteName'),
      align: "center",
      width: 200,
      filteredValue: filters['site_name']?.value || null,
      ...getColumnSearchProps('site_name', filters, handleSetFilters)
    },
    {
      dataIndex: "trees_audited",
      key: "trees_audited",
      title: getSortableHeader(t('onsiteReports.tableHeaders.treesAudited'), "trees_audited"),
      align: "center",
      width: 150,
      filteredValue: filters['trees_audited']?.value || null,
      ...getColumnSearchProps('trees_audited', filters, handleSetFilters)
    },
  ];

  return (
    <Box>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 12px",
        }}
      >
        <Typography variant="h6" style={{ marginTop: '5px' }}>{t('onsiteReports.treeAuditReports')}</Typography>
      </div>
      <Divider sx={{ backgroundColor: "black", marginBottom: '15px' }} />
      <Box sx={{ height: 840, width: "100%" }}>
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
          tableName={t('onsiteReports.treeAuditReports')}
          scroll={{ x: 1000 }}
        />
      </Box>
    </Box>
  );
};

export default TreesAuditReport;
