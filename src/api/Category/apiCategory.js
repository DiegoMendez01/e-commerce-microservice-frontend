import { apiFetch } from "../apiClient";

export function fetchCategories() {
  return apiFetch("/categories");
}

export function fetchCategoryById(id) {
  return apiFetch(`/categories/${id}`);
}

export function searchCategories(name) {
  return apiFetch(`/categories/search?name=${encodeURIComponent(name)}`);
}

export function createCategory(categoryData) {
  return apiFetch("/categories", {
    method: "POST",
    body: categoryData,
  });
}

export function updateCategory(id, categoryData) {
  return apiFetch(`/categories/${id}`, {
    method: "PUT",
    body: categoryData,
  });
}