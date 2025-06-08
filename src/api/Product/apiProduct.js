import { apiFetch } from '../apiClient';

export function fetchProducts() {
  return apiFetch('/products');
}

export function searchProducts(name) {
  return apiFetch(`/products/search?name=${encodeURIComponent(name)}`);
}