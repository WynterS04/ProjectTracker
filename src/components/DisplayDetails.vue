<script setup>
import { ref } from 'vue'

const  details = ref([ 
    { name: 'Project Tracker', owner: 'Wynter Stroman', status: 'In-Progress', date: '06/15/26'},
    { name: 'Jenkins Pipeline', owner: 'Wynter Stroman', status: 'In-Progress', date: '06/15/26'},
    
])

</script>

<template>
      <div class="all-projects">
    <table v-show="viewType === 'all'" class="project-table">
            <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Staus</th>
                <th>Date</th>
            </tr>
            <tr>
                <td v-for="detail in details" :key="detail.id"> {{ detail.name }} </td>
            </tr>
        </table>
  </div>
</template>