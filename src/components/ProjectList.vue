<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore'
import type { Project } from '@/stores/ProjectStore'
import type { ProjectStatus } from '@/stores/ProjectStore'
import ProjectForm from '@/components/ProjectForm.vue'
import Sorting from './Sorting.vue'
import ToastNotification from './ToastNotification.vue'
import { hover } from '@testing-library/user-event/dist/cjs/convenience/hover.js'
import { hideAllPoppers } from 'floating-vue'

const store = useProjectStore()
const props = defineProps<{
    project: Project[]
}>()

const headers = [
    {key: 'id', label: 'Id'},
    {key: 'project', label: 'Name'},
    {key: 'owner', label:'Owner'},
    {key: 'date', label:'Date'},
    {key: 'status', label:'Status'},
    {key: 'description', label:'Description'}
] satisfies {key: keyof Project; label: string}[]

const hoveredRow = ref()
const menuOpen = ref()

/* Delete Modal */
const showDeleteModal = ref(false)

const openDeleteModal = (project: Project) => {
    selectedProject.value = project
    showDeleteModal.value = true
}

function closeDeleteModal() {
    showDeleteModal.value = false
}

function confirmDelete(id: number) {
    store.deleteProject(id)
    closeDeleteModal()
    showToast.value = true
    toastMessage.value = 'Project successfully deleted!'
}

/* Add Modal */
const showAddModal = ref(false)

function openAddModal() {
    showAddModal.value = true
}

function closeAddModal() {
    showAddModal.value = false
    showToast.value = true
    toastMessage.value = 'New project added successfully!'
}

/* Edit Modal */
const showEditModal = ref(false)

const selectedProject = ref<Project | null>(null)

function openEditModal (project: Project) {
  selectedProject.value = project
  showEditModal.value = true
}

function closeEditModal() {
    showEditModal.value = false
    selectedProject.value = null
    showToast.value = true
    toastMessage.value = 'Your changes have been saved!'
}

/* Overdue Projects */
const now = ref(new Date())
const oneHour = 60 * 60 * 1000

//updates date every hour
onMounted(() => {
  setInterval(() => {
    now.value = new Date()
  }, oneHour)
})

function isOverdue(date: string, status: ProjectStatus) {
    return new Date(date) < now.value && status !== 'Complete'
}

/*Toast Notification */
const toastMessage = ref('')
const showToast = ref(false)

/* Sorting */
function handleSort (field: keyof Project, direction: 'asc' | 'desc') {
    props.project.sort((a,b) => {
    const aValue = a[field]
    const bValue = b[field]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction === 'asc' ? aValue.localeCompare(bValue): bValue.localeCompare(aValue)
        }

        return direction === 'asc' ? Number(aValue) - Number(bValue): Number(bValue) - Number(aValue)
    })
}
</script>

<template>
    <div class="all-projects">
        <p v-if="props.project.length === 0" class="no-projects">
            No projects listed.
        </p>
        <table v-else class="project-table" data-test="project-table">
            <thead>
                <tr>
                    <th v-for=" header in headers" :key="header.key">
                        <div class="table-header">
                            <div class="thead-name">{{ header.label }} </div>
                            <div class="thead-sort"> <Sorting :arrayToSort="props.project" :sortBy="header.key" @sort="handleSort"/> </div>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>

                <!-- Display Projects -->
                <tr data-test="project-row"
                v-for="(row, index) in props.project"
                :key="index"
                :class="{overdue: isOverdue(row.date, row.status)}"
                @mouseenter="hoveredRow = row.id"
                @mouseleave="hoveredRow = null"
                >
                    <td class="id-column">{{ row.id }}</td>
                    <td>{{ row.project }}</td>
                    <td>{{ row.owner }}</td>
                    <td data-test="date">{{ row.date }}</td>
                    <td>{{ row.status }}</td>
                    <td>{{ row.description }}</td>

                    <td class="actions">
                    <!--action menu-->
                        <VDropdown placement="right" :distance="10">
                            <button
                            v-show="hoveredRow === row.id || menuOpen === row.id"
                            class="action-button"
                            @click="showEditModal = false, showDeleteModal = false"
                            >
                                ...
                            </button>

                            <template #popper>
                                <div class="action-menu" @mouseenter="menuOpen = row.id" @mouseleave="menuOpen = null">
                                    <!--Edit button-->
                                    <button class="edit-button" type="button" aria-label="Edit" @click="openEditModal(row), hideAllPoppers()">
                                    <i data-test="edit-icon" class="fa-solid fa-pen-to-square fa-lg" aria-hidden="true"></i>
                                    Edit
                                    </button>

                                    <!--Delete button-->
                                    <button class="trash-button" type="button" aria-label="Delete" @click="openDeleteModal(row), hideAllPoppers()">
                                        <i data-test="delete-icon" class="fas fa-trash fa-lg" aria-hidden="true"></i>
                                        Delete
                                    </button>
                                </div>
                            </template>
                        </VDropdown>
                        <!--Edit Modal-->
                        <div v-if="showEditModal" class="modal-backdrop">
                            <div data-test="edit-modal" class="project-form-container">
                                <div class="modal-header">
                                    <h1>Edit Project</h1>
                                    <button class="close-button" type="button" aria-label="close" @click="showEditModal=false">
                                         <i data-test="cancel-button" class="fas fa-xmark" id="close-icon" aria-hidden="true"></i>
                                    </button>
                                </div>

                                <div class="modal-body">
                                    <ProjectForm v-if="selectedProject" :project="selectedProject" action="edit" buttonText="Save Changes" @project-edited="closeEditModal"></ProjectForm>
                                </div>
                            </div>
                        </div>

                        <!--Delete Modal-->
                        <div v-if="showDeleteModal" class="modal-backdrop">
                            <div data-test="delete-modal" class="modal">
                                <h3>Delete Confirmation</h3>
                                <p>Are you sure you want to remove the "<strong>{{ selectedProject?.project }}</strong>" project?</p>

                                <div class="delete-actions">
                                    <button data-test="cancel-button" @click="closeDeleteModal">Cancel</button>
                                    <button data-test="delete-button" class="danger" @click="selectedProject && confirmDelete(selectedProject.id)">Delete</button>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <!--add project-->
        <div class="add-project" >
            <button type="button" aria-label="Add Project" class="add-project-button" @click="openAddModal">
                <div class="add-icon">
                    <i data-test="add-icon" class="far fa-plus-square fa-lg" id="add" aria-hidden="true"></i>
                </div>
                <div class="add-text">
                    <p>Add Project</p>
                </div>
            </button>
        </div>
        <div v-if="showAddModal" class="modal-backdrop">
            <div data-test="add-modal" class="project-form-container">
                <div class="modal-header">
                <h1>New Project</h1>
                    <button class="close-button" type="button" aria-label="close" @click="showAddModal=false">
                        <i data-test="cancel-button" class="fas fa-xmark fa-lg" id="close-icon" aria-hidden="true"></i>
                    </button>
                </div>

                <div class="modal-body">
                    <ProjectForm action="add" buttonText="Add Project" @project-submitted="closeAddModal"></ProjectForm>
                </div>
            </div>
        </div>
        <ToastNotification @closeToast="showToast=false" :message="toastMessage" :showToast="showToast"></ToastNotification>
  </div>

