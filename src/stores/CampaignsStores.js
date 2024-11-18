import { defineStore } from "pinia";
import axios from "axios";

const API_BASE_URL =
  "https://infinion-test-int-test.azurewebsites.net/api/Campaign";

export const useCampaignStore = defineStore("campaign", {
  state: () => ({
    campaigns: [],
    createdCampaign: null,
    isLoading: false,
    error: null,
    selectedFilter: "All",
    searchQuery: "",
    startDate: null,
    currentPage: 1,
    itemsPerPage: 10,
    showDeleteDialog: false,
    campaignToDelete: null,
  }),

  getters: {
    filteredCampaigns: (state) => {
      const filterByStatus = (campaign) =>
        state.selectedFilter === "All" ||
        state.selectedFilter === campaign.campaignStatus;
      const filterBySearch = (campaign) =>
        !state.searchQuery ||
        campaign.campaignName
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase());
      const filterByDate = (campaign) =>
        !state.startDate ||
        new Date(campaign.startDate).toISOString().split("T")[0] ===
          state.startDate;

      return state.campaigns.filter(
        (campaign) =>
          filterByStatus(campaign) &&
          filterBySearch(campaign) &&
          filterByDate(campaign)
      );
    },

    totalItems: (state) => state.filteredCampaigns.length,

    totalPages(state) {
      return Math.ceil(this.totalItems / state.itemsPerPage);
    },

    paginatedCampaigns(state) {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return this.filteredCampaigns.slice(start, end);
    },

    activeCampaigns: (state) =>
      state.campaigns.filter((campaign) => campaign.campaignStatus === "Active")
        .length,

    inactiveCampaigns: (state) =>
      state.campaigns.filter(
        (campaign) => campaign.campaignStatus === "Inactive"
      ).length,
  },

  actions: {
    async createCampaign(campaignData) {
      this.isLoading = true;
      this.error = null;

      try {
        const formattedData = {
          campaignName: campaignData.name,
          campaignDescription: campaignData.description,
          startDate: new Date(campaignData.startDate).toISOString(),
          endDate: new Date(campaignData.endDate).toISOString(),
          digestCampaign: Boolean(campaignData.dailyDigest),
          linkedKeywords: campaignData.keywords
            ? campaignData.keywords.split(",")
            : [],
          dailyDigest: campaignData.digestFrequency || "none",
        };

        const response = await axios.post(API_BASE_URL, formattedData, {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        });

        this.createdCampaign = response.data;
        return response.data;
      } catch (error) {
        console.error("API Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        this.error =
          error.response?.data?.message || "Failed to create campaign";
        throw new Error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCampaigns() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(API_BASE_URL);
        this.campaigns = response.data;
        this.currentPage = 1;
      } catch (err) {
        console.error("Error", err);
        this.error =
          err.response?.data || "An error occurred while fetching campaigns.";
      } finally {
        this.isLoading = false;
      }
    },

    async deleteCampaign(id) {
      this.error = null;
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        this.campaigns = this.campaigns.filter(
          (campaign) => campaign.id !== id
        );

        const maxPage = Math.ceil(
          this.filteredCampaigns.length / this.itemsPerPage
        );
        if (this.currentPage > maxPage) {
          this.currentPage = Math.max(1, maxPage);
        }
      } catch (err) {
        this.error =
          err.response?.data ||
          "An error occurred while deleting the campaign.";
      }
    },
    //  Loads a specific campaign by ID

    async loadCampaign(campaignId) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get(API_BASE_URL);
        const campaign = response.data.find(
          (c) => c.id.toString() === campaignId
        );

        if (campaign) {
          this.currentCampaign = { ...campaign };
          return campaign;
        } else {
          this.error = "Campaign not found";
          return null;
        }
      } catch (err) {
        this.error = "Failed to load campaign";
        console.error(err);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    // Validates campaign data before saving

    validateCampaign(campaign) {
      const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
      };

      return (
        campaign.campaignName &&
        campaign.campaignDescription &&
        isValidDate(campaign.startDate) &&
        isValidDate(campaign.endDate)
      );
    },

    // Saves changes to an existing campaign

    async saveCampaignChanges(campaignData) {
      this.error = null;
      try {
        if (!this.validateCampaign(campaignData)) {
          throw new Error("Validation failed. Please check your input.");
        }

        const formattedData = {
          ...campaignData,
          startDate: new Date(campaignData.startDate).toISOString(),
          endDate: new Date(campaignData.endDate).toISOString(),
          digestCampaign:
            campaignData.digestCampaign === true ||
            campaignData.digestCampaign === "true",
        };

        await axios.put(`${API_BASE_URL}/${campaignData.id}`, formattedData);

        await this.updateCampaignStatus(
          campaignData.id,
          campaignData.campaignStatus
        );
        this.showSuccessModal = true;
        return true;
      } catch (err) {
        this.error = "Failed to save changes";
        console.error(err);
        return false;
      }
    },

    /**
     * Updates the status of a campaign
     */
    async updateCampaignStatus(id, status) {
      this.error = null;
      try {
        const statusData = {
          id: id,
          campaignStatus: status === "Active",
        };

        await axios.put(
          `https://infinion-test-int-test.azurewebsites.net/api/CampaignStatus/${id}`,
          statusData
        );

        if (this.currentCampaign && this.currentCampaign.id === id) {
          this.currentCampaign.campaignStatus = status;
        }
      } catch (err) {
        this.error = "Failed to update campaign status";
        console.error(err);
      }
    },

    // Stops a campaign by setting its status to Inactive
    async stopCampaign(id) {
      try {
        await this.updateCampaignStatus(id, "Inactive");
        if (this.currentCampaign && this.currentCampaign.id === id) {
          this.currentCampaign.campaignStatus = "Inactive";
        }
      } catch (err) {
        this.error = "Failed to stop campaign";
        console.error(err);
      }
    },

    // Manages the success modal state
    setShowSuccessModal(value) {
      this.showSuccessModal = value;
    },

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

    setPage(page) {
      this.currentPage = page;
    },

    openDeleteModal(id) {
      this.campaignToDelete = id;
      this.showDeleteDialog = true;
    },

    async confirmDelete() {
      if (this.campaignToDelete) {
        await this.deleteCampaign(this.campaignToDelete);
        this.showDeleteDialog = false;
        this.campaignToDelete = null;
      }
    },

    closeDeleteDialog() {
      this.showDeleteDialog = false;
      this.campaignToDelete = null;
    },
  },
});
