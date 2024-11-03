<template>
  <div class="add-campaign-form">
    <h2>Create New Campaign</h2>
    <div v-if="errors.general" class="error-message">{{ errors.general }}</div>
    <form @submit.prevent="createCampaign">
      <div class="form-group">
        <label for="campaignName">Campaign Name:</label>
        <input
          type="text"
          id="campaignName"
          v-model="campaignName"
          placeholder="e.g The Future is now"
          :class="{ 'error-input': errors.campaignName }"
        />
        <span v-if="errors.campaignName" class="field-error">{{
          errors.campaignName
        }}</span>
      </div>

      <div class="form-group">
        <label for="campaignDescription">Campaign Description:</label>
        <textarea
          id="campaignDescription"
          v-model="campaignDescription"
          placeholder="Please add a description to your campaign"
          :class="{ 'error-input': errors.campaignDescription }"
        ></textarea>
        <span v-if="errors.campaignDescription" class="field-error">{{
          errors.campaignDescription
        }}</span>
      </div>

      <div class="form-group date-group">
        <div class="date-input">
          <label for="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            v-model="startDate"
            :min="minDate"
            :class="{ 'error-input': errors.startDate }"
          />
          <span v-if="errors.startDate" class="field-error">{{
            errors.startDate
          }}</span>
        </div>
        <div class="date-input">
          <label for="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            v-model="endDate"
            :min="minEndDate"
            :class="{ 'error-input': errors.endDate }"
          />
          <span v-if="errors.endDate" class="field-error">{{
            errors.endDate
          }}</span>
        </div>
      </div>

      <div class="form-group digest-group">
        <label for="dailyDigest"
          >Want to receive daily digest about the campaign?</label
        >
        <div class="switch-container">
          <label class="switch">
            <input type="checkbox" id="dailyDigest" v-model="dailyDigest" />
            <span class="slider round"></span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label for="linkedKeywords">Linked Keywords:</label>
        <input
          type="text"
          id="linkedKeywords"
          v-model="currentKeyword"
          @keydown.enter.prevent="addKeyword"
          class="linked-keywords-input"
          placeholder="To add keywords, type your keyword and press enter"
        />
        <div class="keyword-list">
          <span
            v-for="(keyword, index) in linkedKeywords"
            :key="index"
            class="keyword"
          >
            {{ keyword }}
            <button
              type="button"
              @click="removeKeyword(index)"
              class="remove-keyword"
            >
              &times;
            </button>
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="digestFrequency"
          >Kindly select how often you want to receive daily digest:</label
        >
        <select
          id="digestFrequency"
          v-model="digestFrequency"
          class="digest-frequency-select"
          :class="{ 'error-input': errors.digestFrequency }"
          :disabled="!dailyDigest"
        >
          <option value="" disabled selected>Select</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <span v-if="errors.digestFrequency" class="field-error">{{
          errors.digestFrequency
        }}</span>
      </div>

      <div class="form-actions">
        <button
          type="button"
          @click="cancel"
          class="btn-cancel"
          :disabled="isLoading"
        >
          Cancel
        </button>
        <button type="submit" class="btn-create" :disabled="isLoading">
          {{ isLoading ? "creating..." : "Create Campaign" }}
        </button>
      </div>
    </form>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Campaign Created Successfully!</h3>
          <button @click="closeModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>Your campaign "{{ campaignName }}" has been created.</p>
        </div>
        <div class="modal-footer">
          <button @click="goToEditCampaign" class="btn-edit-campaign">
            View Campaign
          </button>
          <button @click="closeModal" class="btn-close-modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import apiService from "@/services/api";