</template>

<style>
.no-projects {
    font-size: larger;
    margin: 1.5% auto;
    padding-left: 3%;
}
table {
    border-collapse: collapse;
    width: 90%;
    height: 30%;
    margin: 1.5% auto;
}
.table-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
thead {
    background: #d2eaf4e7;
}
th {
    font-size: clamp(0.8rem, 2vw, 1.5rem);
    padding: 1rem 0.7rem 1rem;
}
tr {
    font-size: clamp(0.8rem, 2vw, 1.2rem);
}
th, td {
    border: 1px solid black;
}
.overdue td{
    background-color: #fca6a5a2;
}
td {
    padding: 1rem 0.9rem;
}
.actions{
    background-color: white!important;
    border: none;
}
td.actions{
    width: 3%;
    padding: 0.5rem 0.5rem;
}
label {
    font-size: 1.5rem;
}
.id-column {
    text-align: center;
    padding: 0px !important;
}
.action-button {
    background-color: transparent;
    border: none;
    font-size: clamp(0.8rem, 2vw, 1.2rem);
    margin-bottom: 0.2rem;
    padding-bottom:0.5rem;
}
.action-button:hover{
    background-color: lightgray;
}
.action-menu{
    display: flex;
    flex-direction: column;
    align-items: start;
    padding: 1.1rem 0.6rem;
    gap: 1.3rem;
}
.action-menu button {
    background-color: transparent;
    border: none;
}
.action-menu i{
    padding-right: 0.3rem;
}
.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
  width: 25rem;
  line-height: 28px;
}
.trash-button:hover{
    background-color: transparent;
    color: rgb(243, 44, 31);
}
.edit-button:hover{
    background-color: transparent;
    color: #00A86B;
}
.modal-header h1 {
    font-size: clamp(0.5rem, 2vw+2rem, 2.8rem);
    padding: 0px
             clamp(1rem, 2vw, 3rem)
             clamp(0.3rem, 1vw, 0.6rem);
}
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: clamp(0.8rem, 2vw, 1.3rem)
            clamp(0.8rem, 2vw, 1.3rem)
            clamp(1rem, 2vw, 1.5rem);
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.delete-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
.delete-actions button {
    padding: 0.3rem;
    border-radius: 8px;
    font-size: large;
    border: 1px solid black;
    box-shadow: 0 3px 3px rgba(0,0,0,0.2);
}
button:hover {
    background: rgba(0, 0, 0, 0.5);
}
button.danger:hover {
    background: rgb(114, 4, 4);
    color: black;
}
button.danger {
  background: #e53935;
  color: white;
}
.add-project-button {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width:fit-content;
    color: black;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    margin: 1% 2.5%;
}
.add-text p{
    font-size: clamp( 0.5rem, 2vw, 1rem);
}
#add {
    font-size: clamp( 0.5rem, 2vw, 1.3rem);
    margin: clamp(0.8rem, 2rem, 1.5rem) 0.8rem;
}
.add-project-button:hover  {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    transform: translateY(-5px) scale(1.03);
    cursor: pointer;
    background-color: transparent;
    color: #233CCA;
}
.project-form-container {
    background: white;
    padding: 1.8rem;
    width: 35vw;
    height: 85vh;
    border-radius: 12px;
    box-shadow: 3px 3px 4px 3px rgba(0,0,0,0.25);

    display: flex;
    flex-direction: column;
}
.modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}
.close-button {
    background-color: transparent;
    border: none;
    margin: clamp(1.5rem, 2vw, 2.5rem)
            clamp(1.3rem, 2vw, 2rem)
            0px;
}
.close-button:hover{
    background-color: transparent;
}
#close-icon {
    font-size: large;
}
#close-icon:hover {
    color: rgba(99, 98, 98, 0.416);
}
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 15px;
}
</style>