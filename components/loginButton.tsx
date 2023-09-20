import { Button } from "@mui/material";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Link href="/login">
      <Button variant="contained">Přihlásit se</Button>
    </Link>
  );
}
