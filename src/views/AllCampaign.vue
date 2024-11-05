<template>
    <div class="container-fluid">
        <h1>All Campaigns</h1>

        <!-- Search and Filter Bar -->
        <div class="search-bar">
            <p :class="{ selected: selectedFilter === 'All' }" @click="setFilter('All')">All ({{ totalCampaigns }})</p>
            <p :class="{ selected: selectedFilter === 'Inactive' }" @click="setFilter('Inactive')">
                Inactive ({{ inactiveCampaigns }})
            </p>
            <p :class="{ selected: selectedFilter === 'Active' }" @click="setFilter('Active')">
                Active ({{ activeCampaigns }})
            </p>
            <input type="search" class="form-control mx-2" placeholder="Search..." v-model="searchQuery" @input="filterData">
            <input type="date" class="form-control" v-model="startDate" @input="filterData" placeholder="Start Date">
        </div>

        <div v-if="loading" class="loading">Loading campaign details...</div>

        <!-- Table View (Desktop) -->
        <div v-else class="table-responsive mt-4 d-none d-md-block">
            <table class="table table-bordered table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>S/N</th>
                        <th>Campaign Name</th>
                        <th>Start Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(campaign, index) in paginatedCampaigns" :key="campaign.id">
                        <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                        <td>{{ campaign.campaignName }}</td>
                        <td>{{ campaign.startDate }}</td>
                        <td :class="{ active: campaign.campaignStatus === 'Active', inactive: campaign.campaignStatus === 'Inactive' }">
                            {{ campaign.campaignStatus }}
                        </td>
                        <td>
                            <router-link :to="{ name: 'ViewCampaign', params: { id: campaign.id } }">
                                <button class="btn btn-link p-0"><img src="/src/assets/Vector.png" alt="View Icon"></button>
                            </router-link>
                            <router-link :to="{ name: 'EditCampaign', params: { id: campaign.id } }">
                                <button class="btn btn-link p-0"><img src="/src/assets/Group.png" alt="Edit Icon"></button>
                            </router-link>
                            <button class="btn btn-link p-0" @click="openDeleteModal(campaign.id)">
                                <img src="/src/assets/Vector (1).png" alt="Delete Icon">
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Card View (Mobile) -->
        <div v-if="loading" class="loading">Loading campaign details...</div>

        <div v-else class="d-block d-md-none mt-4">
            <div v-for="(campaign, index) in paginatedCampaigns" :key="campaign.id" class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">{{ campaign.campaignName }}</h5>
                    <p class="card-text"><strong>S/N:</strong> {{ (currentPage - 1) * itemsPerPage + index + 1 }}</p>
                    <p class="card-text"><strong>Start Date:</strong> {{ campaign.startDate }}</p>
                    <p class="card-text">
                        <strong>Status:</strong>
                        <span :class="{ active: campaign.campaignStatus === 'Active', inactive: campaign.campaignStatus === 'Inactive' }">
                            {{ campaign.campaignStatus }}
                        </span>
                    </p>
                    <div class="actions">
                        <button class="btn btn-link p-0"><img src="/src/assets/Vector.png" alt="View Icon"></button>
                        <router-link :to="{ name: 'EditCampaign', params: { id: campaign.id } }">
                            <button class="btn btn-link p-0"><img src="/src/assets/Group.png" alt="Edit Icon"></button>
                        </router-link>
                        <button class="btn btn-link p-0" @click="openDeleteModal(campaign.id)">
                            <img src="/src/assets/Vector (1).png" alt="Delete Icon">
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vuetify Pagination -->
        <v-container>
            <v-row justify="start">
                <v-col cols="8">
                    <v-pagination v-model="currentPage" :length="totalPages" :total-visible="5" class="my-4" rounded="circle" color="green"></v-pagination>
                </v-col>
            </v-row>
        </v-container>

        <!-- Delete Confirmation Modal -->
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p>Are you sure you want to delete this campaign?</p>
                        <p>This action can't be undone.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn cancelBtn" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="confirmDelete">Delete Campaign</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useCampaignStore } from "@/stores/campaignStore";
import { mapActions, mapState, mapGetters } from "pinia";

export default {
    computed: {
        ...mapState(useCampaignStore, ["loading", "searchQuery", "selectedFilter", "startDate", "currentPage"]),
        ...mapGetters(useCampaignStore, ["totalCampaigns", "activeCampaigns", "inactiveCampaigns", "paginatedCampaigns", "totalPages"]),
    },
    methods: {
        ...mapActions(useCampaignStore, ["fetchCampaigns", "setFilter", "filterData", "openDeleteModal", "confirmDelete"]),
    },
    mounted() {
        this.fetchCampaigns();
    }
};
</script>

<style scoped>
.container-fluid {
    width: 75%;
}

h1 {
    color: #247B7B;
    margin: 20px 0;
}

.loading {
    text-align: center;
    padding: 20px;
    font-style: italic;
    color: #666;
}

.search-bar {
    display: flex;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.search-bar>p {
    border: 1px solid #247B7B;
    padding: 10px;
    margin: 5px;
    color: #247B7B;
    border-radius: 5px;
    cursor: pointer;
}

input.form-control {
    max-width: 200px;
}

table {
    text-align: center;
}

.card-title {
    color: #247B7B;
}

.card-text {
    margin-bottom: 0.5rem;
}

.actions button {
    margin-right: 5px;
}

.active {
    color: green;
    font-weight: bold;
    text-transform: uppercase;
}

.inactive {
    color: red;
    font-weight: bold;
    text-transform: uppercase;
}

.cancelBtn {
    border: 1px solid black;
}
</style>
