"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import React from "react";
import { SignupButton } from "../buttons/signup-button";
import { LoginButton } from "../buttons/login-button";
import { LogoutButton } from "../buttons/logout-button";

const NavBar = () => {
  const { user } = useUser();
  return (
    <div>
      {!user && (
        <>
          <SignupButton />
          <LoginButton />
        </>
      )}
      {user && (
        <>
          <LogoutButton></LogoutButton>
        </>
      )}
    </div>
  );
};

export default NavBar;
