import apiClient from "@/utils/fetcher";

export const getBlogs = async (params) => {
  if (params) {
    return await apiClient.get(`/api/blog/?${params}`);
  } else {
    return await apiClient.get("/api/blog/");
  }
};

export const getBlogDetail = async (blogId) => {
  const response = await apiClient.get(`/api/blog/${blogId}/`);
  return response;
};

export const deleteBlog = async (blogId) => {
  const response = await apiClient.delete(`/api/blog/${blogId}/`);
  return response;
};

export const updateBlog = async (blog) => {
  const response = await apiClient.put(`/api/blog/${blog.id}/`, blog);
  return response;
};

export const createBlog = async (blog) => {
  const response = await apiClient.post("/api/blog/", blog);
  return response;
};
