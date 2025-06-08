import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useSuperUserToken from "../hooks/useSuperUserToken";
import type { Blog } from "../types/blog.type";

const fetchBlogDetail = async (id: string, token: string): Promise<Blog> => {
  const res = await axios.get<Blog>(
    `${
      import.meta.env.VITE_POCKET_BASE_PROD_URL
    }/api/collections/blogs/records/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

const useBlogDetail = (id: string | undefined) => {
  const { data: token } = useSuperUserToken();

  return useQuery<Blog, Error>({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogDetail(id!, token!),
    enabled: !!id && !!token, // wait for both ID and token to be ready
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });
};

export default useBlogDetail;
