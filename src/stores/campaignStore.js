import { defineStore } from "pinia";
import axios from "axios";

export const useCampaignStore = defineStore("campaign", {
    
    state: {
        campaigns: [],
        currentCampaign: null,
        loading: false,
        currentPage: 1,
        itemsPerPage: 10,
        selectedFilter: "All",
        searchQuery: "",
        startDate: "",
        error: null,
    },

    // Getters as methods that return values
    getters: {
        filteredCampaigns: (state) => {
            let filtered = [...state.campaigns];

            if (state.selectedFilter !== "All") {
                filtered = filtered.filter(
                    (campaign) => campaign.campaignStatus === state.selectedFilter
                );
            }

            if (state.searchQuery) {
                filtered = filtered.filter((campaign) =>
                    campaign.campaignName
                        .toLowerCase()
                        .includes(state.searchQuery.toLowerCase())
                );
            }

            if (state.startDate) {
                filtered = filtered.filter(
                    (campaign) => campaign.startDate >= state.startDate
                );
            }

            return filtered;
        },

        paginatedCampaigns: (state, getters) => {
            const start = (state.currentPage - 1) * state.itemsPerPage;
            const end = start + state.itemsPerPage;
            return getters.filteredCampaigns.slice(start, end);
        },

        totalPages: (state, getters) => {
            return Math.ceil(getters.filteredCampaigns.length / state.itemsPerPage);
        },

        totalCampaigns: (state) => {
            return state.campaigns.length;
        },

        activeCampaigns: (state) => {
            return state.campaigns.filter(
                (campaign) => campaign.campaignStatus === "Active"
            ).length;
        },

        inactiveCampaigns: (state) => {
            return state.campaigns.filter(
                (campaign) => campaign.campaignStatus === "Inactive"
            ).length;
        },
    },

    // Actions as methods
    actions: {
        async fetchCampaigns() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(
                    "https://infinion-test-int-test.azurewebsites.net/api/Campaign"
                );
                this.campaigns = response.data;
            } catch (error) {
                this.error = "Failed to fetch campaigns";
                console.error("Error fetching campaigns:", error);
            } finally {
                this.loading = false;
            }
        },

        async fetchCampaignById(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(
                    `https://infinion-test-int-test.azurewebsites.net/api/Campaign/${id}`
                );
                this.currentCampaign = response.data;
            } catch (error) {
                this.error = "Failed to fetch campaign details";
                console.error("Error fetching campaign details:", error);
            } finally {
                this.loading = false;
            }
        },

        async createCampaign(campaignData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.post(
                    "https://infinion-test-int-test.azurewebsites.net/api/Campaign",
                    campaignData
                );
                this.campaigns.push(response.data);
                return response.data;
            } catch (error) {
                this.error = "Failed to create campaign";
                console.error("Error creating campaign:", error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateCampaign(id, updatedData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.put(
                    `https://infinion-test-int-test.azurewebsites.net/api/Campaign/${id}`,
                    updatedData
                );
                const index = this.campaigns.findIndex(
                    (campaign) => campaign.id === id
                );
                if (index !== -1) {
                    this.campaigns[index] = response.data;
                    this.currentCampaign = response.data;
                }
                return response.data;
            } catch (error) {
                this.error = "Failed to update campaign";
                console.error("Error updating campaign:", error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteCampaign(id) {
            this.loading = true;
            this.error = null;
            try {
                await axios.delete(
                    `https://infinion-test-int-test.azurewebsites.net/api/Campaign/${id}`
                );
                this.campaigns = this.campaigns.filter(
                    (campaign) => campaign.id !== id
                );
            } catch (error) {
                this.error = "Failed to delete campaign";
                console.error("Error deleting campaign:", error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Mutation-like actions for local state
        setFilter(filter) {
            this.selectedFilter = filter;
            this.currentPage = 1;
        },

        setSearchQuery(query) {
            this.searchQuery = query;
            this.currentPage = 1;
        },

        setStartDate(date) {
            this.startDate = date;
            this.currentPage = 1;
        },

        setCurrentPage(page) {
            this.currentPage = page;
        },

        clearError() {
            this.error = null;
        },
    },
});
