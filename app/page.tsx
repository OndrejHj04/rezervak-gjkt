"use client";
import { Button, Typography } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File>();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.set("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <input type="submit" value="Upload" />
      </form>
    </>
  );
}
