export function fetchOrderLineById(id, request) {
  return request(`/order-lines/order/${id}`);
}