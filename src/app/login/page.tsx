"use client"
import { redirect } from "next/navigation";
import LoginForm from "./form";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const {data: session} = useSession();

  if (session) {
    redirect("/");
  }

  return (
    <section className="bg-black h-screen flex items-center justify-center">
      <div className="w-[600px]">
        <LoginForm />;
      </div>
    </section>
  );
}