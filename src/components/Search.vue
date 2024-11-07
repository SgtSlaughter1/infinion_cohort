<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const searchQuery = ref('');
</script>

<template>
  <div class="flex items-center relative">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search"
      class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#247b7b]"
      style="padding-right: 7.5rem;"
    />
    <font-awesome-icon
      :icon="faSearch"
      class="absolute right-4 text-gray-500 cursor-pointer"
    />
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>
