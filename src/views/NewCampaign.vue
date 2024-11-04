<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <div class="card form-card">
          <div class="card-body">
            <h2 class="card-title mb-4">Create New Campaign</h2>

            <div v-if="errors.general" class="alert alert-danger">
              {{ errors.general }}
            </div>

            <form @submit.prevent="createCampaign">
              <div class="mb-3">
                <label for="campaignName" class="form-label"
                  >Campaign Name:</label
                >
                <input
                  type="text"
                  id="campaignName"
                  v-model="campaignName"
                  class="form-control"
                  :class="{ 'is-invalid': errors.campaignName }"
                  placeholder="e.g The Future is now"
                />
                <div v-if="errors.campaignName" class="invalid-feedback">
                  {{ errors.campaignName }}
                </div>
              </div>

              <div class="mb-3">
                <label for="campaignDescription" class="form-label"
                  >Campaign Description:</label
                >
                <textarea
                  id="campaignDescription"
                  v-model="campaignDescription"
                  class="form-control"
                  :class="{ 'is-invalid': errors.campaignDescription }"
                  placeholder="Please add a description to your campaign"
                  rows="4"
                ></textarea>
                <div v-if="errors.campaignDescription" class="invalid-feedback">
                  {{ errors.campaignDescription }}
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="startDate" class="form-label">Start Date:</label>
                  <input
                    type="date"
                    id="startDate"
                    v-model="startDate"
                    :min="minDate"
                    class="form-control"
                    :class="{ 'is-invalid': errors.startDate }"
                  />
                  <div v-if="errors.startDate" class="invalid-feedback">
                    {{ errors.startDate }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="endDate" class="form-label">End Date:</label>
                  <input
                    type="date"
                    id="endDate"
                    v-model="endDate"
                    :min="minEndDate"
                    class="form-control"
                    :class="{ 'is-invalid': errors.endDate }"
                  />
                  <div v-if="errors.endDate" class="invalid-feedback">
                    {{ errors.endDate }}
                  </div>
                </div>
              </div>

              <div
                class="mb-3 d-flex justify-content-between align-items-center"
              >
                <label class="form-label mb-0"
                  >Want to receive daily digest?</label
                >
                <div class="form-check form-switch">
                  <input
                    type="checkbox"
                    id="dailyDigest"
                    v-model="dailyDigest"
                    class="form-check-input custom-switch"
                    role="switch"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="linkedKeywords" class="form-label"
                  >Linked Keywords:</label
                >
                <input
                  type="text"
                  id="linkedKeywords"
                  v-model="currentKeyword"
                  @keydown.enter.prevent="addKeyword"
                  class="form-control"
                  placeholder="To add keywords, type your keyword and press enter"
                />
                <div class="mt-2">
                  <span
                    v-for="(keyword, index) in linkedKeywords"
                    :key="index"
                    class="badge keyword-badge me-2 mb-2"
                  >
                    {{ keyword }}
                    <button
                      type="button"
                      @click="removeKeyword(index)"
                      class="btn-close btn-close-white ms-2 remove-keyword"
                      aria-label="Remove"
                    ></button>
                  </span>
                </div>
              </div>

              <div class="mb-4">
                <label for="digestFrequency" class="form-label">
                  Select digest frequency:
                </label>
                <select
                  id="digestFrequency"
                  v-model="digestFrequency"
                  class="form-select"
                  :class="{ 'is-invalid': errors.digestFrequency }"
                  :disabled="!dailyDigest"
                >
                  <option value="" disabled selected>Select</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <div v-if="errors.digestFrequency" class="invalid-feedback">
                  {{ errors.digestFrequency }}
                </div>
              </div>

              <div class="d-flex gap-2">
                <button
                  type="button"
                  @click="cancel"
                  class="btn btn-cancel"
                  :disabled="isLoading"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-create"
                  :disabled="isLoading"
                >
                  {{ isLoading ? "Creating..." : "Create Campaign" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-primary">
              Campaign Created Successfully!
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Your campaign "{{ campaignName }}" has been created.</p>
          </div>
          <div class="modal-footer">
            <button @click="goToEditCampaign" class="btn btn-create">
              View Campaign
            </button>
            <button @click="closeModal" class="btn btn-cancel">Close</button>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import apiService from "@/services/api";

export default {
  name: "NewCampaign",
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
      },
      showSuccessModal: false,
      createdCampaignId: null,
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
      if (!this.validateForm()) return;

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
      this.$router.push({ name: 'OverviewComp' })
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
      this.$router.push({ name: 'OverviewComp' })
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
.form-card {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
}

.form-label {
  font-weight: bold;
}

.btn-create {
  background-color: #247b7b;
  color: white;
  border: none;
}

.btn-create:hover {
  background-color: #1c6161;
  color: white;
}

.btn-cancel {
  background-color: #f9f9f9;
  color: #5b9c9b;
  border: 1px solid #5b9c9b;
}

.btn-cancel:hover {
  background-color: #e9e9e9;
  color: #4a8180;
}

.keyword-badge {
  background-color: #e0e0e0;
  color: #333;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
}

.custom-switch:checked {
  background-color: #6e0080;
  border-color: #6e0080;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-title {
  color: #247b7b;
}

.form-control:focus,
.form-select:focus {
  border-color: #247b7b;
  box-shadow: 0 0 0 0.25rem rgba(36, 123, 123, 0.25);
}

.is-invalid {
  border-color: #dc3545;
}

.is-invalid:focus {
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}
.modal-backdrop {
  display: none;
}
</style>
