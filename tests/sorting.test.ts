import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils';
import ProjectList from '@/components/ProjectList.vue';
import Sorting from '@/components/Sorting.vue';
import { useProjectStore, type Project, type ProjectStatus } from '@/stores/ProjectStore'
import { click } from '@testing-library/user-event/dist/cjs/convenience/click.js';

describe('Sort Table Values Testing', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('sort id', async () => {
        const wrapper = mount(ProjectList, {
            props: {
                project: [
                    { id: 1, project: 'Test Project', owner: 'Wynter Stroman', date: '2026-06-15', status: 'Not Started', description: 'Unit testing with Jest' },
                    { id: 2, project: 'Project Tracker', owner: 'Jada Felder', date: '2026-06-30', status: 'Complete', description: 'Make web app to track team projects'},
                    { id: 3, project: 'Jenkins Pipeline', owner: 'Minna Azeem', date: '2026-06-23', status: 'In Progress', description: 'Building pipeline with jenkins' },
                    
                ]
            }
        })

        const checkSort = async (
            columnNumber: number,
            columnName: keyof Project,
            ascendExpectedValue: number | string | ProjectStatus,
            descendExpectedValue: number | string | ProjectStatus,
        ) =>{
            /* ascending */
            const ascendButtons = wrapper.findAll('[data-test="ascend"]')
            await ascendButtons[columnNumber]?.trigger('click')
            expect(wrapper.props('project')[0]?.[columnName]).toBe(ascendExpectedValue)

            /* descending */
            const descendButtons = wrapper.findAll('[data-test="descend"]')
            await descendButtons[columnNumber]?.trigger('click')
            expect(wrapper.props('project')[0]?.[columnName]).toBe(descendExpectedValue)
        }

        /* Id */
        await checkSort(0, 'id', 1, 3)

        /* project */
        await checkSort(1, 'project', 'Jenkins Pipeline', 'Test Project')

        /* owner */
        await checkSort(2, 'owner', 'Jada Felder', 'Wynter Stroman')

        /* date */
        await checkSort(3, 'date', '2026-06-15', '2026-06-30')

        /* status */
        await checkSort(4, 'status', 'Complete', 'Not Started')

        /* description */
        await checkSort(5, 'description', 'Building pipeline with jenkins', 'Unit testing with Jest')
    });

})