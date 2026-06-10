<script setup lang="ts">
import  { ref, watch } from 'vue'
import ProjectList from '@/components/ProjectList.vue'
import DisplaySummary from '@/components/DisplaySummary.vue'
import type { Project } from '@/stores/ProjectStore'
import type { ProjectStatus } from '@/stores/ProjectStore'
import { useProjectStore } from '@/stores/ProjectStore'

const viewType = ref('all')

const store = useProjectStore()

const arrayToDisplay = ref<Project[]>(store.projects)

const status = ref<ProjectStatus>()

watch(status, (newStatus) => {
    if(newStatus === null) {
        arrayToDisplay.value = store.projects
    }
    arrayToDisplay.value = newStatus ? store.filterByStatus(newStatus) : store.projects
})

const searchTerm = ref('')
</script>

<template>
    <div class="nav-bar"></div>
    
    <div class="page-wrapper">
        <h1>Projects</h1>
        <div class="top-bar">
            <div class="project-view">
                <button data-test="all-projects-button" @click="viewType = 'all';">All Projects</button>
                <button data-test="project-summary-button" @click="viewType = 'summary';">Summary</button>
            </div>

            <div class="user-actions">
                <!-- Filtering By Status -->
                <form class="status-filter">
                    <label>Status Filtering</label>
                    <select v-model="status">
                            <option value ="Not Started">Not Started</option>
                            <option value = "In Progress">In-Progress</option>
                            <option value = "Complete">Complete</option>
                            <option :value=null>All</option>
                    </select>
                </form>

                <!-- Search -->
                <form>
                    <label style="text-align: end; position: relative; left: -30px;">Search</label>
                    <div class="search-project">
                        <input id="search-bar" v-model="searchTerm" @input="arrayToDisplay = store.searchByName(searchTerm)" type="search" placeholder="Enter Project Name">
                        <i class="fa-solid fa-magnifying-glass" id="search"></i>
                    </div>
                </form>
            </div>
        </div>

        <div class="projectlist-wrapper">

            <ProjectList :project="arrayToDisplay" v-if="viewType === 'all'"></ProjectList>

            <DisplaySummary v-if="viewType === 'summary'"></DisplaySummary>
        </div>    
    </div>

</template>

<style>
h1 {
    font-size: 48px;
    padding-left: 30px;
}
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
    margin: 20px 0px 10px;
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
    font-size: 22px;
}
.project-view {
    position: relative;
    top: 40px;
}
.top-bar {
    display: flex;
    flex-direction: row;
    padding: 10px 20px 0px;
    justify-content: space-between;
}
.user-actions {
    display: flex;
    flex-direction: row;
}
select {
    border-radius: 0px;
    width:50% ;
}
.status-filter {
    position: relative;
    top: 0px;
    font-size: medium;
}
.search-project {
    display:flex;
    flex-direction: row;
}
.search-bar:focus {
    position: relative;
    z-index: 3;
}
#search {
    position: relative;
    left: -95px;
    top: 19px;
}
</style>
