import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../lib/useAuth";
import { useRouter } from "next/router";
import EmojiPicker from 'emoji-picker-react';

export default function SpecialChatPage() {
  const { user } = useAuth();
  const userEmail = user?.email;
  const router = useRouter();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [stickerUrl, setStickerUrl] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(true);

  // Check if the user is coming from the Clock page based on query params
  const { fromClock } = router.query;

  const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS
    ? process.env.NEXT_PUBLIC_ALLOWED_EMAILS.split(",")
    : [];

  useEffect(() => {
    if (!user) return;

    // Check authorized user email
    if (!allowedEmails.includes(user.email)) {
      router.push("/home");  // Redirect unauthorized users to home
    }

    // Check if the user is coming from the Clock page
    if (fromClock !== 'true') {
      console.log('Redirecting to home as referrer is not from Clock');
      router.push('/home');
      return;
    }
    
    setIsRedirecting(false);
    
    const q = query(
      collection(db, "specialChat"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user, router]);

  const sendMessage = async () => {
    if (newMessage.trim() === "" && !stickerUrl) return;
    try {
      await addDoc(collection(db, "specialChat"), {
        text: newMessage,
        sender: user.email,
        timestamp: new Date(),
        stickerUrl: stickerUrl || null,
      });
      setNewMessage("");
      setStickerUrl("");  // Reset sticker after sending
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage(prevMessage => prevMessage + emojiData.emoji);  // Add selected emoji to message
  };

  const toggleEmojiPicker = () => setShowEmojiPicker(prevState => !prevState);

  if (isRedirecting) return <div>Loading...</div>;

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen p-4 blackbg yellowtxt">
      <h1 className="text-2xl font-bold mb-4">Special P2P Chat</h1>
      <div className="flex-1 overflow-y-auto mb-4 border p-2 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${msg.sender === userEmail ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                msg.sender === userEmail
                  ? "bg-yellow-400 text-black rounded-br-none"
                  : "bg-gray-700 text-white rounded-bl-none"
              }`}
            >
              {msg.text}
              {msg.stickerUrl && <img src={msg.stickerUrl} alt="Sticker" className="mt-2 w-8 h-8" />}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mb-2">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-l blackbg yellowtxt border"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="yellowbg blacktxt px-4 rounded-r hover:scale-105"
        >
          Send
        </button>
        <button
          onClick={toggleEmojiPicker}
          className="ml-2 p-2 border rounded-full bg-yellow-400"
        >
          😀
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}
