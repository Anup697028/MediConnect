import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
}

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = React.useState<string | null>(null);
  const [messageInput, setMessageInput] = React.useState("");

  // Mock data - replace with actual API calls
  const chats = [
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      lastMessage: "Your prescription is ready",
      avatar: "",
      unread: 2,
    },
    {
      id: "2",
      name: "Dr. Priya Sharma",
      lastMessage: "How are you feeling today?",
      avatar: "",
      unread: 0,
    },
    {
      id: "3",
      name: "Dr. Amit Patel",
      lastMessage: "Your reports are available",
      avatar: "",
      unread: 1,
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      sender: { id: "doctor1", name: "Dr. Rajesh Kumar", avatar: "" },
      content: "Namaste! How can I help you?",
      timestamp: new Date("2024-03-06T10:00:00"),
    },
    {
      id: "2",
      sender: { id: "user", name: "You" },
      content: "I wanted to ask about my recent prescription",
      timestamp: new Date("2024-03-06T10:01:00"),
    },
  ];

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // Add message sending logic here
    setMessageInput("");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-10rem)]">
        {/* Chat List */}
        <Card className="col-span-4 h-full">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-15rem)]">
              <div className="space-y-4">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                      selectedChat === chat.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <Avatar>
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-semibold">{chat.name}</h4>
                        {chat.unread > 0 && (
                          <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="col-span-8 h-full">
          <CardHeader>
            <CardTitle>
              {selectedChat ? chats.find(c => c.id === selectedChat)?.name : "Select a chat"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100vh-18rem)]">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender.id === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender.id === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent"
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
