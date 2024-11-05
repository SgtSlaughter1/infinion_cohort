import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { mount } from "@vue/test-utils";
import NewCampaign from "@/views/NewCampaign.vue";
import { useCampaignStore } from "@/stores/CampaignStore";
import axios from "axios";

describe("NewCampaign.vue", () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up the Pinia store
    const pinia = createPinia();
    setActivePinia(pinia);

    wrapper = mount(NewCampaign, {
      global: {
        plugins: [pinia],
      },
      data() {
        return {
          showSuccessModal: false,
          errors: {
            general: "",
            campaignName: "",
            campaignDescription: "",
            startDate: "",
            endDate: "",
          },
        };
      },
    });
  });

  it("validates required fields", async () => {
    await wrapper.find("form").trigger("submit");

    expect(wrapper.vm.errors.campaignName).toBe("Campaign name is required");
    expect(wrapper.vm.errors.campaignDescription).toBe(
      "Campaign description is required"
    );
    expect(wrapper.vm.errors.startDate).toBe("Start date is required");
    expect(wrapper.vm.errors.endDate).toBe("End date is required");
  });

  it("validates end date is after start date", async () => {
    await wrapper.setData({
      startDate: "2024-12-01",
      endDate: "2024-11-01",
    });

    await wrapper.find("form").trigger("submit");
    expect(wrapper.vm.errors.endDate).toBe("End date must be after start date");
  });

  it("adds and removes keywords correctly", async () => {
    await wrapper.setData({ currentKeyword: "test-keyword" });
    await wrapper.find("#linkedKeywords").trigger("keydown.enter");

    expect(wrapper.vm.linkedKeywords).toContain("test-keyword");

    await wrapper.find(".remove-keyword").trigger("click");
    expect(wrapper.vm.linkedKeywords).toHaveLength(0);
  });

  it("successfully creates a campaign", async () => {
    const mockCampaignData = { id: 1, name: "Test Campaign" };
    const campaignStore = useCampaignStore();

    // Update the mock to properly set the store state
    vi.spyOn(campaignStore, "createCampaign").mockImplementation(async () => {
      campaignStore.createdCampaign = mockCampaignData;
      return mockCampaignData;
    });

    await wrapper.setData({
      campaignName: "Test Campaign",
      campaignDescription: "Test Description",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      dailyDigest: true,
      digestFrequency: "daily",
      linkedKeywords: ["test"],
      showSuccessModal: false,
    });

    await wrapper.vm.createCampaign();

    expect(campaignStore.createdCampaign).toEqual(mockCampaignData);
    expect(wrapper.vm.showSuccessModal).toBe(true);
    expect(wrapper.vm.createdCampaignId).toBe(1);
  });

  it("handles API errors correctly", async () => {
    const errorMessage = "Failed to create campaign";
    const campaignStore = useCampaignStore();

    // Update the mock to properly set the store error
    vi.spyOn(campaignStore, "createCampaign").mockImplementation(async () => {
      campaignStore.error = errorMessage;
      throw new Error(errorMessage);
    });

    await wrapper.setData({
      campaignName: "Test Campaign",
      campaignDescription: "Test Description",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      errors: { general: "" },
    });

    try {
      await wrapper.vm.createCampaign();
    } catch (error) {
    }

    await wrapper.vm.$nextTick();
    expect(campaignStore.error).toBe(errorMessage);
    expect(wrapper.vm.errors.general).toBe(errorMessage);
  });
});

describe("campaignStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it("formats campaign data correctly before sending to API", async () => {
    vi.spyOn(axios, "post").mockResolvedValueOnce({ data: { id: 1 } });

    const inputData = {
      name: "Test Campaign",
      description: "Test Description",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      dailyDigest: true,
      keywords: "test1,test2",
      digestFrequency: "daily",
    };

    const expectedFormattedData = {
      campaignName: "Test Campaign",
      campaignDescription: "Test Description",
      startDate: new Date("2024-12-01").toISOString(),
      endDate: new Date("2024-12-31").toISOString(),
      digestCampaign: true,
      linkedKeywords: ["test1", "test2"],
      dailyDigest: "daily",
    };

    const campaignStore = useCampaignStore();
    await campaignStore.createCampaign(inputData);

    expect(axios.post).toHaveBeenCalledWith(
      "https://infinion-test-int-test.azurewebsites.net/api/Campaign",
      expectedFormattedData,
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      }
    );
  });

  it("handles API errors and throws with appropriate message", async () => {
    const mockError = {
      response: {
        data: {
          message: "Failed to create campaign",
        },
      },
    };

    vi.spyOn(axios, "post").mockRejectedValueOnce(mockError);

    const campaignStore = useCampaignStore();
    const promise = campaignStore.createCampaign({
      name: "Test Campaign",
      description: "Test Description",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
    });

    await expect(promise).rejects.toThrow("Failed to create campaign");
  });
});
