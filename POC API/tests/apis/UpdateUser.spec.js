const { test, expect, request } = require("@playwright/test");
const { UsersApi } = require("../../src/api/usersapi/UsersAPIs");
const { GetXAPIKey } = require("../../src/api/usersapi/GetXAPIKey");
const { Helper } = require("../../src/pages/Helper");
const { ApiBase } = require("../../src/api/ApiBase");

test.describe("Update User", () => {
  let requestContext;
  let requestContextWithKey;
  let getXAPIKey;
  let userApi;
  let helper;
  let userId;

  test.beforeAll(async () => {
    const config = ApiBase.getEnvConfig();
    requestContext = await request.newContext({
      baseURL: config.BASE_URL,
      extraHTTPHeaders: {
        "Content-Type": "application/json",
      },
    });

    getXAPIKey = new GetXAPIKey(requestContext);
    userApi = new UsersApi(requestContext);
    helper = new Helper();

    // hard code for userId
    userId = 4;
  });

  test("Update User Successfully", async () => {
    requestContextWithKey = await userApi.loginSuccessully(requestContext);

    const genDateTimeString = helper.genDateTimeString();
    const email = "eve.holt" + genDateTimeString + "@reqres.in";
    const password = "cityslicka" + genDateTimeString;

    const user = { email, password };

    userApi = new UsersApi(requestContextWithKey);
    const res = await userApi.updateUser(userId, user);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.email).toBe(email);
    expect(body.password).toBe(password);
  });

    test("Update User failed with 403 Forbidden", async () => {
    requestContextWithKey = await getXAPIKey.setAuthTokenAndXAPIKey('', 'invalid');

    const genDateTimeString = helper.genDateTimeString();
    const email = "eve.holt" + genDateTimeString + "@reqres.in";
    const password = "cityslicka" + genDateTimeString;

    const user = { email, password };

    userApi = new UsersApi(requestContextWithKey);
    const res = await userApi.updateUser(userId, user);

    expect(res.status()).toBe(403);
    expect(body.error).toBe('Invalid or inactive API key');
  });

    test("Update User failed with 401 Unauthorized", async () => {
    requestContextWithKey = await getXAPIKey.setAuthTokenAndXAPIKey('', '');

    const genDateTimeString = helper.genDateTimeString();
    const email = "eve.holt" + genDateTimeString + "@reqres.in";
    const password = "cityslicka" + genDateTimeString;

    const user = { email, password };

    userApi = new UsersApi(requestContextWithKey);
    const res = await userApi.updateUser(userId, user);

    expect(res.status()).toBe(401);
  });
});
