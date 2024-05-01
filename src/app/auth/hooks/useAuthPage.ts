import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { HttpStatusCode } from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import {
  createUser,
  getUser,
  GetUserOutput,
  GetUserOutputError,
} from "@/services/users";
import { useStoreAuth } from "@/store";

type Props = {
  providers: any;
};

export const useAuthPage = ({ providers }: Props) => {
  const router = useRouter();
  const { setUser } = useStoreAuth();
  const session = useSession();
  const [loading, setLoading] = useState({
    page: false,
    button: false,
  });

  const handleOnClickSignIn = useCallback(() => {
    setLoading((prev) => ({ ...prev, button: true }));
    signIn(providers?.google.id);
  }, [providers?.google.id]);

  const { mutateAsync } = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      if (data) {
        setUser(data?.id);
        router.push("/boards");
      }
    },
  });

  const { isPending, data, error } = useQuery<
    GetUserOutput,
    GetUserOutputError
  >({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
  });

  const handleCheckUserExists = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, page: isPending }));

      if (isPending) {
        return;
      }

      if (error?.response?.status === HttpStatusCode.NotFound) {
        await mutateAsync();
        return;
      }

      if (data?.id) {
        setUser(data?.id ?? "");
        router.push("/boards");
      }
    } catch (error) {
    } finally {
      setLoading((prev) => ({ ...prev, page: false, button: false }));
    }
  }, [data?.id, error, isPending, mutateAsync, router, setUser]);

  useEffect(() => {
    if (session.status !== "authenticated") {
      return;
    }

    handleCheckUserExists();
  }, [error, handleCheckUserExists, session.status]);

  useEffect(() => {
    return () => setLoading({ button: false, page: false });
  }, []);

  return {
    loading,
    handleOnClickSignIn,
  };
};
