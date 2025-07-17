import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/store/hooks';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as giftCardActionCreators from '../../../../redux/actions/giftCardActions';
import { RootState } from '../../../../redux/store/store';
import { GiftCard } from '../../../../types/gift_card';
import { GridFilterItem } from '@mui/x-data-grid';
import { UserRoles, Order } from '../../../../types/common';
import { useAuth } from '../../auth/auth';
import ApiClient from '../../../../api/apiClient/apiClient';
import { toast } from 'react-toastify';
import { pendingPlotSelection } from '../config/tableColumns';

interface UseGiftCardDataProps {
    filters: Record<string, GridFilterItem>;
    orderBy: Order[];
    page: number;
    pageSize: number;
    setTableRows: (rows: GiftCard[]) => void;
    setTags: (tags: string[]) => void;
    setCorporateCount: (count: number) => void;
    setPersonalCount: (count: number) => void;
}

export const useGiftCardData = ({
    filters,
    orderBy,
    page,
    pageSize,
    setTableRows,
    setTags,
    setCorporateCount,
    setPersonalCount
}: UseGiftCardDataProps) => {
    const dispatch = useAppDispatch();
    const { getGiftCards, deleteGiftCardRequest, cloneGiftCardRequest } =
        bindActionCreators(giftCardActionCreators, dispatch);

    const auth = useAuth();
    const authRef = useRef<any>(null);

    const giftCardsData = useAppSelector((state: RootState) => state.giftCardsData);
    
    let giftCards: GiftCard[] = [];
    if (giftCardsData) {
        giftCards = Object.values(giftCardsData.giftCards);
        giftCards = giftCards.sort((a, b) => b.id - a.id);
    }

    // Update auth ref
    useEffect(() => {
        authRef.current = auth;
    }, [auth]);

    // Load tags
    useEffect(() => {
        const getTags = async () => {
            try {
                const apiClient = new ApiClient();
                const tagsResp = await apiClient.getGiftRequestTags();
                setTags(tagsResp.results);
            } catch (error: any) {
                toast.error(error.message);
            }
        };

        getTags();
    }, [setTags]);

    // Update chart data
    useEffect(() => {
        if (!giftCards || !Array.isArray(giftCards)) return;

        const corporate = giftCards.filter(card => card.group_name && card.group_name !== 'Personal').length || 0;
        const personal = giftCards.filter(card => !card.group_name || card.group_name === 'Personal').length || 0;

        setCorporateCount(corporate);
        setPersonalCount(personal);
    }, [giftCards, setCorporateCount, setPersonalCount]);

    const getFilters = (filters: any) => {
        const filtersData = JSON.parse(JSON.stringify(Object.values(filters))) as GridFilterItem[];
        filtersData.forEach((item) => {
            if (item.columnField === 'status') {
                item.value = (item.value as string[]).map(value => {
                    if (value === pendingPlotSelection) return 'pending_plot_selection';
                    else if (value === 'Pending assignment') return 'pending_assignment';
                    else return 'completed'
                })
            } else if (item.columnField === 'validation_errors' || item.columnField === 'notes') {
                if ((item.value as string[]).includes('Yes')) {
                    item.operatorValue = 'isNotEmpty';
                } else {
                    item.operatorValue = 'isEmpty'
                }
            }
        });

        // if normal user then fetch user specific data
        if (authRef.current?.roles?.includes(UserRoles.User) && authRef.current?.userId) {
            filtersData.push({
                columnField: 'user_id',
                operatorValue: 'equals',
                value: authRef.current.userId
            });
        }

        return filtersData;
    };

    const getGiftCardData = async () => {
        // check if user logged in (skip if VITE_BYPASS_AUTH is enabled)
        if (!authRef.current?.signedin && import.meta.env.VITE_BYPASS_AUTH !== 'true') return;

        const filtersData = getFilters(filters);
        getGiftCards(page * pageSize, pageSize, filtersData, orderBy);
    };

    const getAllGiftCardsData = async () => {
        const filtersData = getFilters(filters);
        const apiClient = new ApiClient();
        const resp = await apiClient.getGiftCards(0, -1, filtersData, orderBy);
        return resp.results;
    };

    // Load gift card data when filters/order changes
    useEffect(() => {
        const handler = setTimeout(() => {
            getGiftCardData();
        }, 300);

        return () => { clearTimeout(handler) };
    }, [filters, orderBy, auth]);

    // Update table rows when pagination changes
    useEffect(() => {
        const handler = setTimeout(() => {
            if (giftCardsData.loading) return;

            const records: GiftCard[] = [];
            const maxLength = Math.min((page + 1) * pageSize, giftCardsData.totalGiftCards);
            for (let i = page * pageSize; i < maxLength; i++) {
                if (!Object.hasOwn(giftCardsData.paginationMapping, i)) {
                    getGiftCardData();
                    break;
                }

                const id = giftCardsData.paginationMapping[i];
                const record = giftCardsData.giftCards[id];
                if (record) records.push(record);
            }

            setTableRows(records);
        }, 300);

        return () => { clearTimeout(handler) };
    }, [pageSize, page, giftCardsData, setTableRows]);

    return {
        giftCards,
        giftCardsData,
        authRef,
        getGiftCardData,
        getAllGiftCardsData,
        deleteGiftCardRequest,
        cloneGiftCardRequest,
        dispatch
    };
};