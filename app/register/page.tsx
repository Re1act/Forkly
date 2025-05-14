import RegisterForm from "@/components/RegisterForm";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <RegisterForm />
    </div>
  );
}