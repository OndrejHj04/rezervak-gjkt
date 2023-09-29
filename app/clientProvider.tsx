"use client";
import { store } from "@/store/store";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { stat } from "fs";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function WrapWrap() {
  const { setUser, setUserLoading } = store();
  const { data, status } = useSession();
  useEffect(() => {
    if (status === "loading") setUserLoading(true);
    if (status === "authenticated") {
      setUserLoading(true);
      fetch(`http://localhost:3000/api/users/detail/${data?.user?.id}`)
        .then((res) => res.json())
        .then((res) => {
          setUserLoading(false);
          setUser(res.data);
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
  const { setRoles } = store();
  useEffect(() => {
    fetch("http://localhost:3000/api/roles/list")
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
