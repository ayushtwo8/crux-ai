import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <nav className="w-full h-16 border-b bg-blue-50 border-neutral-200 flex justify-between px-16 items-center ">
      <h2 className="font-bold text-3xl text-indigo-800">Crux.ai</h2>
      <div>
        <SignedOut>
          <SignInButton mode="modal"><Button>Sign In</Button></SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
