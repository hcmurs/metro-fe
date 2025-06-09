import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Blog } from "../types/blog.type";
import { API_PATH } from "../constants/path";
import type { ApiResponse } from "../types/api.type";

const fetchBlogDetail = async (id: string): Promise<Blog> => {
  const res = await axios.get<ApiResponse<Blog>>(`${API_PATH.BLOG}/${id}`);
  return res.data.data;
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
