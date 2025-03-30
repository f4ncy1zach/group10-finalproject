// Floating chat component for AI assistant - Trippy
import { motion } from "framer-motion"
import { MessageSquare, Send } from "lucide-react"
import Logo from "./Logo"

export default function FloatingChat({
                                         floatingChatOpen,
                                         setFloatingChatOpen,
                                         floatingChatMessage,
                                         setFloatingChatMessage,
                                         floatingChatHistory,
                                         sendFloatingChatMessage,
                                         floatingChatRef,
                                     }) {
    return (
        <>
            <motion.div
                className="floatingOrb"
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(56, 189, 248, 0.5)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFloatingChatOpen(!floatingChatOpen)}
                animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                        "0 5px 15px rgba(56, 189, 248, 0.3)",
                        "0 10px 20px rgba(56, 189, 248, 0.5)",
                        "0 5px 15px rgba(56, 189, 248, 0.3)",
                    ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
                <MessageSquare className="orbIcon" />
            </motion.div>

            {/* Floating Chat Window */}
            {floatingChatOpen && (
                <div className="floatingChatWindow">
                    <div className="floatingChatHeader">
                        <div className="floatingChatTitle">
                            <Logo size={35} />
                            <span>Travel Assistant</span>
                        </div>
                        <button className="floatingChatClose" onClick={() => setFloatingChatOpen(false)}>
                            &times;
                        </button>
                    </div>
                    <div className="floatingChatBody">
                        <div className="floatingChatMessages" ref={floatingChatRef}>
                            {floatingChatHistory.map((chat, index) => (
                                <div key={index} className={chat.isUser ? "floatingChatUserMessage" : "floatingChatAiMessage"}>
                                    {chat.message}
                                </div>
                            ))}
                        </div>
                        <div className="floatingChatInput">
              <textarea
                  className="floatingChatTextarea"
                  placeholder="Ask about your trip..."
                  value={floatingChatMessage}
                  onChange={(e) => setFloatingChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendFloatingChatMessage()
                      }
                  }}
              />
                            <button className="floatingChatSend" onClick={sendFloatingChatMessage}>
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}