// tests/apis/ETEFlowUser.spec.js
const { test, expect, request } = require('@playwright/test');
const { UsersApi } = require('../../src/api/usersapi/UsersAPIs');
const { Helper } = require('../../src/pages/Helper');
const { ApiBase } = require('../../src/api/ApiBase');
const { GetXAPIKey } = require('../../src/api/usersapi/GetXAPIKey');

test.describe('ETE Flow User', () => {
  let requestContext;
  let requestContextWithKey;
  let userApi;
  let helper;
  let genDateTimeString;
  let getXAPIKey;

  test.beforeAll(async () => {
    const config = ApiBase.getEnvConfig();

    requestContext = await request.newContext({
      baseURL: config.BASE_URL,
      extraHTTPHeaders: { 'Content-Type': 'application/json' }
    });

    userApi = new UsersApi(requestContext);
    helper = new Helper();
    getXAPIKey = new GetXAPIKey(requestContext);
  });

  // Create user and get info to update then delete
  test('Create user and get info to update then delete', async () => {
    requestContextWithKey = await userApi.loginSuccessully(requestContext);

    // Create user
    const email = "eve.holt@reqres.in";
    const password = "cityslicka";
    const user = { email, password };

    userApi = new UsersApi(requestContextWithKey);    
    const createRes = await userApi.createUser(user);
    const createBody = await createRes.json();

    expect(createRes.status()).toBe(200);
    expect(createBody).toHaveProperty('id');
    expect(createBody).toHaveProperty('token');

    const newUserId = userApi.userId;

    // Update User
    const emailUpdated = "eve.holt@reqres.in UPDATED";
    const passwordUpdated = "cityslicka UPDATED";
    const updatedUser = await userApi.createNewUserObject(emailUpdated, passwordUpdated);

    const updateRes = await userApi.updateUser(newUserId, updatedUser);
    const updateBody = await updateRes.json();

    expect(updateRes.status()).toBe(200);
    expect(updateBody.email).toBe(emailUpdated);
    expect(updateBody.password).toBe(passwordUpdated);

    // Delete User
    const deleteRes = await userApi.deleteUser(newUserId);
    expect(deleteRes.status()).toBe(204);
  });

  // GET existing user - Update info
  test('GET existing user - Update info', async () => {
    requestContextWithKey = await userApi.loginSuccessully(requestContext);
    const userId = await userApi.getFirstUser();

    genDateTimeString = helper.genDateTimeString();

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
});
