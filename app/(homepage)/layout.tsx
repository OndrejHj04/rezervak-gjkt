import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import WelcomeComponent from "@/sub-components/WelcomeComponent";
import React from "react";
import VerifyUser from "@/sub-components/VerifyUser";

export default async function Layout({ children }: { children: any }) {
  const user = await getServerSession(authOptions) as any

  if (!user) {
    return <WelcomeComponent />;
  }


  if (!user.user.verified) {
    return (
      <React.Fragment>
        <div className="md:absolute static z-50">
          <VerifyUser id={user.id} />
        </div>
        <div className="w-full h-full blur-sm pointer-events-none">
          {children}
        </div>
      </React.Fragment>
    );
  }

  return children
}
