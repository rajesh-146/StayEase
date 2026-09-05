import { useState } from "react";
import API from "../api/api";

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! 👋 I'm your StayEase AI Assistant. Ask me about your rent, room, or hostel-related information.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", {
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: res.data.reply,
        },
      ]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I couldn't process your request right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-3xl shadow-2xl transition hover:scale-110 hover:bg-blue-700"
          title="Open StayEase AI"
        >
          🤖
        </button>
      )}

      {/* AI Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-slate-900/95 shadow-2xl backdrop-blur-xl">

          {/* Header */}
          <div className="flex items-center justify-between bg-blue-600 px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                🤖 StayEase AI
              </h2>
              <p className="text-xs text-blue-100">
                Your hostel assistant
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full px-3 py-1 text-xl text-white transition hover:bg-blue-700"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md bg-slate-700 text-slate-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-slate-700 px-4 py-3 text-sm text-slate-300">
                  🤖 Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-white/10 bg-slate-950/80 p-3">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your rent..."
                rows="1"
                className="flex-1 resize-none rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <button
                onClick={sendMessage}
                disabled={loading || !message.trim()}
                className="rounded-2xl bg-blue-600 px-4 text-lg text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ➤
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-slate-500">
              Powered by StayEase AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}