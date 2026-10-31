const apiconfig = require('../apiconfig.json');

function apiRequest(method, path, accessToken, body, timeout = 30000) {
  const request = {
    method,
    url: `${apiconfig.baseUrl}${path}`,
    timeout,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
    failOnStatusCode: false,
  };

  if (body !== undefined) {
    request.body = body;
  }

  return cy.request(request);
}

function login(email, password) {
  return apiRequest('POST', apiconfig.endpoints.login, undefined, { email, password }, 120000)
    .then((response) => ({
      response,
      access_token: response.body.access_token,
    }));
}

function getproducts(accessToken) {
  return apiRequest('GET', apiconfig.endpoints.products, accessToken);
}

function getproductswithouttoken() {
  return getproducts();
}

function createProduct(payload, accessToken) {
  return apiRequest('POST', apiconfig.endpoints.products, accessToken, payload);
}

function updateProduct(payload, accessToken, id) {
  return apiRequest('PATCH', `${apiconfig.endpoints.products}/${id}`, accessToken, payload);
}

function updateProductwithoutToken(payload, id) {
  return updateProduct(payload, undefined, id);
}

function deleteProduct(accessToken, id) {
  return apiRequest('DELETE', `${apiconfig.endpoints.products}/${id}`, accessToken);
}

module.exports = {
  apiRequest,
  login,
  getproducts,
  getproductswithouttoken,
  createProduct,
  updateProduct,
  updateProductwithoutToken,
  deleteProduct,
};
