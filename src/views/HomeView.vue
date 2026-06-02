<script setup>
import  { ref } from 'vue'
import DisplayDetails from '@/components/DisplayDetails.vue'
import SummaryDisplay from '@/components/SummaryDisplay.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import Search from '@/components/Search.vue'
import StatusFiltering from '@/components/StatusFiltering.vue'

const viewType = ref('all')

</script>

<template>
  <div class="nav-bar"></div>
  
  <h2 style="font-size: xx-large;">Projects</h2>
</template>
