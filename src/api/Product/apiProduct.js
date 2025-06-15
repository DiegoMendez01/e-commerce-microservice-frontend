export function fetchProducts(request) {
  return request("/products");
}

export function fetchProductById(id, request) {
  return request(`/products/${id}`);
}

export function searchProducts(name, request) {
  return request(`/products/search?name=${encodeURIComponent(name)}`);
}

export function createProduct(productData, request) {
  return request("/products", {
    method: "POST",
    body: productData,
  });
}

export function updateProduct(id, productData, request) {
  return request(`/products/${id}`, {
    method: "PUT",
    body: productData,
  });
}

export function deleteProduct(id, request) {
  return request(`/products/${id}`, {
    method: "DELETE",
  });
}