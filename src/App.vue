<script setup>
import DashBoard from "./views/DashBoard.vue";

</script>


<template>
  <DashBoard />
  <RouterView />
  </template>
  
  <script>
  import AllCampaign from './views/AllCampaign.vue';
  
    export default {
      components : { AllCampaign}
    }
  </script>
  
  