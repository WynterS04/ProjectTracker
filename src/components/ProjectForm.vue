<script setup lang="ts">
import { reactive } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore'
import type { Project } from '@/stores/ProjectStore'
import type { ProjectStatus } from '@/stores/ProjectStore'
import ToastNotification from './ToastNotification.vue'

const emit = defineEmits(['project-submitted', 'project-edited'])

const store = useProjectStore()

const props = defineProps<{
    project?: Project
    buttonText: string
    action: 'add' | 'edit'
}>()

const form = reactive({
  projectName: props.project?.project ?? '',
  owner: props.project?.owner ?? '',
  date: props.project?.date ?? '',
  status: props.project?.status ?? '' as ProjectStatus,
  description: props.project?.description ?? ''
})

const onSubmit = () => {
    const newProject: Project = {
        id: props.project?.id ?? 0,
        project: form.projectName,
        owner: form.owner,
        date: form.date,
        status: form.status,
        description: form.description
    }
    console.log(props.action)
    console.log(newProject.id)
    if(props.action === "add") {
        store.addProject(newProject)

        emit('project-submitted', newProject)

        form.projectName = ''
        form.owner = ''
        form.date = ''
        form.status = 'Not Started' as ProjectStatus
        form.description = ''
    }else{
        store.updateProject(newProject, newProject.id)
        emit('project-edited', newProject)
    }
}
</script>

<template>
            <form class="project-form" @submit.prevent="onSubmit">
                <label for="name">Project Name<span style="color: #D71515 ;">&#8277;</span></label>
                <input data-test="name" v-model="form.projectName" id="name" placeholder="Project XYZ" required>

                <label for="owner">Owner<span style="color: #D71515;">&#8277;</span></label>
                <input data-test="owner" v-model="form.owner" id="owner" placeholder="John Doe" required>

                <label for="date">Due Date<span style="color: #D71515;">&#8277;</span></label>
                <input data-test="date" v-model="form.date"  id="date" type="date" required>

                <label for="status">Status<span style="color: #D71515;">&#8277;</span></label>
                <select data-test="status" v-model="form.status" id="status" required>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Complete</option>
                </select>

                <label for="description">Description<span style="color: #D71515;">&#8277;</span></label>
                <textarea data-test="description" v-model="form.description" id="description" rows="4" placeholder="Enter project overview" required></textarea>

                <div class="button-wrapper">
                    <input data-test="submit-button" class="button" type="submit" :value="props.buttonText">
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
    font-size: large;
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