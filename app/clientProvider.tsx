"use client";
import { store } from "@/store/store";

import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

function WrapWrap() {
  const { setUser, setUserLoading } = store();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "loading") setUserLoading(true);
    if (status === "authenticated") {
      setUserLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/detail/${data?.user?.id}`)
        .then((res) => res.json())
        .then((res) => {
          const {
            role: { role_id },
            verified,
            active,
          } = data.user;

          if (
            role_id !== res.data.role.role_id ||
            verified !== res.data.verified ||
            active !== res.data.active
          ) {
            signIn("credentials", {
              email: res.data.email,
              password: res.data.password,
            });
          } else {
            setUserLoading(false);
            setUser(res.data);
          }
        });
    }
    if (status === "unauthenticated") setUserLoading(false);
  }, [status]);

  return <></>;
}

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const { setRoles, user } = store();
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roles/list`)
      .then((res) => res.json())
      .then(({ data }) => setRoles(data));
  }, []);

  return (
    <SessionProvider>
      <WrapWrap />
      {children}
    </SessionProvider>
  );
}
