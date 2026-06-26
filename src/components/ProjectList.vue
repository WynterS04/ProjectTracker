<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
                >
                    <td>{{ row.id }}</td>
                    <td>{{ row.project }}</td>
                    <td>{{ row.owner }}</td>
                    <td data-test="date">{{ row.date }}</td>
                    <td>{{ row.status }}</td>
                    <td colspan="2">{{ row.description }}</td>

                    <div class="icons">
                    <!--confirm & delete project-->
                    <div class="trash">
                        <button class="trash-button" type="button" aria-label="Delete" @click="openDeleteModal(row)">
                            <i id="trash-icon" data-test="delete-icon" class="fas fa-trash fa-lg" role="button"></i>
                        </button>
                        <div v-if="showDeleteModal" class="modal-backdrop">
                            <div data-test="delete-modal" class="modal">
                                <h3>Delete Confirmation</h3>
                                <p>Are you sure you want to remove the "<strong>{{ selectedProject?.project }}</strong>" project?</p>

                                <div class="modal-actions">
                                    <button data-test="cancel-button" @click="closeDeleteModal">Cancel</button>
                                    <button data-test="delete-button" class="danger" @click="selectedProject && confirmDelete(selectedProject.id)">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--edit project-->
                    <div class="edit">
                        <button class="edit-button" type="button" aria-label="Edit" @click="openEditModal(row)">
                        <i data-test="edit-icon" class="fa-solid fa-pen-to-square fa-lg" id="edit-icon" ></i>
                        </button>
                        <div v-if="showEditModal" class="modal-backdrop">
                            <div data-test="edit-modal" class="project-form-container">
                                <div class="modal-header">
                                <h1>Edit Project</h1>
                                    <button class="close-button" type="button" aria-label="close" @click="showEditModal=false">
                                        <i data-test="cancel-button" class="fas fa-xmark" id="close-icon"></i>
                                    </button>
                                </div>

                                <div class="modal-body">
                                    <ProjectForm v-if="selectedProject" :project="selectedProject" action="edit" buttonText="Save Changes" @project-edited="closeEditModal"></ProjectForm>
                                </div>
                            </div>
                        </div>
                    </div>

                    </div>
                </tr>
            </tbody>
        </table>

        <!--add project-->
        <div class="add-project" >
            <button type="button" aria-label="Add Project" class="add-project-button" @click="openAddModal">
                <div class="add-icon">
                    <i data-test="add-icon" class="far fa-plus-square fa-lg" id="add"></i>
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
                        <i data-test="cancel-button" class="fas fa-xmark fa-lg" id="close-icon"></i>
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
.modal-header h1 {
    font-size: 48px;
    padding: 0px 50px 10px;
}
.no-projects {
    font-size: larger;
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
    background-color: #fca6a5a2;
}
td {
    padding: 20px 15px;
}
label {
    font-size: 23px;
}
.trash-button {
    margin: 17px 18px 17px;
    padding: 0px;
    background-color: transparent;
    border: none;
}
.trash-button:hover{
    background-color: transparent;
}
#trash-icon:hover {
    color: rgb(243, 44, 31);
}
.edit-button {
    margin: 17px 18px 17px;
    padding: 0px;
    background-color: transparent;
    border: none;
}
.edit-button:hover{
    background-color: transparent;
}
#edit-icon:hover {
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
    justify-content: space-around;
    width:fit-content;
    color: black;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    margin: 28px 0px 0px 20px;
}
.add-text p{
    margin: 13px 12px;
    font-size: 120%;
}
#add {
    font-size: 150%;
    margin: 21px 0px 10px 14px;
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
.close-button {
    position: relative;
    left: -70px;
    top: 40px;
    background-color: transparent;
    border: none;
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