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
