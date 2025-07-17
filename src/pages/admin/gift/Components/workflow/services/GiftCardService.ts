import { toast } from "react-toastify";
import ApiClient from "../../../../../../api/apiClient/apiClient";
import { GiftCard } from "../../../../../../types/gift_card";
import { User } from "../../../../../../types/user";
import { Group } from "../../../../../../types/Group";
import { Payment } from "../../../../../../types/payment";
import { GiftCardFormMessages } from "../types/GiftCardFormTypes";

export class GiftCardService {
    private apiClient: ApiClient;

    constructor() {
        this.apiClient = new ApiClient();
    }

    async getGiftCardRequestDetails(giftCardRequest: GiftCard) {
        try {
            const results = {
                user: null as User | null,
                sponsor: null as User | null,
                group: null as Group | null,
                users: [] as any[],
                messages: {
                    primaryMessage: "",
                    eventName: "",
                    eventType: undefined as string | undefined,
                    plantedBy: "",
                    logoMessage: ""
                } as GiftCardFormMessages,
                treeCount: 1,
                category: "Public",
                grove: null as string | null,
                logoString: null as string | null,
                giftedOn: new Date().toISOString().slice(0, 10),
                giftRequestType: "Gift Cards",
                payment: null as Payment | null,
                panNumber: null as string | null,
                consent: false
            };

            // Get user and sponsor details
            const userResp = await this.apiClient.getUsers(0, 1, [{ 
                columnField: 'id', 
                operatorValue: 'isAnyOf', 
                value: [giftCardRequest.user_id, giftCardRequest.sponsor_id] 
            }]);

            results.user = userResp.results.find(user => user.id === giftCardRequest.user_id) || null;
            results.sponsor = userResp.results.find(user => user.id === giftCardRequest.sponsor_id) || null;

            // Get group details
            if (giftCardRequest.group_id) {
                const groupResp = await this.apiClient.getGroups(0, 1, [{ 
                    columnField: 'id', 
                    operatorValue: 'equals', 
                    value: giftCardRequest.group_id 
                }]);
                
                if (groupResp.results.length === 1) {
                    results.group = groupResp.results[0];
                    results.logoString = groupResp.results[0].logo_url;
                }
            }

            // Get gift request users
            const users = await this.apiClient.getGiftRequestUsers(giftCardRequest.id);
            const usersData: any[] = [];
            
            for (const user of users) {
                usersData.push({
                    ...user,
                    key: user.id,
                    image: user.profile_image_url ? true : undefined,
                    image_name: user.profile_image_url ? user.profile_image_url.split("/").slice(-1)[0] : undefined,
                    image_url: user.profile_image_url,
                    editable: true,
                });
            }

            results.users = usersData;
            results.treeCount = giftCardRequest.no_of_cards;
            results.category = giftCardRequest.category || "Public";
            results.grove = giftCardRequest.grove || null;
            results.logoString = giftCardRequest.logo_url;
            results.giftedOn = giftCardRequest.gifted_on;
            
            if (giftCardRequest.request_type) {
                results.giftRequestType = giftCardRequest.request_type;
            }

            results.messages = {
                primaryMessage: giftCardRequest.primary_message,
                eventName: giftCardRequest.event_name || '',
                plantedBy: giftCardRequest.planted_by || '',
                logoMessage: giftCardRequest.logo_message,
                eventType: giftCardRequest.event_type || undefined
            };

            // Get payment details
            if (giftCardRequest.payment_id) {
                const payment = await this.apiClient.getPayment(giftCardRequest.payment_id);
                results.payment = payment;
                results.panNumber = payment.pan_number;
                results.consent = payment.consent ? payment.consent : false;
            }

            return results;
        } catch (error) {
            console.error('Failed to fetch gift card request details:', error);
            toast.error('Failed to load gift card request details');
            throw error;
        }
    }

    async getCreatorUser(createdBy: number): Promise<User | null> {
        try {
            const createdByResp = await this.apiClient.getUsers(0, 1, [{
                columnField: 'id',
                operatorValue: 'equals',
                value: createdBy
            }]);
            
            return createdByResp.results[0] || null;
        } catch (error) {
            console.error('Failed to fetch creator:', error);
            toast.error('Failed to load creator details');
            return null;
        }
    }

    async createPayment(amount: number, donorType: string, panNumber: string | null, consent: boolean): Promise<Payment> {
        return await this.apiClient.createPayment(amount, donorType, panNumber, consent);
    }

    async updatePayment(payment: Payment): Promise<void> {
        await this.apiClient.updatedPayment(payment);
    }

    async updateGroup(group: Group): Promise<void> {
        await this.apiClient.updateGroup(group);
    }
}