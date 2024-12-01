<template>
    <div class="container-fluid">
        <!-- Full Page Loading State -->
        <div v-if="store.isLoading" class="loading-overlay">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>

        <div v-else>
            <h1 class="mb-4">All Campaigns</h1>

            <div class="search-bar">
                <div class="filter-buttons">
                    <p :class="{ selected: store.selectedFilter === 'All' }" @click="store.setFilter('All')">
                        All ({{ store.totalItems }})
                    </p>
                    <p :class="{ selected: store.selectedFilter === 'Inactive' }" @click="store.setFilter('Inactive')">
                        Inactive ({{ store.inactiveCampaigns }})
                    </p>
                    <p :class="{ selected: store.selectedFilter === 'Active' }" @click="store.setFilter('Active')">
                        Active ({{ store.activeCampaigns }})
                    </p>
                </div>
                
                <div class="search-inputs">
                    <v-text-field v-model="searchQuery" @input="(e) => store.setSearchQuery(searchQuery)" placeholder="Search..." variant="outlined"
                        density="compact" hide-details></v-text-field>

                    <v-text-field v-model="startDate" @input="(e) => store.setStartDate(startDate)" type="date" placeholder="Start Date"
                        variant="outlined" density="compact" hide-details></v-text-field>
                </div>
            </div>

            <!-- Update the table for mobile -->
            <div class="table-responsive mt-4">
                <table class="table table-hover table-bordered align-middle">
                    <thead class="table-light">
                        <tr>
                            <th class="d-none d-sm-table-cell">S/N</th>
                            <th>Campaign Name</th>
                            <th class="d-none d-md-table-cell">Start Date</th>
                            <th>Status</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(campaign, index) in store.paginatedCampaigns" :key="campaign.id">
                            <td class="d-none d-sm-table-cell">{{ getSerialNumber(index) }}</td>
                            <td>{{ campaign.campaignName }}</td>
                            <td class="d-none d-md-table-cell">{{ formatDate(campaign.startDate) }}</td>
                            <td>
                                <span :class="[
                                    'badge',
                                    campaign.campaignStatus === 'Active' ? 'bg-success' : 'bg-danger'
                                ]">
                                    {{ campaign.campaignStatus }}
                                </span>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center gap-2">
                                    <v-btn icon variant="text" :to="{ name: 'ViewCampaign', params: { id: campaign.id } }">
                                        <v-icon>mdi-eye-outline</v-icon>
                                    </v-btn>
                                    <v-btn icon variant="text" :to="{ name: 'EditCampaign', params: { id: campaign.id } }">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon variant="text" @click="store.openDeleteModal(campaign.id)">
                                        <v-icon>mdi-delete-outline</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Vuetify Pagination -->
            <v-container>
                <v-row justify="center">
                    <v-col cols="5" class="d-flex justify-center">
                        <v-pagination v-model="currentPage" :length="store.totalPages" :total-visible="6" class="my-4"
                            rounded="circle" active-color="green" @update:model-value="store.setPage"
                            :disabled="store.totalPages <= 1"></v-pagination>
                    </v-col>
                </v-row>
            </v-container>

            <!-- Vuetify Dialog -->
            <v-dialog v-model="store.showDeleteDialog" max-width="500px">
                <v-card>
                    <v-card-title>Confirm Deletion</v-card-title>
                    <v-card-text class="text-center">
                        <p>Are you sure you want to delete this campaign?</p>
                        <p>This action can't be undone.</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="grey" variant="text" @click="store.closeDeleteDialog">
                            Cancel
                        </v-btn>
                        <v-btn color="error" variant="text" @click="store.confirmDelete">
                            Delete Campaign
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useCampaignStore } from '@/stores/CampaignsStores';

export default {
    setup() {
        const store = useCampaignStore();
        const searchQuery = ref('');
        const startDate = ref(null);
        const currentPage = ref(1);

        const getSerialNumber = (index) => {
            return (store.currentPage - 1) * 10 + index + 1;
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };

        onMounted(async () => {
            await store.fetchCampaigns();
        });

        watch(searchQuery, (newValue) => {
            store.setSearchQuery(newValue);
        });

        return {
            store,
            searchQuery,
            startDate,
            currentPage,
            getSerialNumber,
            formatDate,
        };
        
    }
    
};
</script>

<style scoped>
.container-fluid {
    width: 100%;
    padding: 1rem;
    max-width: 1400px;
    margin: 0 auto;
}

@media (min-width: 768px) {
    .container-fluid {
        width: 90%;
        padding: 2rem;
    }
}

@media (min-width: 1200px) {
    .container-fluid {
        width: 70%;
    }
}

.search-bar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
}

.filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.search-inputs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

@media (min-width: 768px) {
    .search-bar {
        flex-direction: row;
        align-items: center;
    }

    .search-inputs {
        flex-direction: row;
        flex: 1;
    }
}

.search-bar p {
    cursor: pointer;
    padding: 0.5rem 1rem;
    margin: 0;
    border: 1px solid #247B7B;
    border-radius: 10px;
    white-space: nowrap;
    font-size: 0.9rem;
}

@media (min-width: 768px) {
    .search-bar p {
        font-size: 1rem;
    }
}

.table {
    margin-bottom: 0;

}

.table td {
    vertical-align: middle;
}

/* Gap utility for older browsers */
.gap-2 {
    gap: 0.5rem;
}

/* Center the loading spinner */
.v-progress-circular {
    margin: 0 auto;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

/* Add responsive table styles */
.table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.table th, .table td {
    padding: 0.5rem;
}

@media (min-width: 768px) {
    .table th, .table td {
        padding: 0.75rem;
    }
}

/* Ensure buttons are touchable on mobile */
.v-btn {
    min-width: 36px;
    min-height: 36px;
}

.gap-2 {
    gap: 0.5rem !important;
}

.text-center {
    text-align: center;
}

.py-5 {
    padding-top: 3rem;
    padding-bottom: 3rem;
}

.mb-3 {
    margin-bottom: 1rem;
}
</style>