/// <reference types="vitest/globals" />

import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue'
import { useProjectStore } from '@/stores/ProjectStore'
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


describe('HomeView', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    
    it('display all projects button', async () => {
        const wrapper = mount(HomeView);
        await wrapper.find('[data-test="all-projects-button"]').trigger('click');

        expect(wrapper.find('[data-test="project-table"').exists()).toBe(true);
        wrapper.unmount();
    });

    it('display summary of projects', async () => {
        const wrapper = mount(HomeView);
        const store = useProjectStore()
        const totals = store.summmarizeProjects
        
        await wrapper.find('[data-test="project-summary-button"]').trigger('click');

        expect(wrapper.text()).toContain(`Not Started - ${totals[1]}`)
        expect(wrapper.text()).toContain(`In Progress - ${totals[2]}`)
        expect(wrapper.text()).toContain(`Complete - ${totals[3]}`)
        expect(wrapper.text()).toContain('Total')
        expect(wrapper.text()).toContain(totals[0])
    });

    it('status filtering', async () => {
        const wrapper = mount(HomeView)
        const store = useProjectStore()
        const totals = store.summmarizeProjects

        const select = wrapper.find('[data-test="status-select"]')

        const checkFilter = async (
            value: string | null,
            expectedCount: number | undefined,
            expectedText?: string
        ) => {
            await select.setValue(value)

            const rows = wrapper.findAll('tbody tr')

            expect(rows.length).toEqual(expectedCount)
            if(expectedCount === 0 || expectedCount === undefined){
                expect(wrapper.text()).toContain('No projects listed with this status.')
            }

            if (expectedText) {
            rows.forEach(row => {
                expect(row.text()).toContain(expectedText)
            })
            }
        }

        /* Select All */
        await checkFilter(null, totals[0])

        /* Select Not Started */
        await checkFilter('Not Started', totals[1], 'Not Started')

        /* Select In Progress */
        await checkFilter('In Progress', totals[2], 'In Progress')

        /* Select Complete */
        await checkFilter('Complete', totals[3], 'Complete')
    });

    /*
    it('search projects', async () => {
        const wrapper = mount(HomeView)
        const store = useProjectStore()
        render(HomeView)
        const rows = wrapper.findAll('tbody tr')

        const input = screen.getByRole('textbox')
        

        await userEvent.type(input, '')
    });*/

});