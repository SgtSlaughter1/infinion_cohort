<template>
  <div class="overview-container">
    <!-- Welcome Toast Message -->
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
    <div class="content-wrapper container">
      <!-- Header Section -->
      <div class="row mb-4">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <h2 class="mb-0 title">Overview</h2>
          <div class="d-flex gap-3 align-items-center flex-wrap">
            <!-- Date Range Filter with Single Input for Date Range -->
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
                <input 
                  type="date" 
                  v-model="dateRange.start" 
                  @change="updateFormattedDateRange"
                >
                <span>to</span>
                <input 
                  type="date" 
                  v-model="dateRange.end" 
                  @change="updateFormattedDateRange"
                >
                <button @click="closeDatePicker">Close</button>
              </div>
            </div>

            <!-- Export Button -->
            <button class="btn btn-outline-primary d-flex align-items-center gap-2">
              <i class="fas fa-file-export"></i>
              Export
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State with Centered SVG and New Campaign Button -->
      <div class="main-content text-center py-5">
        <div class="d-flex flex-column align-items-center">
          <img src="/images/Searchsvg.svg" alt="Search Icon" width="429" height="290" />
          <p class="mt-3">No activity yet. Create a new campaign to get started</p>
          <button 
            class="btn btn-primary d-flex align-items-center gap-2 mt-2 newbtn" 
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
import axios from 'axios'

export default {
  name: 'Overview',
  data() {
    return {
      showWelcome: !localStorage.getItem('welcomeDismissed'),
      userFirstName: '',
      showDatePicker: false,
      dateRange: {
        start: '',
        end: ''
      },
      formattedDateRange: ''
    }
  },

  methods: {
    goToNewCampaign() {
      this.$router.push({ name: 'NewCampaign' })
    },

    updateFormattedDateRange() {
      const { start, end } = this.dateRange
      if (start && end) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' }
        this.formattedDateRange = `${new Date(start).toLocaleDateString('en-US', options)} - ${new Date(end).toLocaleDateString('en-US', options)}`
      } else {
        this.formattedDateRange = ''
      }
    },

    toggleDateRangePicker() {
      this.showDatePicker = !this.showDatePicker
    },

    closeDatePicker() {
      this.showDatePicker = false
    }
  },

  async mounted() {
    try {
      const userResponse = await axios.get('/api/user')
      this.userFirstName = userResponse.data.firstName
    } catch (error) {
      console.error('Error fetching data:', error)
    }

    // Hide welcome message after 5 seconds and set it as dismissed in localStorage
    if (this.showWelcome) {
      setTimeout(() => {
        this.showWelcome = false
        localStorage.setItem('welcomeDismissed', true)
      }, 5000)
    }

    // Close date picker when clicking outside
    document.addEventListener('click', (e) => {
      const datePicker = this.$el.querySelector('.date-picker-dropdown')
      if (datePicker && !datePicker.contains(e.target) && e.target !== this.$el.querySelector('.form-control')) {
        this.closeDatePicker()
      }
    })
  }
}
</script>

<style scoped>
.overview-container {
  padding-left: 120px;
  padding-top: 60px;
  padding-right: 20px;
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
  display: flex;
  gap: 8px;
  align-items: center;
}

.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1055;
}
.title {
    color:#247b7b;
}
.newbtn {
    color:white;
    background-color: #1c6161;
}

@media (max-width: 768px) {
  .overview-container {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
