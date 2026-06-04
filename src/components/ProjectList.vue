<script setup lang="ts">
import { ref } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore'
import type { Project } from '@/stores/ProjectStore';

const store = useProjectStore()

const headers = ['Id', 'Name', 'Owner', 'Date', 'Status', 'Description']

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
                </tr>
            </tbody>
        </table>
  </div>

</template>