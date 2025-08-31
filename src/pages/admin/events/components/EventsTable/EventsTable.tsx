import { Box } from "@mui/material";
import { TableColumnsType } from "antd";
import GeneralTable from "../../../../../components/GenTable";
import { Event } from "../../../../../types/event";
import { EventTableActions } from "./EventTableActions";
import getColumnSearchProps from "../../../../../components/Filter";
import { GridFilterItem } from "@mui/x-data-grid";
import { Button } from "@mui/material";

interface EventsTableProps {
  loading: boolean;
  rows: Event[];
  totalRecords: number;
  page: number;
  pageSize: number;
  filters: Record<string, GridFilterItem>;
  onPaginationChange: (page: number, pageSize: number) => void;
  onDownload: () => Promise<Event[]>;
  onSetFilters: (filters: Record<string, GridFilterItem>) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, eventData: Event) => void;
}

export const EventsTable = ({
  loading,
  rows,
  totalRecords,
  page,
  pageSize,
  filters,
  onPaginationChange,
  onDownload,
  onSetFilters,
  onMenuOpen,
}: EventsTableProps) => {
  const columns: TableColumnsType<Event> = [
    {
      dataIndex: "name",
      key: "name",
      title: "Event Name",
      width: 180,
      align: "center",
      fixed: "left",
      ...getColumnSearchProps('name', filters, onSetFilters)
    },
    {
      dataIndex: "event_date",
      key: "event_date",
      title: "Event Date",
      width: 150,
      align: "center",
      ...getColumnSearchProps('event_date', filters, onSetFilters),
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      dataIndex: "site_name",
      key: "site_name",
      title: "Site Name",
      width: 120,
      align: "center",
      ...getColumnSearchProps('site_name', filters, onSetFilters)
    },
    {
      dataIndex: "tags",
      key: "tags",
      title: "Tags",
      width: 150,
      align: "center",
      ...getColumnSearchProps('tags', filters, onSetFilters)
    },
    {
      dataIndex: "link",
      key: "link",
      title: "Event Dashboard",
      width: 150,
      align: "center",
      render: (linkId: string) => (
        <a
          href={`/events/${linkId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outlined"
            color="success"
            size="small"
            sx={{
              textTransform: 'none',
            }}
          >
            Dashboard
          </Button>
        </a>
      )
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
      width: 80,
      align: "center",
      render: (value, record, index) => (
        <EventTableActions
          event={record}
          onMenuOpen={onMenuOpen}
        />
      ),
    },
  ];

  return (
    <Box sx={{ height: 840, width: "100%" }}>
      <GeneralTable
        loading={loading}
        rows={rows}
        columns={columns}
        totalRecords={totalRecords}
        page={page}
        pageSize={pageSize}
        onPaginationChange={onPaginationChange}
        onDownload={onDownload}
        footer
        tableName="Events"
      />
    </Box>
  );
};