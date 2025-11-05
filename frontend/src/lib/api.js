// simple helper for auth token handling and fetch
const API = (path, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch((import.meta.env.VITE_API_URL ) + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  }).then(async res => {
    const json = await res.json().catch(()=>({}));
    if (!res.ok) throw json;
    return json;
  });
};

export const register = (data) => API('/api/auth/register','POST',data);
export const login = (data) => API('/api/auth/login','POST',data);
export const getNotes = (token, q='') => API(`/api/notes?q=${encodeURIComponent(q)}`, 'GET', null, token);
export const createNote = (token, data) => API('/api/notes','POST',data,token);
export const updateNote = (token, id, data) => API(`/api/notes/${id}`,'PUT',data,token);
export const deleteNote = (token, id) => API(`/api/notes/${id}`,'DELETE',null,token);

// AI
export const aiSummary = (token, content) => API('/api/ai/summary','POST',{ content }, token);
export const aiImprove = (token, content) => API('/api/ai/improve','POST',{ content }, token);
export const aiTags = (token, content) => API('/api/ai/tags','POST',{ content }, token);
