import { useState } from "react";
import type { AiChatProps } from "../types/ai";

type ChatMessage = {
    role: "user" | "ai";
    content: string;
};

const AiChat = ({ setOnChat }: AiChatProps) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim() || loading) return;

        const currentMessage = message;

        // Add user's message immediately
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: currentMessage,
            },
        ]);

        setMessage("");
        setLoading(true);

        // Add empty AI message
        setMessages((prev) => [
            ...prev,
            {
                role: "ai",
                content: "",
            },
        ]);

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: currentMessage,
                }),
            });

            if (!res.ok) {
                throw new Error("AI request failed");
            }

            if (!res.body) {
                throw new Error("Streaming is not supported");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let result = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, {
                    stream: true,
                });

                result += chunk;

                // Update only the latest AI message
                setMessages((prev) => {
                    const updatedMessages = [...prev];

                    updatedMessages[updatedMessages.length - 1] = {
                        role: "ai",
                        content: result,
                    };

                    return updatedMessages;
                });
            }

        } catch (error) {
            console.error("AI Error:", error);

            setMessages((prev) => {
                const updatedMessages = [...prev];

                updatedMessages[updatedMessages.length - 1] = {
                    role: "ai",
                    content: "Something went wrong. Please try again.",
                };

                return updatedMessages;
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute w-full md:w-1/2 bg-white/30 right-0 backdrop-blur-md h-screen md:h-full">

            {/* Back Button */}
            <button
                className="absolute w-23 h-11 shadow-2xl font-semibold border border-yellow-950 rounded-full mt-20 top-0 right-3 bg-white"
                onClick={() => setOnChat(false)}
            >
                back
            </button>

            {/* Input */}
            <div className="flex z-50 absolute top-20 left-4">

                <input
                    className="w-90 md:w-150 h-12 shadow-5xl bg-[#fbf8f2] rounded-full border border-yellow-950 text-lg pl-5"
                    type="text"
                    placeholder={
                        loading
                            ? "AI is thinking..."
                            : "Ask about product"
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    disabled={loading}
                />

                <img
                    onClick={sendMessage}
                    className={`w-9 right-4 mt-2.5 rotate-270 absolute ${loading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                        }`}
                    src="./enter.png"
                    alt="enter"
                />

            </div>

            {/* Chat Messages */}
            <div className="mt-40 px-5 pb-10 h-[calc(100vh-160px)] overflow-y-auto">

                <div className="flex flex-col gap-4">

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                                }`}
                        >

                            <div
                                className={`max-w-[85%] rounded-xl p-4 text-black font-semibold wrap-break-words whitespace-pre-wrap shadow ${msg.role === "user"
                                    ? "bg-[#fbf8f2]"
                                    : "bg-[#fbf8f2]"
                                    }`}
                            >
                                {msg.content}

                                {/* Show cursor while AI is streaming */}
                                {msg.role === "ai" &&
                                    loading &&
                                    index === messages.length - 1 && (
                                        <span className=" animate-pulse ">
                                            ...
                                        </span>
                                    )}
                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
};

export default AiChat;