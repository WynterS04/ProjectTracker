import { defineStore } from 'pinia'


export type ProjectStatus = 'Not Started' | 'In Progress' | 'Complete'

export interface Project {
id: number
project: string
owner: string
date: string
status: ProjectStatus
description: string
}

export const useProjectStore = defineStore('project', {
    state: () => ({
        projects: [
            {id: 1, project: 'Project Tracker', owner: 'Wynter Stroman', date: '2026-06-15', status: 'Complete', description: 'Building web app to track team projects'},
            {id: 2, project: 'AEM Project 2', owner: 'Wynter Stroman', date: '2026-06-30', status: 'Not Started', description: 'Create content fragments'},
            {id: 3, project: 'Jest Unit Tests', owner: 'Minna Azeem', date: '2026-06-15', status: 'In Progress', description: 'Make unit tests in Jest'}
        ] as Project[]
    }),
    getters: {
        filterByStatus(state) {
             return (status: ProjectStatus)  => {
                return state.projects.filter(project => project.status === status)     //uses .filter array method to return arary of projects w/ given status
            }
        },
        searchByName(state) {
            return(name: String) => {
                return state.projects.filter(project => project.project.toLowerCase().includes(name.toLowerCase()))  //uses project name to filter array
            }
        },
        summmarizeProjects(state) {                                                                            //counts projects and each one with a given status
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
        }
    },
    actions: {
        addProject(newProject: Project) {
            newProject.id = this.projects.length + 1
            this.projects.push(newProject)                      //pushes new project to end of array
        },
        deleteProject(id: number) {
            let index = this.projects.findIndex(p => p.id === id)         //finds project to remove
            console.log(index)
            let removed = this.projects.splice(index, 1)                  //removes it with splice
            console.log(removed)
        },
        updateProject(updatedProject: Project, id: number) {
            let index = this.projects.findIndex(p => p.id === id)           //finds project to edit

            if(index !== -1){
                this.projects[index] = updatedProject                      //replaces with new project
            }
        }
    }
})