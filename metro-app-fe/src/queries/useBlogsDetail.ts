import axios from "axios";
import type { Blog } from "../types/blog.type";
import { useQuery } from "@tanstack/react-query";

const fetchBlogDetail = async (id: string): Promise<Blog> => {
  try {
    const res = await axios.get<Blog>(
      `https://pkb.lch.id.vn/api/collections/blogs/records/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc0OTQ4MTAzOSwiaWQiOiI4NjdmdDI3N3k5Z2NqaTgiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.90_Vx3o1NqyHpigMsxa2Eus_3vRNEqYCGB8fhR7rhiI`,
        },
      }
    );
    if (res.status === 200) {
      return res.data;
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
    enabled: !!id, // Only run the query if id is provided
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // exponential backoff
  });
};

export default useBlogDetail;
