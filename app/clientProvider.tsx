"use client";
import { store } from "@/store/store";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function WrapWrap() {
  const { setUser } = store();
  const { data } = useSession();
  useEffect(() => {
    if (data) {
      fetch(`http://localhost:3000/api/users/detail/${data?.user?.id}`)
        .then((res) => res.json())
        .then((res) => {
          setUser(res.data);
        });
    }
  }, [data]);

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
