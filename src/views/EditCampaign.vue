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