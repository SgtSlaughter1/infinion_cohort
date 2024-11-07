<template>
  <div class="custom-button">
    <button
      @click="navigateToNewCampaign"
      class="btn d-flex align-items-center gap-2 mt-2 newbtn"
     
    >
      <v-icon left>mdi-plus</v-icon>

      New Campaign
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigateToNewCampaign = () => {
  router.push("/dashboard/new-campaign");
};
</script>

<style scoped>
.newbtn {
  color: white;
  background-color: #1c6161;
  border-color: #1c6161;
}
.newbtn:hover {
  background-color: #0c7e7e;
}
</style>
