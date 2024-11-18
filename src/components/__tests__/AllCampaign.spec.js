import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shallowMount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AllCampaigns from '/src/views/AllCampaign.vue';
import { useCampaignStore } from '@/stores/CampaignStore';

// Mock Bootstrap Modal
vi.mock('bootstrap', () => ({
    Modal: vi.fn(() => ({
        show: vi.fn(),
        hide: vi.fn()
    }))
}));

describe('AllCampaigns', () => {
    let wrapper;
    let store;

    // Setup before each test: create a new Pinia store and mount the AllCampaigns component
    beforeEach(() => {
        setActivePinia(createPinia());
        store = useCampaignStore();

        document.body.innerHTML = `
        <div id="deleteModal"></div>`;

        wrapper = shallowMount(AllCampaigns, {
            global: {
                plugins: [createPinia()],
                mocks: {
                    $router: {
                        push: vi.fn()
                    }
                },
                stubs: {
                    'router-link': true,
                    'v-pagination': true
                }
            }
        });
    });

    // Cleanup after each test: clear mocks and reset the document body
    afterEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '';
    });

    // Test that the delete modal opens and sets the campaignToDelete correctly
    it('should open the delete modal when openDeleteModal is called', async () => {
        const campaignId = '123';

        // Call the store's openDeleteModal method directly
        store.openDeleteModal(campaignId);
        
        // Check if campaignToDelete is set correctly in the store
        expect(store.campaignToDelete).toBe(campaignId);
        expect(store.showDeleteDialog).toBe(true); // Assuming this is set to show the dialog
    });

    // Test that a campaign is deleted when confirmDelete is called
    it('should delete the campaign when confirmDelete is called', async () => {
        const campaignId = '123';

        // Mock store's deleteCampaign method
        const deleteCampaignMock = vi.fn().mockResolvedValue();
        vi.spyOn(store, 'deleteCampaign').mockImplementation(deleteCampaignMock);

        // Set the campaign to delete
        store.openDeleteModal(campaignId);

        // Call confirmDelete
        await store.confirmDelete(); // Ensure you await this

        // Wait for any promises to resolve
        await flushPromises();

        // Verify the deletion
        expect(store.deleteCampaign).toHaveBeenCalledWith(campaignId);
        expect(store.campaignToDelete).toBeNull(); // Ensure this is checked
        expect(store.showDeleteDialog).toBe(false); // Assuming this closes the dialog
    });

    // Test that navigating to the view campaign page works correctly
    it('should navigate to the view campaign page', async () => {
        const campaignId = '123';
        await wrapper.vm.$router.push({
            name: 'ViewCampaign',
            params: { id: campaignId }
        });

        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
            name: 'ViewCampaign',
            params: { id: campaignId }
        });
    });

    // Test that navigating to the edit campaign page works correctly
    it('should navigate to the edit campaign page', async () => {
        const campaignId = '456';
        await wrapper.vm.$router.push({
            name: 'EditCampaign',
            params: { id: campaignId }
        });

        expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
            name: 'EditCampaign',
            params: { id: campaignId }
        });
    });
});