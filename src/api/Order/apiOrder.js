export function createOrder(orderData, request) {
  return request("/orders", {
    method: "POST",
    body: orderData,
  });
}

export function fetchOrders(request) {
  return request("/orders");
}

export function fetchOrderById(id, request) {
  return request(`/orders/${id}`);
}