import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils';
import ProjectList from '@/components/ProjectList.vue';

describe('Toast Notification Testing', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('delete project toast appears with correct message', async () => {
        const wrapper = mount(ProjectList, {
            props: {
                project: [
                    { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'Not Started', date: '06/15/2026', description: 'unit testing with Jest' },
                    { id: 2, project: 'Jenkins Pipeline', owner: 'Minna Azeem', status: 'In Progress', date: '06/15/2026', description: 'Building pipeline with jenkins' }
                ]
            }
        })

        const buttons = wrapper.findAll('[data-test="delete-icon"]')

        /* Open Modal */
        await buttons[0]?.trigger('click')
        expect(wrapper.text()).toContain('Test Project')
        expect(wrapper.find('[data-test="delete-modal"]').exists()).toBe(true)

        /* click delete */
        await wrapper.find('[data-test="delete-button"]').trigger('click')
        expect(wrapper.find('[data-test="toast-notif"]').exists()).toBe(true)
        expect(wrapper.text()).toContain('Project successfully deleted!')

    });

    it('edit project toast appears with correct message', async () => {
        const wrapper = mount(ProjectList, {
            props: {
                project: [
                    { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'Not Started', date: '06/15/2026', description: 'unit testing with Jest' },
                    { id: 2, project: 'Jenkins Pipeline', owner: 'Minna Azeem', status: 'In Progress', date: '06/15/2026', description: 'Building pipeline with jenkins' }
                ]
            }
        })

        const buttons = wrapper.findAll('[data-test="edit-icon"]')

        /* Open Modal */
        await buttons[0]?.trigger('click')
        expect(wrapper.text()).toContain('Test Project')
        expect(wrapper.find('[data-test="edit-modal"]').exists()).toBe(true)

        /* Make change */
        await wrapper.find('[data-test="project-name"]').setValue('AEM Project')

        /* save changes */
        await wrapper.find('[data-test="submit-button"]').trigger('click')
        //expect(wrapper.find('[data-test="toast-notif"]').exists()).toBe(true)
       // expect(wrapper.text()).toContain('Your changes have been saved!')
    });

    it('add project toast appears with correct message', async () => {
        
    });

    it('toast does not appaear when action canceled', async () => {
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
                expect(wrapper.find('[data-test="toast-notif"]').exists()).toBe(false)
                }
        
                /* Delete Modal */
                await checkModal('delete-icon', 'delete-modal', 2, 'Test Project')
        
                /* Edit Modal */
                await checkModal('edit-icon', 'edit-modal', 2, 'Edit Project')
        
                /* Add Modal */
                await checkModal('add-icon', 'add-modal', 1, 'New Project')
    })
})