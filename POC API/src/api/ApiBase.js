const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

class ApiBase {
  constructor(context) {
    this.apiRequest = context;
  }

  async get(url, options) {
    return await this.apiRequest.get(url, options);
  }

  async post(url, data) {
    return await this.apiRequest.post(url, { data });
  }

  async put(url, data) {
    return await this.apiRequest.put(url, { data });
  }

  async delete(url) {
    return await this.apiRequest.delete(url);
  }

  static getEnvConfig() {
    //console.log("RAW ENV VARS:", process.env.TEST_BASE_URL);
    const envName = process.env.TARGET_ENV || "TEST"; // get from user, if not set = TEST
    const prefix = envName.toUpperCase();
    return {
      BASE_URL: process.env[`${prefix}_BASE_URL`]
    };
    

  }
}

module.exports = { ApiBase };
