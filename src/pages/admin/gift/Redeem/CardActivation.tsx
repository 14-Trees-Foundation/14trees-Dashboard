import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { User } from "../../../../types/user";
import { useAppDispatch, useAppSelector } from "../../../../redux/store/hooks";
import { bindActionCreators } from "@reduxjs/toolkit";
import * as userActionCreators from '../../../../redux/actions/userActions';
import { AutocompleteWithPagination } from "../../../../components/AutoComplete";
import ApiClient from "../../../../api/apiClient/apiClient";
import { GiftCardUser } from "../../../../types/gift_card";

interface CardActivationProps {
    giftCardUser: GiftCardUser
    onUserChange: (user: User | null) => void
}

const CardActivation: FC<CardActivationProps> = ({ giftCardUser, onUserChange }) => {

    const dispatch = useAppDispatch();
    const { searchUsers } = bindActionCreators(userActionCreators, dispatch);

    const formDataRef = useRef({
        user: null as User | null,
        content1: '',
        content2: '',
    });
    const slideIdRef = useRef('');
    const [formOption, setFormOption] = useState<"existing" | "new">("existing");
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [record, setRecord] = useState({
        content1: "We are immensely delighted to share that a tree has been planted in your name at the 14 Trees Foundation, Pune. This tree will be nurtured in your honour, rejuvenating ecosystems, supporting biodiversity, and helping offset the harmful effects of climate change.",
        content2: "We invite you to visit 14 Trees and firsthand experience the growth and contribution of your tree towards a greener future.",
    })

    const [iframeSrc, setIframeSrc] = useState<string | null>(null);

    let users: User[] = [];
    const usersData = useAppSelector((state) => state.searchUsersData);
    if (usersData) {
        users = Object.values(usersData.users);
    }

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        birth_date: '',
    });

    useEffect(() => {
        formDataRef.current = {
            user: selectedUser,
            content1: record.content1,
            content2: record.content2
        }
    }, [record, selectedUser]);

    // const updateSlide = async () => {
    //     if (!slideIdRef.current) {
    //         return;
    //     }
    //     const apiClient = new ApiClient();
    //     await apiClient.updateGiftCardTemplate(giftCardUser.id, formDataRef.current.content1, formDataRef.current.content2, formDataRef.current.user ?? undefined);
    //     setIframeSrc(
    //         `https://docs.google.com/presentation/d/1s4aBSIMEgdD_gjs5g1a0a9Wx8zhsXowqYFr_vv1JVhk/embed?rm=minimal&slide=id.${slideIdRef.current}&timestamp=${new Date().getTime()}`
    //     );
    // }

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         updateSlide();
    //     }, 5000);

    //     return () => clearInterval(interval);
    // }, [])

    // useEffect(() => {
    //     const generateGiftCard = async () => {
    //         const apiClient = new ApiClient();
    //         const resp = await apiClient.generateCardForUser(giftCardUser.id, giftCardUser.sapling_id || '', record.content1, record.content2, selectedUser ?? undefined);
    //         slideIdRef.current = resp;
    //         setIframeSrc(
    //             `https://docs.google.com/presentation/d/1s4aBSIMEgdD_gjs5g1a0a9Wx8zhsXowqYFr_vv1JVhk/embed?rm=minimal&slide=id.${resp}&timestamp=${new Date().getTime()}`
    //         )
    //     }

    //     generateGiftCard();
    // }, [])

    useEffect(() => {
        onUserChange(selectedUser);

        if (!selectedUser) return;
        setFormOption('existing')
    }, [selectedUser])

    useEffect(() => {
        if (!giftCardUser) return;

        const getUser = async (userId: number) => {
            const apiClient = new ApiClient();
            const resp = await apiClient.getUsers(0, 1, [{ columnField: 'id', operatorValue: 'equals', value: userId }]);
            if (resp.results.length === 1) {
                setSelectedUser(resp.results[0]);
            }
        }

        if (giftCardUser?.user_id) {
            getUser(giftCardUser.user_id);
            setRecord(prev => ({
                ...prev,
                NAME: giftCardUser.user_name || '',
                SAPLING: giftCardUser.sapling_id || '',
            }))
        }
    }, [giftCardUser])

    useEffect(() => {
        if (userSearchQuery.length >= 3) searchUsers(userSearchQuery);
    }, [userSearchQuery])

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleCreateUserSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const apiClient = new ApiClient();
        const saveUser = async () => {
            const user = await apiClient.createUser(formData as any);
            if (user) {
                setSelectedUser(user);
            }
        }

        saveUser();
    }

    return (
        <div style={{ margin: 10, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                {formOption === 'existing' && <Box>
                    <Typography variant='body1'>Let's check whether you exist in the system</Typography>
                    <AutocompleteWithPagination
                        label="Enter your name or email to search"
                        value={selectedUser}
                        options={users}
                        getOptionLabel={user => `${user.name} (${user.email})`}
                        onChange={(event, value: User) => setSelectedUser(value)}
                        onInputChange={(event) => { setUserSearchQuery(event.target.value) }}
                        fullWidth
                        size="medium"
                    />
                    <Typography variant="body1">Couldn't find yourself in the system? <Typography color="primary" onClick={() => setFormOption('new')} variant="body1" component="span">Register your self</Typography>.</Typography>

                    <TextField
                        name="content1"
                        label="Message"
                        required
                        value={record.content1}
                        onChange={(e) => setRecord(prev => ({ ...prev, content1: e.target.value }))}
                        fullWidth
                        multiline
                        style={{ marginTop: 10 }}
                    />

                    <TextField
                        name="content2"
                        label="Message"
                        required
                        value={record.content2}
                        onChange={(e) => setRecord(prev => ({ ...prev, content2: e.target.value }))}
                        fullWidth
                        multiline
                        style={{ marginTop: 10 }}
                    />
                </Box>}

                {formOption === 'new' && <Box>
                    <Typography variant="body1">Register User</Typography>
                    <form onSubmit={handleCreateUserSubmit}>
                        <Grid container rowSpacing={2} columnSpacing={1} >
                            <Grid item xs={12}>
                                <TextField name="name" label="Name" required value={formData.name} onChange={handleInputChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="phone" label="Phone" value={formData.phone} onChange={handleInputChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="email" label="Email" required value={formData.email} onChange={handleInputChange} fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="birth_date" label="Date of Birth" type="date" value={formData.birth_date ? formData.birth_date.substring(0, 10) : ''} onChange={handleInputChange} InputLabelProps={{ shrink: true }} fullWidth />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', }}>
                                <Button variant='contained' color='success' type="submit" sx={{ marginLeft: '10px' }}>Register</Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Typography variant="body1">Already registered? <Typography onClick={() => setFormOption('existing')} color='primary' variant="body1" component="span">Select User</Typography>.</Typography>
                </Box>}
            </div>
            {iframeSrc && <iframe
                src={iframeSrc}
                width="800"
                height="600"
                allowFullScreen
            ></iframe>}
        </div>
    )
}

export default CardActivation;