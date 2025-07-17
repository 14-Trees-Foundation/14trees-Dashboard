import { toast } from 'react-toastify';
import ApiClient from '../../../../api/apiClient/apiClient';
import { GiftCard, GiftRequestType_CARDS_REQUEST } from '../../../../types/gift_card';
import { User } from '../../../../types/user';
import { Group } from '../../../../types/Group';
import giftCardActionTypes from '../../../../redux/actionTypes/giftCardActionTypes';

export class GiftCardService {
    private apiClient: ApiClient;

    constructor() {
        this.apiClient = new ApiClient();
    }

    async saveNewGiftCardsRequest(
        requestId: string,
        user: User,
        sponsor: User | null,
        createdBy: User,
        group: Group | null,
        treeCount: number,
        category: string,
        grove: string | null,
        requestType: string,
        users: any[],
        giftedOn: string,
        paymentId?: number,
        logo?: string,
        messages?: any,
        file?: File
    ): Promise<number | null> {
        try {
            const response = await this.apiClient.createGiftCard(
                requestId,
                createdBy.id,
                treeCount,
                user.id,
                sponsor?.id || null,
                category,
                grove,
                requestType,
                giftedOn,
                group?.id,
                paymentId,
                logo,
                messages,
                file
            );
            return response.id;
        } catch (error) {
            toast.error("Failed to create gift card");
            return null;
        }
    }

    async updateGiftCardRequest(
        selectedGiftCard: GiftCard,
        user: User,
        sponsor: User | null,
        createdBy: User,
        group: Group | null,
        treeCount: number,
        category: string,
        grove: string | null,
        requestType: string,
        giftedOn: string,
        paymentId?: number,
        logo?: string,
        messages?: any,
        file?: File
    ): Promise<GiftCard | null> {
        try {
            const data = { ...selectedGiftCard };
            data.created_by = createdBy.id;
            const response = await this.apiClient.updateGiftCard(
                data,
                treeCount,
                user.id,
                sponsor?.id || null,
                category,
                grove,
                requestType,
                giftedOn,
                group?.id,
                paymentId,
                logo,
                messages,
                file
            );

            toast.success("Tree Request updated successfully");
            return response;
        } catch (error) {
            toast.error("Failed to update tree card request");
            return null;
        }
    }

    async upsertGiftCardUsers(giftCardId: number, users: any[]): Promise<GiftCard | null> {
        if (users.length === 0) return null;

        try {
            const response = await this.apiClient.upsertGiftCardUsers(giftCardId, users);
            toast.success("Tree cards requested!");
            return response;
        } catch (error: any) {
            toast.error(error.message || "Failed to create tree card users");
            return null;
        }
    }

    processEmailsForUsers(users: any[], sponsor: User | null, user: User): any[] {
        const updatedUsers: any[] = [];
        if (users && users.length > 0) {
            users.forEach(item => {
                const updated = { ...item };
                const donorName = (sponsor?.name || user.name).trim().toLowerCase().replaceAll(" ", '');
                
                if (updated.recipient_email.includes(".donor")) {
                    updated.recipient_email = updated.recipient_email.replace(".donor", "." + donorName);
                }

                if (updated.assignee_email.includes(".donor")) {
                    updated.assignee_email = updated.assignee_email.replace(".donor", "." + donorName);
                }

                updatedUsers.push(updated);
            });
        }
        return updatedUsers;
    }

    async handleSubmit(
        changeMode: 'add' | 'edit',
        requestId: string | null,
        selectedGiftCard: GiftCard | null,
        user: User,
        sponsor: User | null,
        createdBy: User,
        group: Group | null,
        treeCount: number,
        category: string,
        grove: string | null,
        requestType: string,
        users: any[],
        giftedOn: string,
        dispatch: any,
        paymentId?: number,
        logo?: string,
        messages?: any,
        file?: File
    ): Promise<boolean> {
        if (!requestId && changeMode === 'add') {
            toast.error("Something went wrong. Please try again later!");
            return false;
        }

        const updatedUsers = this.processEmailsForUsers(users, sponsor, user);

        if (changeMode === 'add') {
            const giftCardId = await this.saveNewGiftCardsRequest(
                requestId!,
                user,
                sponsor,
                createdBy,
                group,
                treeCount,
                category,
                grove,
                requestType,
                updatedUsers,
                giftedOn,
                paymentId,
                logo,
                messages,
                file
            );

            if (giftCardId) {
                const response = await this.upsertGiftCardUsers(giftCardId, updatedUsers);
                if (response) {
                    dispatch({
                        type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                        payload: response,
                    });
                }
                return true;
            }
        } else if (changeMode === 'edit' && selectedGiftCard) {
            const response = await this.updateGiftCardRequest(
                selectedGiftCard,
                user,
                sponsor,
                createdBy,
                group,
                treeCount,
                category,
                grove,
                requestType,
                giftedOn,
                paymentId,
                logo,
                messages,
                file
            );

            if (response) {
                dispatch({
                    type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                    payload: response,
                });

                const userResponse = await this.upsertGiftCardUsers(selectedGiftCard.id, updatedUsers);
                if (userResponse) {
                    dispatch({
                        type: giftCardActionTypes.UPDATE_GIFT_CARD_SUCCEEDED,
                        payload: userResponse,
                    });
                }
                return true;
            }
        }

        return false;
    }
}