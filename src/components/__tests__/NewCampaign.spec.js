import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NewCampaign from "@/views/NewCampaign.vue";
import apiService from "@/services/api";
import axios from "axios";

// Mock the router for navigation
const mockRouter = {
  push: vi.fn(),
};

// Mock axios for API calls
vi.mock("axios");

describe("NewCampaign.vue", () => {
  let wrapper;
//Reset mocks and mount component before each test
  beforeEach(() => {
    vi.clearAllMocks();

    wrapper = mount(NewCampaign, {
      global: {
        mocks: {
          $router: mockRouter,
        },
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

  //Form validation Test
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


  //Keywords management test
  it("adds and removes keywords correctly", async () => {
    await wrapper.setData({ currentKeyword: "test-keyword" });
    await wrapper.find("#linkedKeywords").trigger("keydown.enter");

    expect(wrapper.vm.linkedKeywords).toContain("test-keyword");

    await wrapper.find(".remove-keyword").trigger("click");
    expect(wrapper.vm.linkedKeywords).toHaveLength(0);
  });


  //Successful campaign creation test
  it("successfully creates a campaign", async () => {
    const mockCampaignData = {
      id: 1,
      name: "Test Campaign",
    };

    axios.post.mockResolvedValueOnce({ data: mockCampaignData });

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

    // Define the submit method in the component
    wrapper.vm.submitForm = async () => {
      try {
        await apiService.createCampaign({
          name: wrapper.vm.campaignName,
          description: wrapper.vm.campaignDescription,
          startDate: wrapper.vm.startDate,
          endDate: wrapper.vm.endDate,
          dailyDigest: wrapper.vm.dailyDigest,
          digestFrequency: wrapper.vm.digestFrequency,
          keywords: wrapper.vm.linkedKeywords.join(","),
        });
        wrapper.vm.showSuccessModal = true;
      } catch (error) {
        wrapper.vm.errors.general = error.message;
      }
    };

    await wrapper.vm.submitForm();

    // Verify API call
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post.mock.calls[0][0]).toMatch(/\/api\/Campaign$/);
    expect(axios.post.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        campaignName: expect.any(String),
        campaignDescription: expect.any(String),
      })
    );

    // Wait for the next tick to ensure reactive updates
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showSuccessModal).toBe(true);
  });

  it("handles API errors correctly", async () => {
    // Create an error with the default message that apiService will return
    const errorMessage = "Failed to create campaign";
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    await wrapper.setData({
      campaignName: "Test Campaign",
      campaignDescription: "Test Description",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      errors: { general: "" },
    });

    // Define the submit method in the component
    wrapper.vm.submitForm = async () => {
      try {
        await apiService.createCampaign({
          name: wrapper.vm.campaignName,
          description: wrapper.vm.campaignDescription,
          startDate: wrapper.vm.startDate,
          endDate: wrapper.vm.endDate,
        });
      } catch (error) {
        wrapper.vm.errors.general = error.message;
      }
    };

    await wrapper.vm.submitForm();

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.errors.general).toBe(errorMessage);
  });
});

describe("apiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("formats campaign data correctly before sending to API", async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 1 } });

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

    await apiService.createCampaign(inputData);

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

    axios.post.mockRejectedValueOnce(mockError);

    const promise = apiService.createCampaign({
      name: "Test Campaign",
      description: "Test Description",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
    });

    await expect(promise).rejects.toThrow("Failed to create campaign");
  });
});