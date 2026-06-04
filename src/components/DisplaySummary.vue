<script setup>
import { ref } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore';

const store = useProjectStore()

const totals = store.summmarizeProjects

const  statuses = ref([
    { status: 'Not Started', color: 'grey', total:totals[1]},
    { status: 'In Progress', color: 'orange', total:totals[2]},
    { status: 'Completed', color: 'green', total:totals[3]}
])

</script>

<template>
    <div class="project-summary">
        <h2>Summary</h2>
        <div v-for="status in statuses" :key="status.id"> 
            <p>{{ status.status }} - {{ status.total }}</p>
        </div>
        <p>Total: {{ totals[0] }}</p>
    </div>
</template>