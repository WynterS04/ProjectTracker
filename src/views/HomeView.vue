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
                    <label class="search" for="search-bar">Search</label>
                    <div class="search-project">
                        <input id="search-bar" v-model="searchTerm" @input="arrayToDisplay = store.searchByName(searchTerm)" type="search" placeholder="Enter Project Name">
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
    font-size: clamp(2rem, 4vw, 3rem);;
    padding-left: clamp(0.8rem, 1rem, 2rem);
}
.page-wrapper {
    background-color: white;
    padding: clamp(1rem,  2rem, 1.5rem);
    margin: 0 auto;
    height: clamp(40vh, 2rem+2vh,70vh);
    width: 90vw;
    border-radius: 3px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.22);
}
.projectlist-wrapper {
    padding: clamp(0.8rem, 1rem ,1.5rem)
             clamp(0.5, 1rem, 2rem);
    border-radius: 5px;
}
h1{
    margin: 1.2rem 0px 0.6rem;
}
.project-view button:hover{
    color:darkgrey ;
    background: transparent;
}
.project-view button {
    border: transparent;
    background: transparent;
    color: black;
    padding: 0px 
             clamp(0.8rem, 1rem, 1rem)
             0px;
    font-size: clamp(1rem, 2vw, 1.5rem);
    font-family: 'Times New Roman', Times, serif;
}
.project-view {
    position: relative;
    top: clamp(1rem, 3vw, 2.5rem);
}
.top-bar {
    display: flex;
    flex-direction: row;
    padding: clamp(0.4rem, 0.2rem + 1vw, 0.6rem)
             clamp(0.8rem, 0.2rem + 1vw, 1.3rem)
             clamp(0.2rem, 0.2rem + 2vw, 0.5rem);
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
.status-filter label {
    font-size: clamp(1rem, 2vw, 1.5rem);
}
.status-filter select:hover {
    cursor: pointer;
}
.search {
    font-size: clamp(1rem, 2vw, 1.5rem);
}
.search-bar {
    width: 20%;
}
</style>
