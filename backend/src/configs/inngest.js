import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";
import { ENV } from "./env.js";

export const inngest = new Inngest({ id: "ecommerce-app", signinKey: ENV.INNGEST_SIGNING_KEY });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        await connectDB();

        const {
            id,
            first_name,
            last_name,
            image_url,
            email_addresses,
        } = event.data;

        const primaryEmail = email_addresses?.[0]?.email_address;

        const newUser = {
            clerkId: id,
            name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
            email: primaryEmail,
            imageUrl: image_url,
            addresses: [],
            wishList: [],
        };

        await User.findOneAndUpdate(
            { clerkId: id },
            newUser,
            { upsert: true, new: true }
        );
    }
);

const deleteUserFromDb = inngest.createFunction(
    { id: "delete-user-from-db" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        await connectDB();

        const { id } = event.data;

        await User.deleteOne({ clerkId: id }); 
    }
);

export const functions = [syncUser, deleteUserFromDb];