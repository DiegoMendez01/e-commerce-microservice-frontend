export function fetchCustomers(request) {
  return request("/customers");
}

export function fetchCustomerById(id, request) {
  return request(`/customers/${id}`);
}

export function searchCustomers(name, request) {
  return request(`/customers/search?name=${encodeURIComponent(name)}`);
}

export function createCustomer(customerData, request) {
  return request("/customers", {
    method: "POST",
    body: customerData,
  });
}

export function updateCustomer(customerData, request) {
  return request(`/customers`, {
    method: "PUT",
    body: customerData,
  });
}

export function deleteCustomer(id, request) {
  return request(`/customers/${id}`, {
    method: "DELETE",
  });
}