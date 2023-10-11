import { Button } from "@mui/material";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function MakeIncrement() {
  const handleIcrement = async () => {
    "use server";

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/numbers/increment`, {
      method: "POST",
    });
    revalidatePath("/numbers");
    redirect("/numbers");
  };
  return (
    <form action={handleIcrement}>
      <Button variant="contained" color="primary" type="submit">
        Pridat
      </Button>
    </form>
  );
}
