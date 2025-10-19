import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Page() {
    const { isAuthenticated } = await auth();
    
    if(!isAuthenticated){
        return <div>Sign in to view this page</div>
    }

    const user = await currentUser();
    return <div>
        Welcome, {user?.firstName}!
    </div>
}