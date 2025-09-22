// tests/apis/DeleteUser.spec.js
const { test, expect, request } = require('@playwright/test');
const { UsersApi } = require('../../src/api/usersapi/UsersAPIs');
const { GetXAPIKey } = require('../../src/api/usersapi/GetXAPIKey');
const { ApiBase } = require('../../src/api/ApiBase');

test.describe('Delete User', () => {
  let requestContext;
  let requestContextWithKey;
  let getXAPIKey;
  let userApi;

  test.beforeAll(async () => {
    const config = ApiBase.getEnvConfig();

    requestContext = await request.newContext({
      baseURL: config.BASE_URL,
      extraHTTPHeaders: { 'Content-Type': 'application/json' }
    });

    getXAPIKey = new GetXAPIKey(requestContext);
    userApi = new UsersApi(requestContext);
  });

  // Delete User successfully
  test('Delete User Successfully', async () => {
    const userId = await userApi.getFirstUser();
    requestContextWithKey = await userApi.loginSuccessully(requestContext);

    userApi = new UsersApi(requestContextWithKey);
    const res = await userApi.deleteUser(parseInt(userId));

    expect(res.status()).toBe(204);
  });

  // Delete failed with 403 Forbidden
  test('Delete failed with incorrect XAPIKey', async () => {
    requestContextWithKey = await getXAPIKey.setAuthTokenAndXAPIKey('', 'xApiKey');
    const userId = await userApi.getFirstUser();

    userApi = new UsersApi(requestContextWithKey);
    const res = await userApi.deleteUser(parseInt(userId));

    expect(res.status()).toBe(403);
    expect(body.error).toBe('Invalid or inactive API key');
  });

  // Delete failed with 401 Unauthorized
  test('Delete failed with 401 Unauthorized', async () => {
    const userId = await userApi.getFirstUser();
    requestContext = await getXAPIKey.setAuthTokenAndXAPIKey('', '');

    userApi = new UsersApi(requestContext);
    const res = await userApi.deleteUser(userId);

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Missing API key');
  });
});
