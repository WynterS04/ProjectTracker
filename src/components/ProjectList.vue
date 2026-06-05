<script setup lang="ts">
import { ref } from 'vue'
import { reactive } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore'
import type { Project } from '@/stores/ProjectStore'
import type { ProjectStatus } from '@/stores/ProjectStore'
import ProjectForm from '@/components/ProjectForm.vue'

const store = useProjectStore()

const headers = ['Id', 'Name', 'Owner', 'Date', 'Status', 'Description']


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
} //listener for project-submitted

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
                    <i class="fa-solid fa-pen-to-square fa-lg" id="edit"></i>
                    
                </tr>
            </tbody>
        </table>

        <!--add project-->
        <i class="far fa-plus-square fa-lg" id="add" @click="openAddModal"></i>
        <div v-if="showAddModal" class="modal-backdrop">
            <div class="project-form-container">
                <h1>New Project</h1>

                <div class="modal-body">
                    <ProjectForm @project-submitted="closeAddModal"></ProjectForm>
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
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 15px;
}
</style>