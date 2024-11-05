<template>
  <div class="overview-container">
    <div
      v-if="showWelcome"
      class="toast-container position-fixed top-0 start-50 translate-middle-x mt-4"
    >
      <div class="toast show" role="alert">
        <div class="toast-body text-center">
          Welcome {{ userFirstName }} to scrutz
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper container ">
      <div class="row mb-4">
        <div class="col-12">
          <div class="header-content mt-4">
            <h2 class="mb-3 mb-md-0 title">Overview</h2>
            <div class="controls-wrapper">
              <div class="date-range-input position-relative">
                <input
                  type="text"
                  class="form-control"
                  v-model="formattedDateRange"
                  @click="toggleDateRangePicker"
                  placeholder="Nov 3, 2024 - Nov 10, 2024"
                  readonly
                />
                <i class="fas fa-calendar-alt calendar-icon"></i>

                <!-- Date Picker Dropdown -->
                <div v-if="showDatePicker" class="date-picker-dropdown">
                  <div class="date-picker-content">
                    <input
                      type="date"
                      v-model="dateRange.start"
                      @change="updateFormattedDateRange"
                      class="date-input"
                    />
                    <span class="date-separator">to</span>
                    <input
                      type="date"
                      v-model="dateRange.end"
                      @change="updateFormattedDateRange"
                      class="date-input"
                    />
                    <button @click="closeDatePicker" class="close-btn">
                      Close
                    </button>
                  </div>
                </div>
              </div>

              <!-- Export Button -->
              <button
                class="btn btn-outline d-flex align-items-center gap-2 export-btn"
              >
                <i class="fas fa-file-export"></i>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State with SVG -->
      <div class="main-content text-center py-5">
        <div class="d-flex flex-column align-items-center">
          <img
            src="/images/Searchsvg.svg"
            alt="Search Icon"
            class="responsive-image"
          />
          <p class="mt-3">
            No activity yet. Create a new campaign to get started
          </p>
          <button
            class="btn  d-flex align-items-center gap-2 mt-2 newbtn"
            @click="goToNewCampaign"
          >
            <i class="fas fa-plus"></i>
            New Campaign
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCampaignStore } from '@/stores/CampaignStore';

export default {
  name: "Overview",
  data() {
    return {
      showWelcome: !localStorage.getItem("welcomeDismissed"),
      userFirstName: "",
      showDatePicker: false,
      dateRange: {
        start: "",
        end: "",
      },
      formattedDateRange: "",
    };
  },

  methods: {
    goToNewCampaign() {
      this.$router.push({ name: "NewCampaign" });
    },

    updateFormattedDateRange() {
      const { start, end } = this.dateRange;
      if (start && end) {
        const options = { month: "short", day: "numeric", year: "numeric" };
        this.formattedDateRange = `${new Date(start).toLocaleDateString(
          "en-US",
          options
        )} - ${new Date(end).toLocaleDateString("en-US", options)}`;
      } else {
        this.formattedDateRange = "";
      }
    },

    toggleDateRangePicker() {
      this.showDatePicker = !this.showDatePicker;
    },

    closeDatePicker() {
      this.showDatePicker = false;
    },
  },

  async mounted() {
    try {
      const userResponse = await axios.get("/api/user");
      this.userFirstName = userResponse.data.firstName;
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    if (this.showWelcome) {
      setTimeout(() => {
        this.showWelcome = false;
        localStorage.setItem("welcomeDismissed", true);
      }, 5000);
    }

    document.addEventListener("click", (e) => {
      const datePicker = this.$el.querySelector(".date-picker-dropdown");
      if (
        datePicker &&
        !datePicker.contains(e.target) &&
        e.target !== this.$el.querySelector(".form-control")
      ) {
        this.closeDatePicker();
      }
    });
  },
};
</script>



<style scoped>
.overview-container {
  padding: 60px 20px 20px 120px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.controls-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.date-range-input {
  position: relative;
  width: 250px;
}

.date-range-input .calendar-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.date-picker-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 100%;
  min-width: 280px;
}

.date-picker-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.date-separator {
  text-align: center;
  padding: 4px 0;
}

.close-btn {
  width: 100%;
  padding: 6px;
  margin-top: 8px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1055;
}

.title {
  color: #247b7b;
  margin: 0;
}

.newbtn {
  color: white;
  background-color: #1c6161;
  border-color: #1c6161;
}
.newbtn:hover {
  background-color: #0c7e7e;
}
.export-btn {
  white-space: nowrap;
  background-color: #247b7b;
  color:white;
}
.export-btn:hover{
  background-color: #0e9191;
}

.responsive-image {
  max-width: 100%;
  height: auto;
  width: auto;
  max-height: 290px;
}

@media (max-width: 768px) {
  .overview-container {
    padding: 20px 15px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .controls-wrapper {
    flex-direction: column;
    width: 100%;
  }

  .date-range-input {
    width: 100%;
  }

  .export-btn {
    width: 100%;
    justify-content: center;
    
  }

  .toast-container {
    width: 90%;
    max-width: 400px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.5rem;
    text-align: center;
  }

  .main-content {
    padding: 2rem 0;
  }
}
</style>
