export function fetchCategories(request) {
  return request("/categories");
}

export function fetchCategoryById(id, request) {
  return request(`/categories/${id}`);
}

export function searchCategories(name, request) {
  return request(`/categories/search?name=${encodeURIComponent(name)}`);
}

export function createCategory(categoryData, request) {
  return request("/categories", {
    method: "POST",
    body: categoryData,
  });
}

export function updateCategory(id, categoryData, request) {
  return request(`/categories/${id}`, {
    method: "PUT",
    body: categoryData,
  });
}

export function deleteCategory(id, request) {
  return request(`/categories/${id}`, {
    method: "DELETE",
  });
}