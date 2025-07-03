import { useQuery } from "@tanstack/react-query";
import api from "../apis/api";
import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";
import type { Blog } from "../types/blog.type";

const fetchBlogDetail = async (id: string): Promise<Blog> => {
  try {
    const res = await api.get<ApiResponse<Blog>>(`${API_PATH.BLOG}/${id}`);
    if (res.status === 200) {
      return res.data.data;
    } else {
      throw new Error(`Error fetching blog: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching blog detail:", error);
    throw error instanceof Error
      ? error
      : new Error("Unknown error fetching blog detail");
  }
};

const useBlogDetail = (id: string | undefined) => {
  return useQuery<Blog, Error>({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogDetail(id!),
    enabled: !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });
};

export default useBlogDetail;
