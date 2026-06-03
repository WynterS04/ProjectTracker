<script setup>
import { ref } from 'vue'

const  statuses = ref([
    { status: 'Not Started', color: 'grey', total: 3},
    { status: 'In Progress', color: 'orange', total: 4},
    { status: 'Completed', color: 'green', total: 2}
])

</script>

<template>
    <div class="project-summary">
        <h2>Overview</h2>
        <div 
        v-for="status in statuses"
        :key="status.id"
        class="color-circle" 
        :style="{ backgroundColor: status.color }" > 
            <p>{{ status.status }} - {{ status.total }}</p>
        </div>
    </div>
</template>