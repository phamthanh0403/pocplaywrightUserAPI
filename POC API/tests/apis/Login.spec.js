// tests/apis/Login.spec.js
const { test, expect, request } = require('@playwright/test');
const { ApiBase } = require('../../src/api/ApiBase');
const { UsersApi } = require("../../src/api/usersapi/UsersAPIs");

test.describe('Login API Test', () => {
  let requestContext;  
  let userApi;
  test.beforeAll(async () => {
    // Lấy config từ .env
    const config = ApiBase.getEnvConfig();

    // Tạo request context cho toàn bộ test
    requestContext = await request.newContext({
      baseURL: config.BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json'
      }
    });

    // initiate userAPI    
    userApi = new UsersApi(requestContext);
  });

  test('Login Successfully', async () => {
    requestContext = await userApi.loginSuccessully(requestContext);
    const requestBody = {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka'
    };
    
    userApi = new UsersApi(requestContext);
    const res = await userApi.login(requestBody);
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body).toHaveProperty('token');
  });

  test('Login Failed With empty password', async () => {
    requestContext = await userApi.loginSuccessully(requestContext);
    const requestBody = {
      email: 'eve.holt@reqres.in',
      password: ''
    };
    
    userApi = new UsersApi(requestContext);
    const res = await userApi.login(requestBody);
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body.error).toBe('Missing password');
  });
});
