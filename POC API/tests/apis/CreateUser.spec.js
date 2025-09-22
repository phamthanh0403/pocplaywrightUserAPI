// tests/apis/CreateUser.spec.js
const { test, expect, request } = require('@playwright/test');
const { UsersApi } = require('../../src/api/usersapi/UsersAPIs');
const { GetXAPIKey } = require('../../src/api/usersapi/GetXAPIKey');
const { Helper } = require('../../src/pages/Helper');
const { ApiBase } = require('../../src/api/ApiBase');

test.describe('Create User', () => {
  let requestContext;
  let requestContextWithKey;
  let userApi;
  let helper;
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

  // Create User successfully
  test('Create User Successfully', async () => {
    requestContextWithKey = await userApi.loginSuccessully(requestContext);

    const email = "eve.holt@reqres.in";
    const password = "cityslicka";
    const user = { email, password };

    userApi = new UsersApi(requestContextWithKey);
    const res = await userApi.createUser(user);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('token');
  });

  // Create failed with invalid param
  test('Create failed with invalid param', async () => {
    requestContextWithKey = await userApi.loginSuccessully(requestContext);

    const user = { email: 'invalidEmail', password: '' };

    userApi = new UsersApi(requestContextWithKey);
    const res = await userApi.createUser(user);

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing password');
  });

  // Create failed with 401 Unauthorized
  test('Create failed with 401 Unauthorized', async () => {
    requestContext = await getXAPIKey.setAuthTokenAndXAPIKey('', '');

    const email = "eve.holt@reqres.in";
    const password = "cityslicka";
    const user = { email, password };

    userApi = new UsersApi(requestContext);
    const res = await userApi.createUser(user);

    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Missing API key');
  });
});
