import { auth } from "@/auth";
import { getFriendsByUserId } from "@/helpers/get-friends";
import { fetchRedis } from "@/helpers/redis";
import { chatHrefConstructor } from "@/lib/utils";
import { Message } from "@/types/db.t";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
    const session = await auth();
    if (!session) redirect("/login");

    const friends = await getFriendsByUserId(session.user.id);

    const friendsWithLastMessage = await Promise.all(
        friends.map(async (friend) => {
            const [lastMessageRaw] = (await fetchRedis(
                "zrange",
                `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
                -1,
                -1
            )) as string[];

            const lastMessage = lastMessageRaw
                ? (JSON.parse(lastMessageRaw) as Message)
                : null;

            return {
                ...friend,
                lastMessage,
            };
        })
    );

    return (
        <div className="container py-12">
            <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
            {friendsWithLastMessage.length === 0 ? (
                <p className="text-sm text-zinc-500">Nothing to show here...</p>
            ) : (
                friendsWithLastMessage.map((friend) => (
                    <div
                        key={friend.id}
                        className="relative bg-base-100 border border-base-300 p-3 rounded-md"
                    >
                        <div className="absolute right-4 inset-y-0 flex items-center">
                            <ChevronRight className="h-7 w-7 text-zinc-400" />
                        </div>

                        <Link
                            href={`/dashboard/chat/${chatHrefConstructor(
                                session.user.id,
                                friend.id
                            )}`}
                            className="relative sm:flex"
                        >
                            <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                                <div className="relative h-6 w-6">
                                    <Image
                                        referrerPolicy="no-referrer"
                                        className="rounded-full"
                                        alt={`${friend.name} profile picture`}
                                        src={friend.image}
                                        fill
                                    />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold">{friend.name}</h4>
                                <p className="mt-1 max-w-md">
                                    {friend.lastMessage ? (
                                        <>
                                            <span className="text-zinc-400">
                                                {friend.lastMessage.senderId === session.user.id
                                                    ? "You: "
                                                    : ""}
                                            </span>
                                            {friend.lastMessage.text}
                                        </>
                                    ) : (
                                        <span className="text-zinc-400 italic">No messages yet</span>
                                    )}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default page;
