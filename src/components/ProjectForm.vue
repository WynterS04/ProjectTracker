<script setup lang="ts">
import { reactive } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore'
import type { Project } from '@/stores/ProjectStore'
import type { ProjectStatus } from '@/stores/ProjectStore'

const emit = defineEmits(['project-submitted'])

const store = useProjectStore()

const add = reactive({
    projectName: '',
    owner: '',
    date: '',
    status: 'Not Started' as ProjectStatus,
    description: ''
})

let id: number = 0

const onSubmit = () => {
    const newProject: Project = {
        id: id++,
        project: add.projectName,
        owner: add.owner,
        date: add.date,
        status: add.status,
        description: add.description
    }
    store.addProject(newProject)

    emit('project-submitted', newProject)

    add.projectName = ''
    add.owner = ''
    add.date = ''
    add.status = 'Not Started' as ProjectStatus
    add.description = ''
}

</script>

<template>       
            <form class="project-form" @submit.prevent="onSubmit">
                <label for="name">Project Name<span style="color: black;">&#8277;</span></label>
                <input v-model="add.projectName" id="name" placeholder="Project XYZ" required>
                
                <label for="owner">Owner<span style="color: black;">&#8277;</span></label>
                <input v-model="add.owner" id="owner" placeholder="John Doe" required>

                <label for="date">Due Date<span style="color: black;">&#8277;</span></label>
                <input v-model="add.date"  id="date" type="date" required>

                <label for="status">Status<span style="color: black;">&#8277;</span></label>
                <select v-model="add.status" id="status" required>
                    <option> </option>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>

                <label for="description">Description<span style="color: black;">&#8277;</span></label>
                <textarea v-model="add.description" id="description" rows="4" placeholder="Enter project overview" required></textarea>

                <div class="button-wrapper">
                    <input class="button" type="submit" value="Add Project">
                </div>
            </form>
</template>

<style>
h1 {
    margin: 10px 50px 30px;
}
label{
    display: block;
    margin: 0px 50px;
    font-weight: bold;
    font-size: large;
}
input, select, textarea{
    display: block;
    margin: 10px 50px 20px;
    border: 1px solid rgba(68, 67, 67, 0.274);
    border-radius: 8px;
    padding: 7px;
    font-family: serif, Arial, Helvetica;
    font-size: medium;
}
#name, #owner, #description{
    width: 80%;
}
#date, #status {
    width:30%
}
input::placeholder, select::placeholder, textarea::placeholder {
    color: rgba(0,0,0,1s);
    opacity: 0.8;
    font-family: serif, Arial, Helvetica;
    font-size: medium;
}
.button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
.button{
    font-weight: bold;
    font-size: medium;
    background-color: white;
    width: fit-content;
    padding: 10px ;
    border: none;
    background-color: #233CCA;
    color: white;
}
.button:hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    transform: translateY(-8px) scale(1.03);
}
</style>