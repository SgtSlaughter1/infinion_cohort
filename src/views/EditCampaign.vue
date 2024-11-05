<template>
    <div class="campaign-info">
        <button @click="goBackToCampaigns" class="back-button">← Back</button>

        <h2>Campaign Information</h2>

        <div v-if="loading" class="loading">
            Loading campaign details...
        </div>

        <div v-else>
            <div class="status-header">
                <span>Campaign Status</span>
                <span :class="statusClass">{{ campaign.campaignStatus }}</span>
            </div>

            <form class="campaign-form details-container" @submit.prevent="saveChanges">
                <div class="detail-group">
                    <label>Campaign Name</label>
                    <div class="input-container">
                        <input type="text" v-model="campaign.campaignName" class="form-control styled-input" required />
                    </div>
                </div>

                <div class="detail-group">
                    <label>Campaign Description</label>
                    <div class="input-container">
                        <input type="text" v-model="campaign.campaignDescription" class="form-control styled-input"
                            required />
                    </div>
                </div>

                <div class="detail-group date-fields">
                    <div>
                        <label>Start Date</label>
                        <div class="input-container">
                            <input type="datetime-local" v-model="campaign.startDate" class="form-control styled-input"
                                required />
                        </div>
                    </div>
                    <div>
                        <label>End Date</label>
                        <div class="input-container">
                            <input type="datetime-local" v-model="campaign.endDate" class="form-control styled-input"
                                required />
                        </div>
                    </div>
                </div>

                <div class="detail-group">
                    <label>Linked Keywords (comma-separated)</label>
                    <div class="input-container">
                        <input type="text" v-model="keywordsInput" class="form-control styled-input"
                            placeholder="Enter keywords separated by commas" />
                    </div>
                </div>

                <div class="detail-group">
                    <label>Campaign Status</label>
                    <div class="input-container">
                        <select v-model="campaign.campaignStatus" class="form-control styled-input">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div class="detail-group">
                    <label>Want to receive daily digest?</label>
                    <div class="input-container">
                        <select v-model="campaign.digestCampaign" class="form-control styled-input">
                            <option :value="true">Yes</option>
                            <option :value="false">No</option>
                        </select>
                    </div>
                </div>

                <div class="detail-group">
                    <label>Daily Digest Frequency</label>
                    <div class="input-container">
                        <select v-model="campaign.dailyDigest" class="form-control styled-input">
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>
                </div>

                <div class="button-group">
                    <button @click.prevent="stopCampaign" class="btn btn-danger mr-2" type="button">Stop
                        Campaign</button>
                    <button class="btn btn-primary" type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { campaignApi } from '@/services/campaignApi';
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            campaign: {
                id: 0,
                campaignName: '',
                campaignDescription: '',
                startDate: '',
                endDate: '',
                campaignStatus: 'Active',
                digestCampaign: false,
                linkedKeywords: [],
                dailyDigest: 'Daily'
            },
            keywordsInput: '',
            loading: true,
            error: null
        };
    },

    computed: {
        statusClass() {
            return this.campaign.campaignStatus === 'Active' ? 'text-success' : 'text-danger';
        }
    },
    methods: {
        async fetchCampaignDetails() {
            this.loading = true;
            console.log('Fetching details for campaign ID:', this.id);
            try {
                const response = await fetch(`https://infinion-test-int-test.azurewebsites.net/api/Campaign/${this.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch campaign details');
                }
                const data = await response.json();
                console.log('Fetched campaign data:', data);

                // Convert datetime strings to local datetime-local input format
                const formatDateTime = (dateStr) => {
                    if (!dateStr) return '';
                    return new Date(dateStr).toISOString().slice(0, 16);
                };

                // Set keywords input
                this.keywordsInput = Array.isArray(data.linkedKeywords)
                    ? data.linkedKeywords.join(', ')
                    : '';

                this.campaign = {
                    id: data.id || 0,
                    campaignName: data.campaignName || '',
                    campaignDescription: data.campaignDescription || '',
                    startDate: formatDateTime(data.startDate),
                    endDate: formatDateTime(data.endDate),
                    campaignStatus: data.campaignStatus || 'Active',
                    digestCampaign: Boolean(data.digestCampaign),
                    linkedKeywords: Array.isArray(data.linkedKeywords) ? data.linkedKeywords : [],
                    dailyDigest: data.dailyDigest || 'Daily'
                };

                console.log('Campaign ID set to:', this.id);
            } catch (error) {
                console.error("Error fetching campaign details:", error);
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async saveChanges() {
    try {
        if (!this.validateForm()) {
            return; 
        }

        const updatedCampaign = {
            id: this.id,
            campaignName: this.campaign.campaignName,
            campaignDescription: this.campaign.campaignDescription,
            startDate: new Date(this.campaign.startDate).toISOString(),
            endDate: new Date(this.campaign.endDate).toISOString(),
            linkedKeywords: this.keywordsInput
                .split(',')
                .map(keyword => keyword.trim())
                .filter(keyword => keyword.length > 0),
            campaignStatus: this.campaign.campaignStatus,
            digestCampaign: this.campaign.digestCampaign,
            dailyDigest: this.campaign.dailyDigest
        };

        console.log('Sending data:', JSON.stringify(updatedCampaign, null, 2));

        const response = await fetch(`https://infinion-test-int-test.azurewebsites.net/api/CampaignStatus/${this.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json" // Use application/json for accept header if expecting JSON
            },
            body: JSON.stringify(updatedCampaign),
        });

        // Log the raw response text for debugging
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (!response.ok) {
            let errorMessage;
            try {
                // Attempt to parse as JSON first
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || 'Failed to update campaign';
            } catch (e) {
                errorMessage = responseText; // If parsing fails, use the raw response
            }
            throw new Error(errorMessage);
        }

        alert('Campaign updated successfully!');
        this.goBackToCampaigns();

        // Log ID after successful update
        console.log('ID in URL:', this.id);
        console.log('ID in request body:', updatedCampaign.id); 
    } catch (error) {
        console.error("Error updating campaign:", error);
        alert(error.message || 'Failed to update campaign');
    }
},


        validateForm() {
            if (!this.campaign.campaignName?.trim()) {
                alert('Campaign name is required');
                return false;
            }
            if (!this.campaign.startDate) {
                alert('Start date is required');
                return false;
            }
            if (!this.campaign.endDate) {
                alert('End date is required');
                return false;
            }
            if (new Date(this.campaign.endDate) < new Date(this.campaign.startDate)) {
                alert('End date must be after start date');
                return false;
            }
            return true;
        },
        stopCampaign() {
            if (confirm('Are you sure you want to stop this campaign?')) {
                this.campaign.campaignStatus = "Inactive";
                this.saveChanges();
            }
        },
        goBackToCampaigns() {
            this.$router.push({ name: 'AllCampaigns' });
        }
    },
    mounted() {
        console.log('Campaign ID received:', this.id);
        this.fetchCampaignDetails();
    },
    watch: {
        '$route.params.id': 'fetchCampaignDetails'
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
    /* background: #f8f9fa; */
    padding: 20px;
    /* border-radius: 8px; */
    /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); */
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

.input-container {
    background: white;
    border-radius: 4px;
    border: 1px solid #ddd;
    padding: 0;
    transition: border-color 0.2s;
}

.input-container:focus-within {
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
}

.styled-input {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
    width: 100%;
    padding: 8px 12px;
}

.styled-input:focus {
    outline: none;
}

.date-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.text-success {
    color: #28a745;
    font-weight: 600;
}

.text-danger {
    color: #dc3545;
    font-weight: 600;
}

.button-group {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.loading {
    text-align: center;
    padding: 20px;
    color: #666;
}

.btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
}

.btn-primary {
    background-color: #0066cc;
    border-color: #0066cc;
}

.btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
}
</style>