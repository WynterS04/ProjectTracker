import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export type ProjectStatus = 'Not Started' | 'In Progress' | 'Complete'

export interface Project { 
id: number 
project: string 
owner: string 
status: ProjectStatus 
date: string 
description: string
}

export const useProjectStore = defineStore('project', {
    state: () => ({
        projects: [
            {id: 0, project: 'Project Tracker', owner: 'Wynter Stroman', status: 'In Progress', date: '06/15/2026', description: 'Building web app to track team projects'},
            {id: 1, project: 'Project Tracker', owner: 'Minna Azeem', status: 'In Progress', date: '06/15/2026', description: 'Building web app to track team projects'},
            {id: 2, project: 'Jenkins Pipeline', owner: 'Wynter Stroman', status: 'Not Started', date: '06/23/2026', description: 'Automate tasks after code is pushed'}
        ] as Project[]
    }),
    getters: {
        filterByStatus(state) {
             return (status: ProjectStatus)  => { 
                return state.projects.filter(project => project.status === status) //returns array of projects only with the given status
            }
        },
        summmarizeProjects(state) {
            let totalNotStarted = 0, totalInProgress = 0, totalCompleted = 0;
            
            for(let project of this.projects) {
                if(project.status === 'Not Started'){
                    totalNotStarted++
                }else if(project.status === 'In Progress') {
                    totalInProgress++
                }else{
                    totalCompleted++
                }
            }
            const summary: number[] = [state.projects.length, totalNotStarted, totalInProgress, totalCompleted]
            return summary
        },
        searchProjects(state) {

        }
    },
    actions: {
        addProject(newProject: Project) {
            this.projects.push(newProject)
        },
        deleteProject(id: number) {
            let index = this.projects.findIndex(p => p.id === id)
            console.log(index)
            let removed = this.projects.splice(index, 1)
            console.log(removed)
        },
        updateProject(updatedProject: Project) {
            let index = this.projects.findIndex(p => p.id === updatedProject.id)
            this.projects[index] = updatedProject
        }
    }
})