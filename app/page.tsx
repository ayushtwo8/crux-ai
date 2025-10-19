import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  
  const { isAuthenticated } = await auth();
  if(isAuthenticated){
    redirect("/dashboard");
  }
  return (
    <div>
      Crux AI
    </div>
  );
}
