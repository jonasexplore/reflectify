import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import { createUser, getUser } from "@/services/users";
import { useStoreAuth } from "@/store";

type Props = {
  providers: any;
};

export const useAuthPage = ({ providers }: Props) => {
  const router = useRouter();
  const { setUser } = useStoreAuth();
  const { data: session } = useSession();
  const [loading, setLoading] = useState({
    page: false,
    button: false,
  });

  const handleOnClickSignIn = useCallback(() => {
    setLoading((prev) => ({ ...prev, button: true }));
    signIn(providers?.google.id);
  }, [providers?.google.id]);

  const handleCreateAccount = useCallback(async () => {
    try {
      const output = await createUser();

      if (output) {
        setUser(output.id);
        router.push("/boards");
      }
    } catch (error) {
      console.log(error);
    }
  }, [router, setUser]);

  const handleCheckUserExists = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, page: true }));

      const output = await getUser();

      if (!output) {
        await handleCreateAccount();
        return;
      }

      setUser(output.id);

      router.push("/boards");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading((prev) => ({ ...prev, page: false, button: false }));
    }
  }, [handleCreateAccount, router, setUser]);

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    handleCheckUserExists();
  }, [handleCheckUserExists, session?.user]);

  return {
    loading,
    handleOnClickSignIn,
  };
};
