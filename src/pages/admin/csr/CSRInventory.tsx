import { useEffect, useState } from "react";
import { Box, Divider, Typography, useMediaQuery, useTheme, Button } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { AutocompleteWithPagination } from "../../../components/AutoComplete";
import { useAppDispatch, useAppSelector } from "../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import { Group } from "../../../types/Group";
import * as groupActionCreators from '../../../redux/actions/groupActions';
import ApiClient from "../../../api/apiClient/apiClient";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import CSRGiftTrees from "./CSRGiftTrees";
import CSRSharePageDialog from "./CSRSharePageDialog";
import { TreeSponsorshipForm } from "./form/CSRForm"
import { BirthdayResponse } from "../../../types/notification"

interface CSRInventoryProps {
    onBirthdayData?: (data: BirthdayResponse) => void;
    onGroupChange?: (group: Group | null) => void;
}

interface Recipient {
    name: string;
    email: string;
    message: string;
}

interface FormData {
    treeCount: number;
    amount: number;
    occasionType: string;
    occasionName: string;
    occasionDate: Date;
    recipients: Recipient[];
    sponsorName: string;
    sponsorEmail: string;
    sponsorPhone: string;
    panNumber: string;
}

const CSRInventory: React.FC<CSRInventoryProps> = ({ onBirthdayData, onGroupChange }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const { groupId } = useParams();

    const dispatch = useAppDispatch();
    const { getGroups, updateGroup } = bindActionCreators(groupActionCreators, dispatch);

    ///*** GROUP ***/
    const [groupPage, setGroupPage] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [groupNameInput, setGroupNameInput] = useState("");
    const [formOpen, setFormOpen] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            getGroupsData();
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [groupPage, groupNameInput]);

    const handleFormSubmit = (formData: FormData) => {
        console.log('Form submitted:', formData);
        // You might want to validate at least one recipient exists
        if (formData.recipients.length === 0 || !formData.recipients[0].name) {
            toast.error('Please add at least one recipient');
            return;
        }
        setFormOpen(false);
    };

    const getGroupsData = async () => {
        const groupNameFilter = {
            columnField: "name",
            value: groupNameInput,
            operatorValue: "contains",
        };

        const filters = [groupNameFilter];
        if (groupId && !isNaN(parseInt(groupId))) {
            filters.push({
                columnField: "id",
                value: groupId,
                operatorValue: "equals",
            });
        }

        getGroups(groupPage * 10, 10, filters);
    };

    let groupsList: Group[] = [];
    const groupData = useAppSelector((state) => state.groupsData);

    if (groupData) {
        groupsList = Object.values(groupData.groups);
        groupsList = groupsList.sort((a, b) => {
            return b.id - a.id;
        });
    }

    useEffect(() => {
        if (groupId) {
            const group = groupsList.find(item => item.id === parseInt(groupId));
            if (group) {
                setSelectedGroup(group);
                onGroupChange?.(group);
            } else {
                setSelectedGroup(null);
                onGroupChange?.(null);
            }
        }
    }, [groupsList, groupId]);

    // Add this with your other useEffect hooks
    useEffect(() => {
        const fetchBirthdays = async () => {
            if (!selectedGroup?.id) return;

            try {
                const apiClient = new ApiClient();
                const data = await apiClient.checkGroupBirthdays(selectedGroup.id);
                onBirthdayData?.(data);
            } catch (error) {
                console.error('Failed to fetch birthdays:', error);
                toast.error('Failed to load birthday data');
            }
        };

        fetchBirthdays();
    }, [selectedGroup?.id, onBirthdayData]);

    ///*** Tags ***/
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        const getTags = async () => {
            try {
                const apiClient = new ApiClient();
                const tagsResp = await apiClient.getTags(0, 100);
                setTags(tagsResp.results.map(item => item.tag));
            } catch (error: any) {
                toast.error(error.message);
            }
        };

        getTags();
    }, []);

    const handleOrganizationUpdate = async (
        updatedData: { name: string; address: string; logo_url: string },
        logoFile?: File
      ) => {
        if (!selectedGroup) return;
      
        setFormOpen(false);
      
        try {
          const apiClient = new ApiClient();
      
          // Create updated group object
          const updatedGroup = {
            ...selectedGroup,
            name: updatedData.name,
            address: updatedData.address,
            logo_url: updatedData.logo_url,
            updated_at: new Date()
          };
      
          // Call with correct signature: (data: Group, logo?: File)
          const response = await apiClient.updateGroup(updatedGroup, logoFile);
      
          setSelectedGroup(response); // response is the updated group
          onGroupChange?.(response);
      
          toast.success("Organization details updated successfully!");
        } catch (error: any) {
          console.error("Failed to update organization:", error);
          toast.error("Failed to update organization details");
        }
      };
      
      

    return (
        <Box>
            <ToastContainer />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: isMobile ? '10px 10px 0 10px' : undefined
                }}
            >
                <Typography variant={isMobile ? "h5" : "h3"} style={{ marginTop: '5px', marginBottom: '5px' }}>
                    {selectedGroup ? `${selectedGroup.name}'s` : 'Corporate'} Dashboard
                </Typography>
                <div
                   style={{
                     display: "flex",
                      justifyContent: "space-between",
                      alignItems: 'center'
                    }}
                >
                    {!groupId && (
                        <AutocompleteWithPagination
                            label="Select a corporate group"
                            options={groupsList}
                            getOptionLabel={(option) => option?.name || ''}
                            onChange={(event, newValue) => {
                                setSelectedGroup(newValue);
                            }}
                            onInputChange={(event) => {
                                const { value } = event.target;
                                setGroupPage(0);
                                setGroupNameInput(value);
                            }}
                            setPage={setGroupPage}
                            size="small"
                            value={selectedGroup}
                        />
                    )}
                    {/* <Button
                        sx={{ ml: 2 }}
                        disabled={!selectedGroup}
                        variant="contained"
                        color="success"
                        onClick={() => {
                            const { hostname, host } = window.location;
                            if (hostname === "localhost" || hostname === "127.0.0.1") {
                                window.open("http://" + host + "/csr/dashboard/" + selectedGroup?.id);
                            } else {
                                window.open("https://" + hostname + "/csr/dashboard/" + selectedGroup?.id);
                            }
                        }}
                    >
                        CSR View
                    </Button> */}
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => setFormOpen(true)}
                        style={{ marginLeft: 10 }}
                    >
                        Purchase Gifts
                    </Button>
                    <CSRSharePageDialog groupId={selectedGroup?.id} groupName={selectedGroup?.name} style={{ marginLeft: 10 }} />
                </div>
                <TreeSponsorshipForm
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    group_id={selectedGroup?.id ?? 0}
                    onSubmit={handleFormSubmit}
                />
            </div>
            <Divider sx={{ backgroundColor: "black", marginBottom: '15px', mx: 1 }} />

            {/* <Typography variant="h4" mt={5} ml={1} id="corporate-impact-overview">Corporate Impact Overview</Typography>
            <Typography variant="subtitle1" mb={1} ml={1}>A comprehensive snapshot of your contributions to reforestation and sustainability efforts, including total trees sponsored, plant types supported, acres rejuvenated, and sponsorship progress over time.</Typography>
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'flex-end',
                    marginBottom: '100px',
                }}
            >
                {csrAnalytics && <Box style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}
                >
                    <div className={classes.card}>
                        <Box sx={{ paddingTop: "10px" }}>
                            <Forest fontSize="large" style={{ color: "#53ad7a" }} />
                            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                                {csrAnalytics.sponsored_trees ? csrAnalytics.sponsored_trees : '0'}
                            </Typography>
                            <Typography variant="subtitle2" color="#1f3625">
                                Sponsored Trees
                            </Typography>
                        </Box>
                    </div>
                    <div className={classes.card}>
                        <Box sx={{ paddingTop: "10px" }}>
                            <NaturePeople
                                fontSize="large"
                                style={{ color: "#573D1C" }}
                            />
                            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                                {csrAnalytics.assigned_trees ? csrAnalytics.assigned_trees : '0'}
                            </Typography>
                            <Typography variant="subtitle2" color="#1f3625">
                                Assigned Trees
                            </Typography>
                        </Box>
                    </div>
                    <div className={classes.card}>
                        <Box sx={{ paddingTop: "10px" }}>
                            <GrassTwoTone fontSize="large" style={{ color: "#F94F25" }} />
                            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                                {csrAnalytics.plant_types ? csrAnalytics.plant_types : '0'}
                            </Typography>
                            <Typography variant="subtitle2" color="#1f3625">
                                Plant Types
                            </Typography>
                        </Box>
                    </div>
                    <div className={classes.card}>
                        <Box sx={{ paddingTop: "10px" }}>
                            <ModeOfTravel fontSize="large" style={{ color: "#078085" }} />
                            <Typography variant="h3" color="#fff" sx={{ pt: 1, pb: 1 }}>
                                {csrAnalytics.area ? csrAnalytics.area?.toFixed(2) : '0'}
                            </Typography>
                            <Typography variant="subtitle2" color="#1f3625">
                                Acres Sponsored
                            </Typography>
                        </Box>
                    </div>
                </Box>}

                <Box sx={{ width: '60%' }}>
                    <CSRTreeChart groupId={selectedGroup?.id} />
                </Box>
            </Box>

            <CSRSiteStates groupId={selectedGroup?.id} tags={tags} /> */}
            {/* <Box style={{ marginBottom: '50px' }}>
                <SitesMap />
            </Box> */}
            {/* <CSRPlotStates groupId={selectedGroup?.id} tags={tags} />
            <CSRPlantTypeStats groupId={selectedGroup?.id} />
            <CSRTrees groupId={selectedGroup?.id} /> */}

            {selectedGroup && (
                <CSRGiftTrees
                    groupId={selectedGroup.id}
                    organizationData={{
                        name: selectedGroup.name,
                        address: selectedGroup.address ?? "Address not available",
                        logo_url: selectedGroup.logo_url ?? "/default-logo.png"
                    }}
                    onOrganizationUpdate={handleOrganizationUpdate}
                />
            )}

            {/* {selectedGroup && <CSRGiftRequests groupId={selectedGroup.id} />} */}
        </Box>
    );
};

export default CSRInventory;

const useStyles = makeStyles((theme) =>
    createStyles({
        card: {
            width: "100%",
            maxWidth: "180px",
            minHeight: "170px",
            maxHeight: "260px",
            borderRadius: "15px",
            textAlign: "center",
            padding: "16px",
            margin: "15px",
            background: "linear-gradient(145deg, #9faca3, #bdccc2)",
            // boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
            boxShadow: "7px 7px 14px #9eaaa1,-7px -7px 14px #c4d4c9",
        },
    })
);