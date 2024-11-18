<template>
    <div class="campaign-info">
        <button @click="goBack" class="back-button">← Back</button>
        <h2>Campaign Information</h2>

        <div v-if="store.isLoading">Loading campaign details...</div>

        <div v-else>
            <div class="status-header">
                <span>Campaign Status</span>
                <span :class="campaign.campaignStatus === 'Active' ? 'text-success' : 'text-danger'">
                    {{ campaign.campaignStatus }}
                </span>
            </div>

            <form @submit.prevent="saveCampaign">
                <div class="detail-group">
                    <label>Campaign Name</label>
                    <input v-model="campaign.campaignName" required class="styled-input" />
                </div>

                <div class="detail-group">
                    <label>Campaign Description</label>
                    <input v-model="campaign.campaignDescription" required class="styled-input" />
                </div>

                <div class="detail-group date-fields">
                    <div>
                        <label>Start Date</label>
                        <input type="datetime-local" v-model="campaign.startDate" required class="styled-input" />
                    </div>
                    <div>
                        <label>End Date</label>
                        <input type="datetime-local" v-model="campaign.endDate" required class="styled-input" />
                    </div>
                </div>

                <div class="detail-group">
                    <label>Keywords (comma-separated)</label>
                    <input v-model="keywordsInput" class="styled-input" placeholder="Enter keywords separated by commas" />
                </div>

                <div class="detail-group">
                    <label>Campaign Status</label>
                    <select v-model="campaign.campaignStatus" class="styled-input" @change="handleStatusChange">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div class="detail-group">
                    <label>Want to receive daily digest?</label>
                    <select v-model="campaign.digestCampaign" class="styled-input">
                        <option :value="true">Yes</option>
                        <option :value="false">No</option>
                    </select>
                </div>

                <div class="detail-group">
                    <label>Daily Digest Frequency</label>
                    <select v-model="campaign.dailyDigest" class="styled-input">
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                    </select>
                </div>

                <div class="button-group">
                    <button @click.prevent="stopCampaign" class="btn btn-danger">Stop Campaign</button>
                    <button type="submit" class="btn">Save Changes</button>
                </div>
            </form>

            <div v-if="store.error" class="alert alert-danger">{{ store.error }}</div>

            <div v-if="store.showSuccessModal" class="modal">
                <div class="modal-content">
                    <h4>Success!</h4>
                    <p>Your changes have been saved successfully.</p>
                    <button class="btn" @click="closeModal">OK</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useCampaignStore } from '@/stores/CampaignsStores';

export default {
    data() {
        return {
            campaign: {
                id: '',
                campaignName: '',
                campaignDescription: '',
                startDate: '',
                endDate: '',
                linkedKeywords: [],
                campaignStatus: 'Active',
                digestCampaign: false,
                dailyDigest: 'Daily',
            },
            keywordsInput: '',
        };
    },

    setup() {
        const store = useCampaignStore();
        return { store };
    },

    async created() {
        await this.loadCampaign();
    },

    methods: {
        async loadCampaign() {
            const campaign = await this.store.loadCampaign(this.$route.params.id);
            if (campaign) {
                this.campaign = { ...campaign };
                this.keywordsInput = campaign.linkedKeywords.join(', ');
            }
        },

        async saveCampaign() {
            const campaignData = {
                ...this.campaign,
                linkedKeywords: this.keywordsInput
                    .split(',')
                    .map(k => k.trim())
                    .filter(k => k)
            };

            const success = await this.store.saveCampaignChanges(campaignData);
            if (success) {
                this.showSuccessModal = true;
            }
        },

        async handleStatusChange() {
            await this.store.updateCampaignStatus(this.campaign.id, this.campaign.campaignStatus);
        },

        async stopCampaign() {
            await this.store.stopCampaign(this.campaign.id);
        },

        goBack() {
            this.$router.push({ name: 'AllCampaigns' });
        },

        closeModal() {
            this.store.setShowSuccessModal(false);
            this.goBack();
        },
    },
};
</script>


<style scoped>
.campaign-info {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}

.styled-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
}

.date-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.detail-group {
    margin-bottom: 15px;
}

.detail-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.status-header {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    background: #f5f5f5;
    padding: 10px;
    border-radius: 4px;
}

.btn {
    padding: 8px 16px;
    border-radius: 4px;
    color: white;
    border: none;
    cursor: pointer;
    background-color: #247B7B;
}

.btn-danger {
    background-color: #dc3545;
}

.button-group {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.text-success { color: green; }
.text-danger { color: red; }

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 4px;
    text-align: center;
    width: 50%;
}

@media (max-width: 600px) {
    .date-fields {
        grid-template-columns: 1fr;
    }

    .button-group {
        flex-direction: column;
    }
}
</style>