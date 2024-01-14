"use client";
import React from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
function Page() {
  const { user } = useAuthContext();
  const router = useRouter();

  React.useEffect(() => {
    if (user == null) router.push("/signin");
  }, [user]);

  return <h1>STRAINS my DAWG</h1>;
}

export default Page;
