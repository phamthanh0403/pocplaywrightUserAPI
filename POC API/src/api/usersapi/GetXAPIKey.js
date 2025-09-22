const { request } = require("@playwright/test");
const { ApiBase } = require("../ApiBase");

class GetXAPIKey extends ApiBase {
  constructor(context) {
    super(context);
    this.apiUrl = "/signup";
    this.headers = {};
  }

  async getXApiKey() {
    const res = await this.get("/signup", "");
    const body = await res.text();

    const apiKeys = body.match(/x-api-key:\s*([\w-]+)/);

    if (!apiKeys) {
      throw new Error("API key NOT found in HTML");
    }

    const apiKey = apiKeys[1];
    return apiKey;
  }

  async setAuthTokenAndXAPIKey(token, xApiKey) {
    this.headers = {
      "Content-Type": "application/json",
      accept: "application/json",
      //"Authorization": `Bearer ${token}`,
      "x-api-key": xApiKey,
    };

    return await request.newContext({
      baseURL: process.env.TEST_BASE_URL,
      extraHTTPHeaders: this.headers,
    });
  }
}

module.exports = { GetXAPIKey };

