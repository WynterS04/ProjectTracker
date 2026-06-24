import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils';
import ProjectForm from '@/components/ProjectForm.vue';
import { useProjectStore } from '@/stores/ProjectStore'

describe('Project Form Validation Testing', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('shows error when fields are empty', async () => {
        const wrapper = mount(ProjectForm)

        await wrapper.find('[data-test="submit-button"]').trigger('click')

        const input = wrapper.find('input')
        expect((input.element as HTMLInputElement).validity.valueMissing).toBe(true)
    });

    it('valid input', async () => {
        const wrapper = mount(ProjectForm)
        const input = wrapper.find('input')

        const setInput = async (
            expectedData: string,
            expectedInput: string
        ) => {
            const data = wrapper.find(`[data-test="${expectedData}"]`)
            expect(data.exists()).toBe(true)

            await data.setValue(expectedInput)
            expect((data.element as HTMLInputElement).value).toBe(expectedInput)
        }
        /* Project Name */
        await setInput('project-name','Project XYZ')

        /* Owner */
        await setInput('owner','Wynter')

        /* Date */
        await setInput('date','2026-06-15')

        /* Status */
        await setInput('status','In Progress')

        /* Description */
        await setInput('description','project details')

        expect((input.element as HTMLInputElement).validity.valueMissing).toBe(false)
    })
})