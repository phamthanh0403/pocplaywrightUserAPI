// tests/apis/GetUser.spec.js
const { test, expect, request } = require('@playwright/test');
const { UsersApi } = require('../../src/api/usersapi/UsersAPIs');
const { GetXAPIKey } = require('../../src/api/usersapi/GetXAPIKey');
const { ApiBase } = require('../../src/api/ApiBase');

test.describe('Get User', () => {
  let requestContext;
  let getXAPIKey;
  let requestContextWithKey;
  let userApi;
  let userId;

  test.beforeAll(async () => {
    const config = ApiBase.getEnvConfig();

    requestContext = await request.newContext({
      baseURL: config.BASE_URL,
      extraHTTPHeaders: { 'Content-Type': 'application/json' }
    });

    userApi = new UsersApi(requestContext);
    getXAPIKey = new GetXAPIKey(requestContext);
  });

  // Get User successfully
  test('Get User Successfully', async () => {
    userId = await userApi.getFirstUser();
    requestContextWithKey = await userApi.loginSuccessully(requestContext);

    userApi = new UsersApi(requestContextWithKey);
    const res = await userApi.getUser(userId);  
    const body = await res.json();

    // Assert
    console.log("IDDD :" + userId);
    expect(res.status()).toBe(200);
    expect(body.data.id).toBe(userId);  
    expect(body.data).toHaveProperty('name');
  });

  // Get failed with 404 User Not Found
  test('Get failed with 404 User Not Found', async () => {
    requestContextWithKey = await userApi.loginSuccessully(requestContext);
    
    // set random invalid userId
    userId = Math.floor(1000 + Math.random() * 9000);
    userApi = new UsersApi(requestContextWithKey);
    console.log('UserId*********** ' + userId);
    
    const res = await userApi.getUser(userId);
    
    // Assert
    expect(res.status()).toBe(404);
  });

  // Get failed with 403 Forbidden
  test('Get failed with 403 Forbidden', async () => {
    userId = await userApi.getFirstUser();

    // Set api-key = invalid
    requestContextWithKey = await getXAPIKey.setAuthTokenAndXAPIKey('', 'invalid');
    console.log('UserId*********** ' + userId);
   
    userApi = new UsersApi(requestContextWithKey);
    const res = await userApi.getUser(userId);

    expect(res.status()).toBe(403); 
    expect(body.error).toBe('Invalid or inactive API key');
  });
});
