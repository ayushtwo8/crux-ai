import prisma from "@/lib/prisma";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix"

export async function POST(req: NextRequest){
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if(!WEBHOOK_SECRET){
        throw new Error("Please add CLERK_WEBHOOK_SIGNING_SECRET from clerk dashboard to .env")
    }

    // get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp =  headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");
    
    if(!svix_id || !svix_signature || !svix_timestamp){
        return NextResponse.json("Error occured -- no svix headers", { status: 400})
    }

    
    // body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // new svix instance
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // verify payload with headers
    try {
        console.log("inside try block")
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        }) as WebhookEvent;

    } catch(err){
        console.error("Error verifying webhook: ", err);
        return NextResponse.json("Error occured", { status: 400})
    }

    const eventType = evt.type;
    console.log(`Webhook with an event type of ${eventType}`);

    // event handle
    switch(eventType){
        case 'user.created': {
            const { id, email_addresses} = evt.data;
            console.log("id: ", id);
            console.log("email: ", email_addresses);
            
            if(!id || !email_addresses || email_addresses.length === 0){
                console.log("Error: Missing user ID or email address")
                return NextResponse.json("Missing user ID or email address", { status: 400})
            }
            
            console.log("before upsert");
            await prisma.user.upsert({
                where: { clerkId: id},
                update: { email: email_addresses[0].email_address},
                create: {
                    clerkId: id,
                    email: email_addresses[0].email_address,
                }
            })

            break;
        }
        case 'user.deleted': {
            const { id } = evt.data;
            if (!id) {
                return NextResponse.json('Error: Missing user ID', { status: 400 });
            }

            await prisma.user.deleteMany({
                where: {
                    clerkId: id
                }
            })

            break;
        }
        default: 
            console.log(`Unhandled webhook event type ${eventType}`)
    }
    
    return NextResponse.json("",{ status: 200});
}