export default {
  name: "AddCampaignForm",
  data() {
    return {
      campaignName: "",
      campaignDescription: "",
      startDate: "",
      endDate: "",
      dailyDigest: false,
      currentKeyword: "",
      linkedKeywords: [],
      digestFrequency: "",
      isLoading: false,
      errors: {
        campaignName: "",
        campaignDescription: "",
        startDate: "",
        endDate: "",
        digestFrequency: "",
        general: "",
        showSuccessModal: false,
        createdCampaignId: null,
      },
    };
  },

  computed: {
    minDate() {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },
    minEndDate() {
      return this.startDate || this.minDate;
    },
  },

  methods: {
    clearErrors() {
      Object.keys(this.errors).forEach((key) => {
        this.errors[key] = "";
      });
    },

    validateForm() {
      let isValid = true;
      this.clearErrors();

      if (!this.campaignName.trim()) {
        this.errors.campaignName = "Campaign name is required";
        isValid = false;
      }
      if (!this.campaignDescription.trim()) {
        this.errors.campaignDescription = "Campaign description is required";
        isValid = false;
      }
      if (!this.startDate) {
        this.errors.startDate = "Start date is required";
        isValid = false;
      }
      if (!this.endDate) {
        this.errors.endDate = "End date is required";
        isValid = false;
      }
      if (
        this.endDate &&
        this.startDate &&
        new Date(this.endDate) < new Date(this.startDate)
      ) {
        this.errors.endDate = "End date must be after start date";
        isValid = false;
      }
      if (this.dailyDigest && !this.digestFrequency) {
        this.errors.digestFrequency = "Please select digest frequency";
        isValid = false;
      }
      return isValid;
    },

    async createCampaign() {
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;
      this.clearErrors();

      try {
        const campaignData = {
          name: this.campaignName.trim(),
          description: this.campaignDescription.trim(),
          startDate: this.startDate,
          endDate: this.endDate,
          dailyDigest: this.dailyDigest,
          keywords: this.linkedKeywords.join(","),
          digestFrequency: this.digestFrequency,
        };

        const createdCampaign = await apiService.createCampaign(campaignData);
        this.$emit("campaign-created", createdCampaign);

        this.createdCampaignId = createdCampaign.id;
        this.showSuccessModal = true;
      } catch (error) {
        this.errors.general = error.message;
        console.error("Campaign creation error:", error);
      } finally {
        this.isLoading = false;
      }
    },

    goToEditCampaign() {
      if (this.createdCampaignId) {
        this.$router.push({
          name: "EditCampaign", 
          params: { id: this.createdCampaignId },
        });
      }
    },

    closeModal() {
      this.showSuccessModal = false;
      this.resetForm();
    },

    addKeyword() {
      if (this.currentKeyword.trim() !== "") {
        this.linkedKeywords.push(this.currentKeyword.trim());
        this.currentKeyword = "";
      }
    },
    removeKeyword(index) {
      this.linkedKeywords.splice(index, 1);
    },
    cancel() {
      this.$emit("cancel");
      this.resetForm();
    },
    resetForm() {
      this.campaignName = "";
      this.campaignDescription = "";
      this.startDate = "";
      this.endDate = "";
      this.dailyDigest = false;
      this.currentKeyword = "";
      this.linkedKeywords = [];
      this.digestFrequency = "";
      this.clearErrors();
    },
  },
};
</script>

<style scoped>
.add-campaign-form {
  max-width: 800px;
  margin: 100px auto 0;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.field-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.error-input {
  border-color: #dc3545;
}

.error-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.date-group {
  display: flex;
  justify-content: space-between;
}

.date-input {
  width: 48%;
}

.digest-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #6e0080;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.linked-keywords-input {
  height: 50px;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.keyword {
  display: inline-flex;
  align-items: center;
  background-color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.remove-keyword {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 16px;
  margin-left: 5px;
}

.digest-frequency-select {
  width: auto;
  min-width: 150px;
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.btn-cancel {
  background-color: #f9f9f9;
  color: #5b9c9b;
  border: 1px solid #5b9c9b;
}

.btn-create {
  background-color: #247b7b;
  color: white;
}
.error-message {
  color: #f44336;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #ffebee;
  border-radius: 4px;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.modal-header h3 {
  margin: 0;
  color: #247b7b;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
}

.btn-edit-campaign {
  background-color: #247b7b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-close-modal {
  background-color: #f9f9f9;
  color: #5b9c9b;
  border: 1px solid #5b9c9b;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
