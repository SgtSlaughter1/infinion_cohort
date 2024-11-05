import { api } from './api';

export const campaignApi = {
    // Get all campaigns
    async getAllCampaigns() {
        return api.fetch('/Campaign');
    },

    // Get campaign by ID
    async getCampaignById(id) {
        return api.fetch(`/Campaign/${id}`);
    },

    // Update campaign
    async updateCampaignStatus(id, status) {
        try {
            const response = await api.fetch(`/CampaignStatus/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ campaignStatus: status }),
            });
            console.log('Status update response:', response);
            return response;
        } catch (error) {
            console.error('Error in updateCampaignStatus:', error);
            throw error;
        }
    },

    // Delete campaign
    async deleteCampaign(id) {
        return api.fetch(`/Campaign/${id}`, {
            method: 'DELETE',
        });
    },

    // Update campaign status
    async updateCampaignStatus(id, status) {
        return api.fetch(`/CampaignStatus/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }
};
