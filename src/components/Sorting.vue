<script setup lang="ts">
import { ref } from 'vue'
import type { Project } from '@/stores/ProjectStore'
import { useProjectStore } from '@/stores/ProjectStore';

const emit = defineEmits<{
    (e: 'sort', field: keyof Project, direction: 'asc' | 'desc'): void
}>()

const store = useProjectStore()

const props = defineProps<{
    sortBy: keyof Project
}>()

const arrayToDisplay = ref<Project[]>(store.projects)

function sortAscending () {
    emit('sort', props.sortBy, 'asc')
}

function sortDescending () {
    emit('sort', props.sortBy, 'desc')
}

</script>
<template>
    <div class="sort-actions">
        <div data-test="ascend" class="ascend" @click="sortAscending">&#9650;</div>
        <div data-test="descend" class="descend" @click="sortDescending" >&#9660;</div>
    </div>
</template>
<style>
.sort-actions {
    display: flex;
    flex-direction: column;
    color: #b0adad;
    font-size: 13.3px;
    padding-left: 12px;
}
.ascend:hover, .descend:hover{
    cursor: pointer;
}
</style>