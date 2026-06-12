/// <reference types="vitest/globals" />

import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils';
import ProjectList from '@/components/ProjectList.vue';
import { useProjectStore } from '@/stores/ProjectStore'
import type { Project } from '@/stores/ProjectStore';

describe('Project List Testing', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it('opens correct modal and cancels properly', async () => {
        const wrapper = mount(ProjectList, {
            props: {
            project: [
                { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'Not Started', date: '06/15/2026', description: 'unit testing with Jest' },
                { id: 2, project: 'Jenkins Pipeline', owner: 'Minna Azeem', status: 'In Progress', date: '06/15/2026', description: 'Building pipeline with jenkins' }
            ]
            }
        })

         const checkModal = async (
            expectedIcon: string,
            expectedModal: string,
            numberOfIcons: number,
            expectedText?: string
        ) => {

        const buttons = wrapper.findAll(`[data-test="${expectedIcon}"]`)
        expect(buttons.length).toBe(numberOfIcons)

        /* Open Modal */
        await buttons[0]?.trigger('click')
        expect(wrapper.text()).toContain(expectedText)
        expect(wrapper.find(`[data-test="${expectedModal}"]`).exists()).toBe(true)

        /* Cancel button */
        await wrapper.find('[data-test="cancel-button"]').trigger('click')
        expect(wrapper.find(`[data-test="${expectedModal}"]`).exists()).toBe(false)
        expect(wrapper.props('project').length).toBe(2)
        }

        /* Delete Modal */
        await checkModal('delete-icon', 'delete-modal', 2, 'Test Project')

        /* Edit Modal */
        await checkModal('edit-icon', 'edit-modal', 2, 'Edit Project')

        /* Add Modal */
        await checkModal('add-icon', 'add-modal', 1, 'New Project')
    });

    it('delete project works', async () => {
        const wrapper = mount(ProjectList, {
            props: {
            project: [
                { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'In Progress', date: '06/15/2026', description: 'unit testing with Jest' }
            ]}
        })
        const store = useProjectStore()
        store.projects = [
            { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'In Progress', date: '06/15/2026', description: 'unit testing with Jest' },
            { id: 2, project: 'Project Tracker', owner: 'Wynter Stroman', status: 'Complete', date: '06/15/2026', description: 'Building web app to track team projects'},
            { id: 3, project: 'Jenkins Pipeline', owner: 'Minna Azeem', status: 'Not Started', date: '06/21/2026', description: 'Building pipeline with jenkins' }
        ]

        store.deleteProject(2)
        expect(store.projects.length).toBe(2)
        expect(store.projects[0]?.id).toBe(1)
        expect(store.projects[1]?.id).toBe(3)

    });

    it('edit project works', async () => {
        const wrapper = mount(ProjectList, {
            props: {
            project: [
                { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'In Progress', date: '06/15/2026', description: 'unit testing with Jest' }
            ]}
        })
        const store = useProjectStore()
        store.projects = [
            { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'In Progress', date: '06/15/2026', description: 'unit testing with Jest' },
            { id: 2, project: 'Project Tracker', owner: 'Wynter Stroman', status: 'Complete', date: '06/15/2026', description: 'Building web app to track team projects'},
            { id: 3, project: 'Jenkins Pipeline', owner: 'Minna Azeem', status: 'Not Started', date: '06/21/2026', description: 'Building pipeline with jenkins' }
        ]

        const updatedProject: Project =
        { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'Complete', date: '06/15/2026', description: 'unit testing with Jest' }

        const projects = store.projects
        store.updateProject(updatedProject, 1)
        expect(projects[projects.findIndex(p => p.id === 1)]?.status).toBe('Complete')
    });

    it('add project works', async () => {
        const wrapper = mount(ProjectList, {
            props: {
            project: [
                { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'In Progress', date: '06/15/2026', description: 'unit testing with Jest' }
            ]}
        })
        const store = useProjectStore()
        store.projects = [
            { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'In Progress', date: '06/15/2026', description: 'unit testing with Jest' },
            { id: 2, project: 'Project Tracker', owner: 'Wynter Stroman', status: 'Complete', date: '06/15/2026', description: 'Building web app to track team projects'},
            { id: 3, project: 'Jenkins Pipeline', owner: 'Minna Azeem', status: 'Not Started', date: '06/21/2026', description: 'Building pipeline with jenkins' }
        ]

        const newProject: Project =
         {id: (store.projects.length + 1), project: 'Project Tracker', owner: 'Minna Azeem', status: 'In Progress', date: '06/15/2026', description: 'Building web app to track team projects'}
        store.addProject(newProject)
        expect(store.projects.length).toBe(4)
        expect(store.projects[3]?.id).toBe(4)
    });
})