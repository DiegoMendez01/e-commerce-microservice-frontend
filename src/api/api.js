const BASE_URL = 'http://localhost:8222/api/v1';

export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/products`);
  if (!response.ok) throw new Error('Error al obtener productos');
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) throw new Error('Error al obtener categorías');
  return response.json();
}