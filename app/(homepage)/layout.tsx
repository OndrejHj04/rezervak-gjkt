import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import React from "react";
import WelcomeComponent from "./welcome/WelcomeComponent";
import VerifyUser from "./VerifyUser";

export default async function Layout({ children }: { children: any }) {
  const user = await getServerSession(authOptions) as any

  if (!user) {
    return <WelcomeComponent />;
  }

  console.log(user.user)
  if (!user.user.verified) {
    return (
      <React.Fragment>
        <div className="md:absolute static z-50">
          <VerifyUser id={user.user.id} />
        </div>
        <div className="w-full h-full blur-sm pointer-events-none">
          {children}
        </div>
      </React.Fragment>
    );
  }

  return children
}
