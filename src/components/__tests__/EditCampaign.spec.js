import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import EditCampaign from '@/views/EditCampaign.vue';
import { useCampaignStore } from '@/stores/CampaignStore';

vi.mock('@/stores/CampaignStore', () => ({
    useCampaignStore: vi.fn(),
}));

describe('EditCampaign.vue', () => {
    let store;
    const mockRoute = {
        params: { id: '1' }
    };

    beforeEach(() => {
        store = {
            loadCampaign: vi.fn(),
            saveCampaignChanges: vi.fn(),
            updateCampaignStatus: vi.fn(),
            stopCampaign: vi.fn(),
            isLoading: false,
            showSuccessModal: false,
            error: null,
            setShowSuccessModal: vi.fn(),
        };

        useCampaignStore.mockReturnValue(store);
    });

    const createWrapper = () => {
        return mount(EditCampaign, {
            global: {
                mocks: {
                    $route: mockRoute,
                    $router: {
                        push: vi.fn(),
                    },
                },
            },
        });
    };

    it('loads campaign data on creation', async () => {
        const campaign = {
            id: '1',
            campaignName: 'Test Campaign',
            campaignDescription: 'A campaign for testing',
            startDate: '2022-01-01T00:00',
            endDate: '2022-12-31T00:00',
            linkedKeywords: ['keyword1', 'keyword2'],
            campaignStatus: 'Active',
            digestCampaign: true,
            dailyDigest: 'Daily',
        };

        store.loadCampaign.mockResolvedValue(campaign);

        const wrapper = createWrapper();

        await wrapper.vm.$nextTick(); // Wait for the component to process the created hook
        await wrapper.vm.loadCampaign(); // Explicitly call loadCampaign

        expect(store.loadCampaign).toHaveBeenCalledWith('1');
        expect(wrapper.vm.campaign).toEqual(campaign);
        expect(wrapper.vm.keywordsInput).toEqual('keyword1, keyword2');
    });

    it('saves campaign changes', async () => {
        const wrapper = createWrapper();
        wrapper.vm.campaign.campaignName = 'Updated Campaign';
        wrapper.vm.keywordsInput = 'newKeyword1, newKeyword2';

        store.saveCampaignChanges.mockResolvedValue(true);

        await wrapper.vm.saveCampaign();

        expect(store.saveCampaignChanges).toHaveBeenCalledWith({
            ...wrapper.vm.campaign,
            linkedKeywords: ['newKeyword1', 'newKeyword2'],
        });
    });

    it('handles campaign status change', async () => {
        const wrapper = createWrapper();
        const campaign = {
            id: '1',
            campaignName: 'Test Campaign',
            campaignDescription: 'A campaign for testing',
            startDate: '2022-01-01T00:00',
            endDate: '2022-12-31T00:00',
            linkedKeywords: ['keyword1', 'keyword2'],
            campaignStatus: 'Active',
            digestCampaign: true,
            dailyDigest: 'Daily',
        };

        store.loadCampaign.mockResolvedValue(campaign);
        await wrapper.vm.loadCampaign();
        
        wrapper.vm.campaign.campaignStatus = 'Inactive';
        await wrapper.vm.handleStatusChange();

        expect(store.updateCampaignStatus).toHaveBeenCalledWith('1', 'Inactive');
    });

    it('stops the campaign', async () => {
        const wrapper = createWrapper();
        const campaign = {
            id: '1',
            campaignName: 'Test Campaign',
            campaignDescription: 'A campaign for testing',
            startDate: '2022-01-01T00:00',
            endDate: '2022-12-31T00:00',
            linkedKeywords: ['keyword1', 'keyword2'],
            campaignStatus: 'Active',
            digestCampaign: true,
            dailyDigest: 'Daily',
        };

        store.loadCampaign.mockResolvedValue(campaign);
        await wrapper.vm.loadCampaign();

        await wrapper.vm.stopCampaign();

        expect(store.stopCampaign).toHaveBeenCalledWith('1');
    });

    it('navigates back when goBack is called', async () => {
        const wrapper = createWrapper();
        const routerPush = vi.fn();
        wrapper.vm.$router = { push: routerPush };

        await wrapper.vm.goBack();

        expect(routerPush).toHaveBeenCalledWith({ name: 'AllCampaigns' });
    });


});