import { apiFetch } from '../apiClient';

export function fetchProducts() {
  return apiFetch('/products');
}

export function fetchProductById(id) {
  return apiFetch(`/products/${id}`);
}

export function searchProducts(name) {
  return apiFetch(`/products/search?name=${encodeURIComponent(name)}`);
}

export function createProduct(productData) {
  return apiFetch("/products", {
    method: "POST",
    body: productData,
  });
}

export function updateProduct(id, productData) {
  return apiFetch(`/products/${id}`, {
    method: "PUT",
    body: productData,
  });
}

export function deleteProduct(id) {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
}