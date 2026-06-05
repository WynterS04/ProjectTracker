<script setup>
import  { ref } from 'vue'
import ProjectList from '@/components/ProjectList.vue'
import DisplaySummary from '@/components/DisplaySummary.vue'
import ProjectForm from '@/components/ProjectForm.vue'
import Search from '@/components/Search.vue'
import StatusFiltering from '@/components/StatusFiltering.vue'

const viewType = ref('all')

</script>

<template>
  <div class="nav-bar"></div>
  
  <h2 style="font-size: xx-large;">Projects</h2>

  <div class="top-bar">
    <div class="project-view">
        <button @click="viewType = 'all'">All</button>
        <button @click="viewType = 'summary'">Summary</button>
    </div>
    <div class="status-filter">
        <h4 style="margin: 0px 0px 8px; text-align: end;">Status Filter</h4>
    </div>
  </div>

  <ProjectList v-if="viewType === 'all'"></ProjectList>

  <DisplaySummary v-if="viewType === 'summary'"></DisplaySummary>

</template>

<style>
.top-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0px 30px 0px;
}
.status-filter {
    display: flex;
    flex-direction: column;
    position: relative;
}
</style>
