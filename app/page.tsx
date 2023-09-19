import { Button, Typography } from "@mui/material";
import { AdminCredentialsType, User } from "../models/User";
import AdminCredentials from "@/components/adminCredentials";
import { toast } from "react-toastify";
import LoginPage from "@/components/loginPage";
import AuthComponent from "@/components/authComponent";

export default async function Home() {
  return (
    <>
      <Typography>Homepage</Typography>
      <AuthComponent />
    </>
  );
}
