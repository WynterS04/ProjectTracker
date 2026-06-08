<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore'
import type { Project } from '@/stores/ProjectStore'
import type { ProjectStatus } from '@/stores/ProjectStore'
import ProjectForm from '@/components/ProjectForm.vue'

const store = useProjectStore()

const headers = ['Id', 'Name', 'Owner', 'Date', 'Status', 'Description']

const arrayToDisplay = ref<Project[]>(store.projects)

const status = ref<ProjectStatus>('Not Started')

function getStatusArray(status: ProjectStatus) {
    arrayToDisplay.value = store.filterByStatus(status)
}

/* Delete Modal */
const showDeleteModal = ref(false)

function openDeleteModal() {
    showDeleteModal.value = true
}

function closeDeleteModal() {
    showDeleteModal.value = false
}

function confirmDelete(id: number) {
    store.deleteProject(id)
    closeDeleteModal()
}

/* Add Modal */
const showAddModal = ref(false)

function openAddModal() {
    showAddModal.value = true
}

function closeAddModal() {
    showAddModal.value = false
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
}

</script>

<template>
    <div class="all-projects">
        <table class="project-table">
            <thead>
                <tr>
                    <th v-for=" header in headers" :key="header">{{ header }}</th>

                    <!-- Filtering by Status -->
                    <th>
                        <form>
                            <label>Status Filtering</label>
                            <select class="status-filter" v-model="status" @change="getStatusArray(status)">
                                    <option value ="Not Started">Not Started</option>
                                    <option value = "In Progress">In-Progress</option>
                                    <option value = "Complete">Complete</option>
                            </select>
                        </form>
                    </th>

                    <!-- Search -->
                    <th>
                        <form>
                            <label for="searchName" style="text-align: end;">Search</label>
                            <input id="searchName" type="search" placeholder="Enter Project Name">
                        </form>
                    </th>
                </tr>
            </thead>
            <tbody>
                <p v-if="arrayToDisplay.length === 0">
                        No projects listed with this status.
                </p>
                <tr v-else v-for="(row, index) in arrayToDisplay" :key="index">
                    <td>{{ row.id }}</td>
                    <td>{{ row.project }}</td>
                    <td>{{ row.owner }}</td>
                    <td>{{ row.date }}</td>
                    <td>{{ row.status }}</td>
                    <td colspan="2">{{ row.description }}</td>

                    <!--confirm & delete project-->
                    <i class="fas fa-trash fa-lg" role="button" id="trash" @click="openDeleteModal()"></i>
                    <div v-if="showDeleteModal" class="modal-backdrop">
                        <div class="modal">
                            <h4>Delete Confirmation</h4>
                            <p>Are you sure you want to remove the project <strong>{{ row.project }}</strong>?</p>

                            <div class="modal-actions">
                                <button @click="closeDeleteModal">Cancel</button>
                                <button class="danger" @click="confirmDelete(row.id)">Delete</button>
                            </div>
                        </div>
                    </div>

                    <!--edit project-->
                    <i class="fa-solid fa-pen-to-square fa-lg" id="edit" @click="openEditModal(row)"></i>
                    <div v-if="showEditModal" class="modal-backdrop">
                        <div class="project-form-container">
                            <div class="modal-header">
                            <h1>Edit Project</h1>
                                <i class="fas fa-xmark" id="close" @click="closeEditModal"></i>
                            </div>

                            <div class="modal-body">
                                <ProjectForm v-if="selectedProject" :project="selectedProject" action="edit" buttonText="Save Changes" @project-edited="closeEditModal"></ProjectForm>
                            </div>
                        </div>
                    </div>
                </tr>
            </tbody>
        </table>

        <!--add project-->
        <i class="far fa-plus-square fa-lg" id="add" @click="openAddModal"></i>
        <div v-if="showAddModal" class="modal-backdrop">
            <div class="project-form-container">
                <div class="modal-header">
                <h1>New Project</h1>
                    <i class="fas fa-xmark" id="close" @click="closeAddModal"></i>
                </div>

                <div class="modal-body">
                    <ProjectForm action="add" buttonText="Add Project" @project-submitted="closeAddModal"></ProjectForm>
                </div>
            </div>
        </div>
  </div>

</template>

<style>
table {
    margin: 15px 20px 8px;
}
th {
    font-size: larger;
}
.status-filter {
    border-radius: 0px;
}
#trash, #edit {
    margin: 0px 8px 0px;
}
#trash:hover {
    color: rgb(243, 44, 31);
}
#edit:hover {
    color: rgba(14, 134, 231, 1.00)
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
  width: 400px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
button.danger {
  background: #e53935;
  color: white;
}
#add {
    margin: 0px 20px 20px
}
#add:hover {
    color: #00A86B;
}
.project-form-container {
    background: white;
    padding: 30px;
    margin: 50px;
    width: 40%;
    height: 84%;
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
    left: -35px;
    top: 13px;
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