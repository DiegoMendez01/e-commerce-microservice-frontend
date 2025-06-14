import { apiFetch } from '../apiClient';

export function fetchCategories() {
  return apiFetch('/categories');
}

export function searchCategories(name) {
  return apiFetch(`/categories/search?name=${encodeURIComponent(name)}`);
}