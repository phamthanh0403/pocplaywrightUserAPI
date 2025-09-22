const { request } = require("@playwright/test");
const { ApiBase } = require("../ApiBase");
const { GetXAPIKey } = require("./GetXAPIKey");

class UsersApi extends ApiBase {
  constructor(context) {
    super(context);
    this.apiCreateUser = "/api/register";
    this.apiUser = "/api/user/";
    this.apiGetMultipleUsers = "/api/users";
    this.loginApi = "/api/login";
    this.getXAPIKey = null;
    this.userId = null;
  }

  async login(body) {
    return this.post(this.loginApi, body);
  }

  async loginWithValidCredential() {
    const requestBody = {
      email: "eve.holt@reqres.in",
      password: "cityslicka",
    };

    const res = await this.login(requestBody);
    const body = await res.json();

    //console.log("TOKEN##########: ", body);
    return body?.token ?? null;
  }

  async loginSuccessully(requestContext) {
    // no need to call this step since login need x-api-token
    // this.loginApi = new LoginApi(requestContext);
    // var token = await this.loginApi.loginWithValidCredential();

    this.getXAPIKey = new GetXAPIKey(requestContext);
    const xApiKey = await this.getXAPIKey.getXApiKey();
    // console.log("xApiKey    ####" + xApiKey);
    return this.getXAPIKey.setAuthTokenAndXAPIKey("", xApiKey);
  }

  async createNewUserObject(email, password) {
    return {
      email: email,
      password: password,
    };
  }

  async createUser(signupUser) {
    const requestBody = {
      email: signupUser.email,
      password: signupUser.password,
    };

    const res = await this.post(this.apiCreateUser, requestBody);

    const bodyJson = await res.json().catch(() => null);
    this.userId = bodyJson?.id ?? null;

    return res;
  }

  async updateUser(id, user) {
    const updateAPI = this.apiUser + id;
    const requestBody = {
      email: user.email,
      password: user.password,
    };

    return await this.put(updateAPI, requestBody);
  }

  async getUser(id) {
    const getAPI = this.apiUser + id;
    return await this.get(getAPI);
  }

  async getUsers() {
    return this.get(this.apiGetMultipleUsers);
  }

  async getFirstUser() {
    const user = await this.getUsers();
    const body = await user.json();
    const firstId = body?.data?.[0]?.id ?? null;
    return firstId;
  }

  async deleteUser(id) {
    const deleteAPI = this.apiUser + id;
    return this.delete(deleteAPI);
  }
}

module.exports = { UsersApi };
//// add comment with new code
//test.js