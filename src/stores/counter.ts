import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export type ProjectStatus = 'Not Started' | 'In Progress' | 'Complete'

export interface Project { 
id: number 
name: string 
owner: string 
status: ProjectStatus 
dueDate: string 
description: string

}

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
