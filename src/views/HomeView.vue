<script setup lang="ts">
import  { ref, watch } from 'vue'
import ProjectList from '@/components/ProjectList.vue'
import DisplaySummary from '@/components/DisplaySummary.vue'
import type { Project } from '@/stores/ProjectStore'
import type { ProjectStatus } from '@/stores/ProjectStore'
import { useProjectStore } from '@/stores/ProjectStore'
import ProjectForm from '@/components/ProjectForm.vue'
import Search from '@/components/Search.vue'

const viewType = ref('all')

const store = useProjectStore()

const arrayToDisplay = ref<Project[]>(store.projects)

const status = ref<ProjectStatus>('Not Started')

watch(status, (newStatus) => {
    console.log(newStatus)
    console.log(store.filterByStatus(newStatus))
    arrayToDisplay.value = newStatus ? store.filterByStatus(newStatus) : store.projects
})
</script>

<template>
    <div class="nav-bar"></div>
    
    <div class="page-wrapper">
        <h1>Projects</h1>
        <div class="top-bar">
            <div class="project-view">
                <button @click="viewType = 'all';">All Projects</button>
                <button @click="viewType = 'summary';">Summary</button>
            </div>

            <!-- Filtering By Status -->
            <form class="status-filter">
                <label>Status Filtering</label>
                <select v-model="status">
                        <option value ="Not Started">Not Started</option>
                        <option value = "In Progress">In-Progress</option>
                        <option value = "Complete">Complete</option>
                </select>
            </form>

            <!-- Search -->

        </div>

        <div class="projectlist-wrapper">

            <ProjectList :project="arrayToDisplay" v-if="viewType === 'all'"></ProjectList>

            <DisplaySummary v-if="viewType === 'summary'"></DisplaySummary>
        </div>    
    </div>

</template>

<style>
.page-wrapper {
    background: rgb(0,0,0,0.05);
    padding: 20px 20px 20px;
    margin: 0px 70px 0px;
    height: 80%;
    width: 90%;
    border-radius: 3px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.22);
    
}
.projectlist-wrapper {
    background: white;
    padding: 10px 30px 20px;
    margin-top: 0px;
    border-radius: 5px;
}
h1{
    margin-left: 20px;
}
button:hover{
    color:black ;
    background: transparent;
    text-decoration: underline;
}
button {
    border: transparent;
    background: transparent;
    color: darkgrey;
    padding: 0px 12px 0px;
    font-size: 20px;
}
.top-bar {
    display: flex;
    flex-direction: row;
    padding: 10px 10px 0px;
    justify-content: space-between;
}
select {
    border-radius: 0px;
    width:50% ;
}
.status-filter {
    position: relative;
    top: -30px;
    font-size: medium;
}

</style>
