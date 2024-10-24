"use client";
import { TextField } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function SearchBar(props: any) {
  const input = useRef(null) as any;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const search = searchParams.get("search") || "";

  const makeSearch = (value: any) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TextField
      ref={input}
      defaultValue={search}
      onChange={(e) => makeSearch(e.target.value)}
      {...props}
    />
  );
}
