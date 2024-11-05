<template>
    <div class="campaign-info">
        <button @click="goBackToCampaigns" class="back-button">← Back</button>

        <h2>Campaign Details</h2>

        <div v-if="loading" class="loading">
            Loading campaign details...
        </div>

        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <div v-else class="campaign-details">
            <div class="status-header">
                <span>Campaign Status</span>
                <span :class="statusClass">{{ campaign.campaignStatus }}</span>
            </div>

            <div class="details-container">
                <div class="detail-group">
                    <label>Campaign Name</label>
                    <div class="detail-value">{{ campaign.campaignName }}</div>
                </div>

                <div class="detail-group">
                    <label>Campaign Description</label>
                    <div class="detail-value">{{ campaign.campaignDescription }}</div>
                </div>

                <div class="detail-group date-fields">
                    <div>
                        <label>Start Date</label>
                        <div class="detail-value">{{ formatDate(campaign.startDate) }}</div>
                    </div>
                    <div>
                        <label>End Date</label>
                        <div class="detail-value">{{ formatDate(campaign.endDate) }}</div>
                    </div>
                </div>

                <div class="detail-group">
                    <label>Linked Keywords</label>
                    <div class="detail-value">
                        <span v-if="campaign.linkedKeywords && campaign.linkedKeywords.length">
                            {{ campaign.linkedKeywords.join(', ') }}
                        </span>
                        <span v-else>No keywords linked</span>
                    </div>
                </div>

                <div class="detail-group">
                    <label>Campaign Status</label>
                    <div class="detail-value">{{ campaign.campaignStatus }}</div>
                </div>

                <div class="detail-group">
                    <label>Daily Digest</label>
                    <div class="detail-value">{{ campaign.digestCampaign ? 'Yes' : 'No' }}</div>
                </div>

                <div class="detail-group">
                    <label>Digest Frequency</label>
                    <div class="detail-value">{{ campaign.dailyDigest }}</div>
                </div>
            </div>

            <div class="button-group">
                <button @click="goBackToCampaigns" class="btn btn-primary">Back to Campaigns</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useCampaignStore } from '@/stores/campaignStore';
import { computed } from 'vue';

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            campaignStore: useCampaignStore(),
        };
    },
    computed: {
        campaign() {
            return this.campaignStore.currentCampaign;
        },
        loading() {
            return this.campaignStore.loading;
        },
        error() {
            return this.campaignStore.error;
        },
        statusClass() {
            return this.campaign && this.campaign.campaignStatus === 'Active' ? 'text-success' : 'text-danger';
        }
    },
    methods: {
        async fetchCampaignDetails() {
            await this.campaignStore.fetchCampaignById(this.id);
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleString();
        },
        goBackToCampaigns() {
            this.$router.push({ name: 'AllCampaigns' });
        }
    },
    mounted() {
        this.fetchCampaignDetails();
    },
    watch: {
        id: 'fetchCampaignDetails'
    }
};
</script>



<style scoped>
.campaign-info {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
}
h2 {
    color: #247B7B;
}

input {
    cursor: disabled;
}
.back-button {
    border: none;
    background: none;
    color: #0066cc;
    font-size: 1.1em;
    padding: 10px 0;
    cursor: pointer;
}

.status-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.details-container {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
}

.detail-group {
    margin-bottom: 20px;
}

.detail-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 5px;
    color: #666;
}

.detail-value {
    padding: 8px;
    background: white;
    border-radius: 4px;
    border: 1px solid #ddd;
    min-height: 38px;
}

.date-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.text-success {
    color: #28a745;
}

.text-danger {
    color: #dc3545;
}

.button-group {
    margin-top: 20px;
    text-align: right;
}

.loading {
    text-align: center;
    padding: 20px;
    color: #666;
}
</style>