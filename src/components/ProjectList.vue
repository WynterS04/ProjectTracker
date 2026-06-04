<script setup lang="ts">
import { ref } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore'
import type { Project } from '@/stores/ProjectStore'
import ProjectForm from '@/components/ProjectForm.vue'

const store = useProjectStore()

const headers = ['Id', 'Name', 'Owner', 'Date', 'Status', 'Description']

const confirmDelete = () => {

}

</script>

<template>
    <div class="all-projects">
        <table class="project-table">
            <thead>
                <tr>
                    <th v-for=" header in headers" :key="header">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in store.projects" :key="index">
                    <td>{{ row.id }}</td>
                    <td>{{ row.project }}</td>
                    <td>{{ row.owner }}</td>
                    <td>{{ row.date }}</td>
                    <td>{{ row.status }}</td>
                    <td>{{ row.description }}</td>
                    <i @click="confirmDelete" class="fas fa-trash fa-lg" id="trash"></i>
                    <i class="fa-solid fa-pen-to-square fa-lg" id="edit"></i>
                </tr>
            </tbody>
        </table>
  </div>

</template>

<style>
#trash, #edit {
    margin: 0px 8px 0px;
}
#trash:hover {
    color: rgb(243, 44, 31);
}
#edit:hover {
    color: rgba(14, 134, 231, 1.00)
}
</style>