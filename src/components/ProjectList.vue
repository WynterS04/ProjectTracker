<script setup lang="ts">
import { ref } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore'
import type { Project } from '@/stores/ProjectStore'
import type { ProjectStatus } from '@/stores/ProjectStore'
import ProjectForm from '@/components/ProjectForm.vue'
import Sorting from './Sorting.vue'
import ToastNotification from './ToastNotification.vue'

const store = useProjectStore()
const props = defineProps<{
    project: Project[]
}>()

const arrayToDisplay = ref<Project[]>([...props.project])

const headers = [
    {key: 'id', label:'Id'}, 
    {key: 'project', label: 'Name'}, 
    {key: 'owner', label:'Owner'}, 
    {key: 'date', label:'Date'}, 
    {key: 'status', label:'Status'}, 
    {key: 'description', label:'Description'}
] satisfies {key: keyof Project; label: string}[]

const status = ref<ProjectStatus>('Not Started')

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
    toastMessage.value = 'New project successfully added!'
}

/* Edit Modal */
const showEditModal = ref(false)

const selectedProject = ref<Project | null>(null)

const openEditModal = (project: Project) => {
  selectedProject.value = project
  showEditModal.value = true
}

function closeEditModal() {
    showEditModal.value = false
    selectedProject.value = null
    showToast.value = true
    toastMessage.value = 'Your changes saved successfully!'
}

/* Overdue Projects */
const isOverdue = (date: string) => {
    return new Date(date) < new Date();
}

/*Toast Notification */
const toastMessage = ref('')
const showToast = ref(false)

/* Sorting */
function handleSort (field: keyof Project, direction: 'asc' | 'desc') {
    arrayToDisplay.value.sort((a,b) => {
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
        <table class="project-table" data-test="project-table">
            <thead>
                <tr>
                    <th v-for=" header in headers" :key="header.key">
                        <div class="table-header">
                            <div class="thead-name">{{ header.label }} </div>
                            <div class="thead-sort"> <Sorting :arrayToSort="arrayToDisplay" :sortBy="header.key" @sort="handleSort"/> </div>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>

                <!-- Display Projects -->
                <p v-if="arrayToDisplay.length === 0" style="font-size:larger ;">
                        No projects listed with this status.
                </p>
                <tr data-test="project-row" v-else v-for="(row, index) in arrayToDisplay" :key="index" :class="{overdue: isOverdue(row.date)}">
                    <td>{{ row.id }}</td>
                    <td>{{ row.project }}</td>
                    <td>{{ row.owner }}</td>
                    <td>{{ row.date }}</td>
                    <td>{{ row.status }}</td>
                    <td colspan="2">{{ row.description }}</td>

                    <div class="icons">
                    <!--confirm & delete project-->
                    <i data-test="delete-icon" class="fas fa-trash fa-lg" role="button" id="trash" @click="openDeleteModal(row)"></i>
                    <div v-if="showDeleteModal" class="modal-backdrop">
                        <div data-test="delete-modal" class="modal">
                            <h3>Delete Confirmation</h3>
                            <p>Are you sure you want to remove the "<strong>{{ selectedProject?.project }}</strong>" project?</p>

                            <div class="modal-actions">
                                <button data-test="cancel-button" @click="closeDeleteModal">Cancel</button>
                                <button data-test="delete-button" class="danger" @click="confirmDelete(row.id)">Delete</button>
                            </div>
                        </div>
                    </div>

                    <!--edit project-->
                    <i data-test="edit-icon" class="fa-solid fa-pen-to-square fa-lg" id="edit" @click="openEditModal(row)"></i>
                    <div v-if="showEditModal" class="modal-backdrop">
                        <div data-test="edit-modal" class="project-form-container">
                            <div class="modal-header">
                            <h1>Edit Project</h1>
                                <i data-test="cancel-button" class="fas fa-xmark" id="close" @click="showEditModal=false"></i>
                            </div>

                            <div class="modal-body">
                                <ProjectForm v-if="selectedProject" :project="selectedProject" action="edit" buttonText="Save Changes" @project-edited="closeEditModal"></ProjectForm>
                            </div>
                        </div>
                    </div>
                    </div>
                </tr>
            </tbody>
        </table>

        <!--add project-->
        <div class="add-project-button" @click="openAddModal">
            <i data-test="add-icon" class="far fa-plus-square fa-lg" id="add"></i>
            <p>Add Project</p>
        </div>
        <div v-if="showAddModal" class="modal-backdrop">
            <div data-test="add-modal" class="project-form-container">
                <div class="modal-header">
                <h1>New Project</h1>
                    <i data-test="cancel-button" class="fas fa-xmark fa-lg" id="close" @click="showAddModal=false"></i>
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
.modal-header h1 {
    font-size: 48px; 
    padding: 0px 50px 10px;
}
table {
    margin: 25px 20px 15px;
    border-collapse: collapse;
    width: 95%;
}
.table-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
thead {
    background: #d2eaf4e7;
}
th, tr {
    font-size: larger;
    padding: 20px 13px 20px;
}
th, td {
    border: 1px solid black;
}
.overdue td{
    background-color: #f59593a2;
}
td {
    padding: 20px 15px;
}
label {
    font-size: 23px;
}
#trash {
    margin: 17px 18px 17px;
}
.icons{
    padding: 15px 3px;
}
#trash:hover {
    color: rgb(243, 44, 31);
}
#edit:hover {
    color: #00A86B
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-header {
    margin: 20px 0px 25px;
}
.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
  width: 400px;
  line-height: 28px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
.modal-actions button {
    padding: 5px;
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
    justify-content: center;
    width:fit-content;
    color: black;
    border-radius: 8px;
    margin: 25px 0px 0px 20px;
}
.add-project-button p {
    margin: 13px 12px;
    font-size: 18px;
}
#add {
    margin: 24px 0px 10px 15px;
}
.add-project-button:hover  {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    transform: translateY(-5px) scale(1.03);
    color: #233CCA;
    cursor: pointer;
}
.project-form-container {
    background: white;
    padding: 30px;
    margin: 50px;
    width: 40%;
    height: 85%;
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
#close {
    position: relative;
    left: -70px;
    top: 40px;
}
#close:hover {
    color: rgba(99, 98, 98, 0.416);
}
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 15px;
}
</style>