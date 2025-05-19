"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecipeHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "system", content: "How can I assist you?" }]);
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/recipe-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, query: input }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessages([...newMessages, { role: "assistant", content: `Error: ${errorData.error}` }]);
        return;
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.response || "No response received." }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Error: Unable to fetch response." }]);
    }
  };

  const handleSearchTitle = (title: string) => {
    router.push(`/search/result?q=${encodeURIComponent(title)}`);
  };

  return (
    <div>
      {!isOpen ? (
        <div
          className="fixed bottom-4 right-4 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 cursor-pointer z-50"
          onClick={() => setIsOpen(true)}
        >
          Chat
        </div>
      ) : (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col z-50">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex items-center">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}