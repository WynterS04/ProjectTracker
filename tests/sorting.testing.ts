import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils';
import ProjectList from '@/components/ProjectList.vue';
import Sorting from '@/components/Sorting.vue';
import { useProjectStore } from '@/stores/ProjectStore'

describe('Sorting Table Values Testing', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('sort id', async () => {
        const wrapper = mount(ProjectList, {
            props: {
                project: [
                    { id: 1, project: 'Test Project', owner: 'Wynter Stroman', status: 'Not Started', date: '2026-06-15', description: 'Unit testing with Jest' },
                    { id: 2, project: 'Jenkins Pipeline', owner: 'Minna Azeem', status: 'In Progress', date: '2026-06-30', description: 'Building pipeline with jenkins' }
                ]
            }
        })
        const sortWrapper = mount(Sorting)
        /* ascending */
        await sortWrapper.find('[data-test="ascend"]').trigger('click')
        const projects = wrapper.findAll('tbody tr')
        expect(projects[0]).toContain('Jenkins Pipeline')

        /* descending */
    });

})