import { useEffect, useState } from "react";
import { DonationTree } from "../../../../../types/donation";
import { TableColumnsType } from "antd";
import { DeleteOutlined, SearchOutlined } from "@mui/icons-material";
import { Button, Box, Typography, TextField, InputAdornment, DialogTitle, DialogContentText, Dialog, DialogContent, DialogActions } from "@mui/material";
import GeneralTable from "../../../../../components/GenTable";
import ApiClient from "../../../../../api/apiClient/apiClient";

interface UnassignmentListProps {
    trees: DonationTree[];
    onRemove: (tree: DonationTree) => void;
}

const UnassignmentList: React.FC<UnassignmentListProps> = ({ trees, onRemove }) => {
    
     // Client-side pagination and filtering
     const [page, setPage] = useState(0);
     const [pageSize, setPageSize] = useState(10);
     const [searchText, setSearchText] = useState('');
     const [filteredUnssignments, setFilteredUnssignments] = useState<DonationTree[]>([]);

 
     // Handle pagination change
     const handlePaginationChange = (page: number, pageSize: number) => {
         setPage(page - 1);
         setPageSize(pageSize);
     };
 
     // Filter assignments based on search text
     useEffect(() => {
         if (!searchText.trim()) {
             setFilteredUnssignments(trees);
             return;
         }
 
         const lowercasedSearch = searchText.toLowerCase();
         const filtered = trees.filter(tree =>
             tree.sapling_id.toLowerCase().includes(lowercasedSearch) ||
             tree.plant_type.toLowerCase().includes(lowercasedSearch) ||
             tree.recipient_name?.toLowerCase().includes(lowercasedSearch) ||
             tree.assignee_name?.toLowerCase().includes(lowercasedSearch)
         );
 
         setFilteredUnssignments(filtered);
     }, [searchText, trees]);
 
     // Get paginated data
     const getPaginatedData = () => {
         const startIndex = page * pageSize;
         const endIndex = startIndex + pageSize;
         return filteredUnssignments.slice(startIndex, endIndex);
     };
 
     // Handle search input change
     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         setSearchText(e.target.value);
         setPage(0); // Reset to first page when searching
     };
 
     // Handle download
     const handleDownload = async () => {
        return Promise.resolve(filteredUnssignments);
     };

 
     // Table columns
     const columns: TableColumnsType<DonationTree> = [
         {
             dataIndex: 'sapling_id',
             key: 'Sapling Id',
             title: 'Sapling Id',
             align: 'center',
             width: 120,
         },
         {
             dataIndex: 'plant_type',
             key: 'Plant Type',
             title: 'Plant Type',
             align: 'center',
             width: 120,
         },
         {
             dataIndex: 'recipient_name',
             key: 'Recipient Name',
             title: 'Recipient Name',
             align: 'center',
             width: 150,
         },
         {
             dataIndex: 'assignee_name',
             key: 'Assignee Name',
             title: 'Assignee Name',
             align: 'center',
             width: 150,
         },
         {
             dataIndex: 'actions',
             key: 'Actions',
             title: 'Actions',
             align: 'center',
             width: 100,
             render: (_, record) => (
                 <Button
                     variant="outlined"
                     color="error"
                     size="small"
                     onClick={() => onRemove(record)}
                 >
                     <DeleteOutlined />
                 </Button>
             ),
         },
     ];
 
     return (
         <Box>
             <Typography variant="body1" sx={{ mb: 2 }}>
                 {trees.length} tree(s) will be unassigned
             </Typography>
 
             <Box sx={{ mb: 2 }}>
                 <TextField
                     placeholder="Search by sapling ID, plant type, recipient, or assignee"
                     value={searchText}
                     onChange={handleSearchChange}
                     InputProps={{
                         startAdornment: (
                             <InputAdornment position="start">
                                 <SearchOutlined />
                             </InputAdornment>
                         ),
                     }}
                     size="small"
                     sx={{ width: 500 }}
                 />
             </Box>
 
             <GeneralTable
                 rows={getPaginatedData()}
                 columns={columns}
                 totalRecords={filteredUnssignments.length}
                 onPaginationChange={handlePaginationChange}
                 onDownload={handleDownload}
                 page={page}
                 pageSize={pageSize}
                 loading={false}
             />
         </Box>
     );
}

export default UnassignmentList;