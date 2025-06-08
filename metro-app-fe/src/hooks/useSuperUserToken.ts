import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type SuperUserResponse = {
  record: {
    collectionId: string;
    collectionName: string;
    created: string;
    email: string;
    emailVisibility: boolean;
    id: string;
    updated: string;
    verified: boolean;
  };
  token: string;
};

const fetchSuperUserToken = async (): Promise<string> => {
  const res = await axios.post<SuperUserResponse>(
    `${
      import.meta.env.VITE_POCKET_BASE_PROD_URL
    }/api/collections/_superusers/auth-with-password`,
    {
      identity: import.meta.env.VITE_POCKET_BASE_SUPERUSER_EMAIL,
      password: import.meta.env.VITE_POCKET_BASE_SUPERUSER_PASSWORD,
    }
  );
  return res.data.token;
};

const useSuperUserToken = () =>
  useQuery<string, Error>({
    queryKey: ["superUserToken"],
    queryFn: fetchSuperUserToken,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
    retry: 1,
  });

export default useSuperUserToken;
