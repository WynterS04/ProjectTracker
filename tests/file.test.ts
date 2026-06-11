/// <reference types="vitest/globals" />

import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue'
import { useProjectStore } from '@/stores/ProjectStore'

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
        const store = useProjectStore()
        const totals = store.summmarizeProjects
        const wrapper = mount(HomeView);
        await wrapper.find('[data-test="project-summary-button"]').trigger('click');

        expect(wrapper.text()).toContain('Not Started - ${totals[1]}')
        expect(wrapper.text()).toContain('In Progress - ${totals[2]}')
        expect(wrapper.text()).toContain('Complete - ${totals[3]}')
        expect(wrapper.text()).toContain('Total')
        expect(wrapper.text()).toContain(totals[0])
    }

    )
});