"use client";

import Image from "next/image";
import React from "react";
import useCurrentUser from "../hooks/useCurrentUser";

export default function Avatar() {
  const user = useCurrentUser();
  return (
    <Image
      className="rounded-full"
      height={30}
      src={
        user.isUser && user.user?.image
          ? user.user.image
          : "/images/placeholder.png"
      }
      width={30}
      alt="Avatar"
    />
  );
}
