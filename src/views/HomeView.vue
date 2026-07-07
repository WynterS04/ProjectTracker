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
    <div class="nav-bar">
        <h1>BCBS Project Tracker</h1>
    </div>

    <div class="page-wrapper" role="main">
        <h1>Projects</h1>
        <div class="top-bar">
            <div class="project-view">

                <!--Separate view buttons -->
                <button data-test="all-projects-button" @click="viewType = 'all';">All Projects</button>
                <button data-test="project-summary-button" @click="viewType = 'summary';">Summary</button>
            </div>

            <div class="user-actions">
                <!-- Filtering By Status -->
                <form class="status-filter">
                    <label>Status Filtering</label>
                    <select aria-label="Status" data-test="status-select" v-model="status">
                            <option value ="Not Started">Not Started</option>
                            <option value = "In Progress">In-Progress</option>
                            <option value = "Complete">Complete</option>
                            <option :value=null>All</option>
                    </select>
                </form>

                <!-- Search -->
                <form>
                    <label for="search-bar" style="text-align: end; position: relative; left: -30px;">Search</label>
                    <div class="search-project">
                        <input id="search-bar" v-model="searchTerm" @input="arrayToDisplay = store.searchByName(searchTerm)" type="search" placeholder="Enter Project Name">
                        <i class="fa-solid fa-magnifying-glass" id="search" aria-hidden="true"></i>
                    </div>
                </form>
            </div>
        </div>

        <div class="projectlist-wrapper">

            <!--Project Views Implementation-->
            <ProjectList :project="arrayToDisplay" v-if="viewType === 'all'"></ProjectList>

            <DisplaySummary v-if="viewType === 'summary'"></DisplaySummary>
        </div>
    </div>

</template>

<style>
.page-wrapper h1 {
    font-size: clamp(1.6rem, 4vw, 3rem);;
    padding-left: 30px;
}
.page-wrapper {
    background-color: white;
    padding: 20px;
    margin: 0px 70px 0px;
    height: 70vh;
    width: 90vw;
    border-radius: 3px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.22);
}
.projectlist-wrapper {
    padding: 1.2rem 2rem 1.5rem;
    border-radius: 5px;
}
h1{
    margin: 20px 0px 10px;
}
.project-view button:hover{
    color:darkgrey ;
    background: transparent;
    text-decoration: underline;
}
.project-view button {
    border: transparent;
    background: transparent;
    color: black;
    padding: 0px 12px 0px;
    font-size: clamp(1rem, 2vw, 1.5rem);
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
    font-size: clamp(1rem, 2vw, 1.5rem);
}
.status-filter select:hover {
    cursor: pointer;
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
