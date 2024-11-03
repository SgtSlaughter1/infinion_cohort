import axios from "axios";

const API_BASE_URL =
  "https://infinion-test-int-test.azurewebsites.net/api/Campaign";

  
const apiService = {
  async createCampaign(campaignData) {
    try {
      // Format data to match API expectations
      const formattedData = {
        campaignName: campaignData.name,
        campaignDescription: campaignData.description,
        startDate: new Date(campaignData.startDate).toISOString(),
        endDate: new Date(campaignData.endDate).toISOString(),
        digestCampaign: Boolean(campaignData.dailyDigest),
        linkedKeywords: campaignData.keywords
          ? campaignData.keywords.split(",")
          : [],
        dailyDigest: campaignData.digestFrequency || "none",
      };

      console.log("Sending formatted data:", formattedData);

      const response = await axios.post(API_BASE_URL, formattedData, {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data?.message || "Failed to create campaign"
      );
    }
  },
};

export default apiService;
