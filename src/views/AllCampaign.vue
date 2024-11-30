<template>
    <div class="container-fluid">
        <h1 class="mb-4 responsive-heading">All Campaigns</h1>

        <!-- Show loading state -->
        <div v-if="store.isLoading" class="d-flex justify-content-center align-items-center loading-container">
            <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
        </div>

        <!-- Show content only when not loading -->
        <div v-else>
            <div class="search-bar flex-wrap">
                <div class="filters d-flex flex-wrap gap-2 mb-2">
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
                
                <div class="search-inputs d-flex flex-wrap gap-2">
                    <v-text-field v-model="searchQuery" 
                        @input="store.setSearchQuery" 
                        placeholder="Search..." 
                        variant="outlined"
                        density="compact" 
                        class="search-field" 
                        hide-details>
                    </v-text-field>

                    <v-text-field v-model="startDate" 
                        @input="store.setStartDate" 
                        type="date" 
                        placeholder="Start Date"
                        variant="outlined" 
                        density="compact" 
                        class="date-field" 
                        hide-details>
                    </v-text-field>
                </div>
            </div>

            <div class="table-responsive mt-4">
                <table class="table table-hover table-bordered align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>S/N</th>
                            <th>Campaign Name</th>
                            <th>Start Date</th>
                            <th>Status</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(campaign, index) in store.paginatedCampaigns" :key="campaign.id">
                            <td>{{ getSerialNumber(index) }}</td>
                            <td>{{ campaign.campaignName }}</td>
                            <td>{{ formatDate(campaign.startDate) }}</td>
                            <td>
                                <span :class="[
                                    'badge',
                                    campaign.campaignStatus === 'Active' ? 'bg-success' : 'bg-danger'
                                ]">
                                    {{ campaign.campaignStatus }}
                                </span>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center ">
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

            <!-- Pagination -->
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" sm="8" md="5" class="d-flex justify-center">
                        <v-pagination v-model="currentPage" 
                            :length="store.totalPages" 
                            :total-visible="$vuetify.display.smAndDown ? 3 : 6"
                            class="my-4"
                            rounded="circle" 
                            active-color="green" 
                            @update:model-value="store.setPage"
                            :disabled="store.totalPages <= 1">
                        </v-pagination>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <!-- Delete Dialog can remain outside -->
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
</template>

<script>
import { ref, onMounted } from 'vue';
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
    width: 70%;
}

h1 {
    color: #247B7B;
}

.search-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.search-bar p {
    cursor: pointer;
    padding: 0.5rem 1rem;
    margin: 0;
    border: 1px solid #247B7B;
    border-radius: 10px;

}

.search-bar>p.selected {
    background-color: #247B7B;
    color: white;
    border-radius: 10px;
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

.loading-container {
    min-height: 400px; /* Or adjust to your preferred height */
}
</style>