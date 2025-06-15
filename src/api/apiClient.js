const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8222/api/v1';

export async function apiFetch(endpoint, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  const config = {
    method,
    headers: {
      ...headers
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
    config.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  const contentLength = response.headers.get("Content-Length");
  const contentType = response.headers.get("Content-Type");

  if (
    response.status === 204 ||
    !contentType?.includes("application/json") ||
    contentLength === "0"
  ) {
    return null;
  }

  return response.json();
}