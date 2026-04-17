"use client";
import { AppShell, PageHeader, StatCard } from "@/components/layout/AppShell";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Send, ChevronDown } from "lucide-react";

type ChannelType = "ebay" | "facebook" | "direct";

interface Message {
  id: string;
  sender: "buyer" | "agent";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  buyerName: string;
  channel: ChannelType;
  lastMessage: string;
  lastTime: string;
  slaMinutes: number;
  unread: boolean;
  itemTitle: string;
  messages: Message[];
}

const channelBadgeStyles: Record<ChannelType, { bg: string; text: string; label: string }> = {
  ebay: { bg: "bg-sapphire/15", text: "text-sapphire", label: "eBay" },
  facebook: { bg: "bg-amethyst/15", text: "text-amethyst", label: "Facebook" },
  direct: { bg: "bg-emerald/15", text: "text-emerald", label: "Direct" },
};

const templates = [
  "Thank you for your interest! This item is still available.",
  "I can offer a 10% discount if you purchase within 24 hours.",
  "Shipping is available nationwide. Estimated 5-7 business days.",
  "This item has been professionally authenticated.",
  "I'll check on that and get back to you shortly.",
];

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    buyerName: "Robert Chen",
    channel: "ebay",
    lastMessage: "Is the lamp shade original or a reproduction?",
    lastTime: "2 min ago",
    slaMinutes: -30,
    unread: true,
    itemTitle: "Tiffany Studios Dragonfly Lamp",
    messages: [
      { id: "m1", sender: "buyer", text: "Hello, I'm very interested in the Tiffany lamp. Can you tell me more about its provenance?", time: "10:15 AM" },
      { id: "m2", sender: "agent", text: "Thank you for your interest! This lamp was part of a private collection in Beverly Hills, owned by the same family since the 1960s. We have full provenance documentation available.", time: "10:22 AM" },
      { id: "m3", sender: "buyer", text: "That's wonderful. What condition is the glass shade in? Any cracks or repairs?", time: "10:30 AM" },
      { id: "m4", sender: "agent", text: "The shade is in excellent condition with no cracks, chips, or repairs. All glass panels are original. We can provide detailed condition photos if you'd like.", time: "10:45 AM" },
      { id: "m5", sender: "buyer", text: "Is the lamp shade original or a reproduction?", time: "11:02 AM" },
    ],
  },
  {
    id: "conv-2",
    buyerName: "Amelia Whitfield",
    channel: "facebook",
    lastMessage: "Can you ship to Portland, OR?",
    lastTime: "15 min ago",
    slaMinutes: 45,
    unread: true,
    itemTitle: "Persian Kashan Silk Rug 12x16",
    messages: [
      { id: "m1", sender: "buyer", text: "Hi! I love the Persian rug. Is the price negotiable?", time: "9:30 AM" },
      { id: "m2", sender: "agent", text: "Hello Amelia! Yes, we're open to reasonable offers on this piece. It's a stunning Kashan silk rug in excellent condition.", time: "9:45 AM" },
      { id: "m3", sender: "buyer", text: "Can you ship to Portland, OR?", time: "10:00 AM" },
    ],
  },
  {
    id: "conv-3",
    buyerName: "Marcus Hayes",
    channel: "direct",
    lastMessage: "I'll take it at asking price. How do I proceed?",
    lastTime: "1 hr ago",
    slaMinutes: 90,
    unread: false,
    itemTitle: "Chippendale Mahogany Highboy",
    messages: [
      { id: "m1", sender: "buyer", text: "I've been looking for a genuine Chippendale highboy for months. This looks authentic.", time: "8:00 AM" },
      { id: "m2", sender: "agent", text: "It absolutely is! This piece dates to approximately 1770 and features original brass hardware. We've had it professionally appraised.", time: "8:15 AM" },
      { id: "m3", sender: "buyer", text: "I'll take it at asking price. How do I proceed?", time: "8:30 AM" },
    ],
  },
  {
    id: "conv-4",
    buyerName: "Diana Park",
    channel: "ebay",
    lastMessage: "What's the return policy on jewelry items?",
    lastTime: "3 hrs ago",
    slaMinutes: 150,
    unread: false,
    itemTitle: "Art Deco Diamond Brooch (3.2ct)",
    messages: [
      { id: "m1", sender: "buyer", text: "Is the diamond GIA certified?", time: "7:00 AM" },
      { id: "m2", sender: "agent", text: "Yes, it comes with a GIA certificate. The center stone is 3.2 carats, VS1 clarity, G color.", time: "7:30 AM" },
      { id: "m3", sender: "buyer", text: "What's the return policy on jewelry items?", time: "8:00 AM" },
    ],
  },
  {
    id: "conv-5",
    buyerName: "Thomas Rivera",
    channel: "facebook",
    lastMessage: "Do you offer white glove delivery in the LA area?",
    lastTime: "5 hrs ago",
    slaMinutes: -120,
    unread: true,
    itemTitle: "Victorian Mahogany Secretary Desk",
    messages: [
      { id: "m1", sender: "buyer", text: "This desk is gorgeous. Is it still available?", time: "6:00 AM" },
      { id: "m2", sender: "buyer", text: "Do you offer white glove delivery in the LA area?", time: "6:15 AM" },
    ],
  },
];

function getSlaColor(minutes: number): string {
  if (minutes < 0) return "text-ruby";
  if (minutes <= 120) return "text-gold-tone";
  return "text-emerald";
}

function getSlaLabel(minutes: number): string {
  if (minutes < 0) return `${Math.abs(minutes)}m overdue`;
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
  const [replyText, setReplyText] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <AppShell role="ops" userName="Alex Rivera" orgName="Operations">
<div className="flex flex-1">
<main className="flex-1 overflow-hidden">
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Left Panel — Conversations List */}
            <div className="w-80 border-r border-platinum/50 bg-white flex flex-col">
              <div className="border-b border-platinum/30 px-4 py-4">
                <h1 className="text-xl font-semibold text-charcoal font-[family-name:var(--font-display)]">
                  Inbox
                </h1>
                <p className="text-xs text-pewter mt-0.5">
                  {mockConversations.filter((c) => c.unread).length} unread conversations
                </p>
              </div>
              <ul className="flex-1 overflow-y-auto divide-y divide-platinum/30">
                {mockConversations.map((conv) => {
                  const badge = channelBadgeStyles[conv.channel];
                  const isActive = activeConversation.id === conv.id;

                  return (
                    <li key={conv.id}>
                      <button
                        onClick={() => setActiveConversation(conv)}
                        className={cn(
                          "w-full text-left px-4 py-3 transition-colors",
                          isActive ? "bg-sapphire/5" : "hover:bg-ivory/50",
                          conv.unread && !isActive && "bg-gold-tone/5"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn("text-sm font-semibold", conv.unread ? "text-charcoal" : "text-pewter")}>
                            {conv.buyerName}
                          </span>
                          <span className={cn("text-xs font-semibold", getSlaColor(conv.slaMinutes))}>
                            {getSlaLabel(conv.slaMinutes)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", badge.bg, badge.text)}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-silver truncate">{conv.itemTitle}</span>
                        </div>
                        <p className={cn("text-xs truncate", conv.unread ? "text-charcoal font-medium" : "text-pewter")}>
                          {conv.lastMessage}
                        </p>
                        <p className="text-[10px] text-silver mt-0.5">{conv.lastTime}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Panel — Message Thread */}
            <div className="flex-1 flex flex-col bg-ivory">
              {/* Thread Header */}
              <div className="border-b border-platinum/30 bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-charcoal font-[family-name:var(--font-display)]">
                      {activeConversation.buyerName}
                    </h2>
                    <p className="text-xs text-pewter">
                      Re: {activeConversation.itemTitle}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      channelBadgeStyles[activeConversation.channel].bg,
                      channelBadgeStyles[activeConversation.channel].text
                    )}
                  >
                    {channelBadgeStyles[activeConversation.channel].label}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sender === "agent" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-md rounded-lg px-4 py-3 shadow-sm",
                        msg.sender === "agent"
                          ? "bg-sapphire text-white"
                          : "bg-ivory border border-platinum/50 text-charcoal"
                      )}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={cn(
                          "text-[10px] mt-1",
                          msg.sender === "agent" ? "text-white/60" : "text-silver"
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Area */}
              <div className="border-t border-platinum/30 bg-white px-6 py-4">
                {/* Template Picker */}
                <div className="relative mb-3">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-pewter hover:text-sapphire transition-colors"
                  >
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showTemplates && "rotate-180")} />
                    Response Templates
                  </button>
                  {showTemplates && (
                    <div className="absolute bottom-full left-0 mb-2 w-96 rounded-lg border border-platinum/50 bg-white shadow-lg z-10">
                      <ul className="divide-y divide-platinum/30 py-1">
                        {templates.map((template, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() => {
                                setReplyText(template);
                                setShowTemplates(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-charcoal hover:bg-ivory transition-colors"
                            >
                              {template}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-end gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={2}
                    placeholder="Type your reply..."
                    className="flex-1 rounded-md border border-platinum/50 bg-white px-3 py-2 text-sm text-charcoal focus:border-sapphire focus:ring-1 focus:ring-sapphire resize-none"
                  />
                  <button
                    disabled={!replyText.trim()}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors shrink-0",
                      replyText.trim()
                        ? "bg-sapphire text-white hover:bg-sapphire-light"
                        : "bg-platinum/50 text-silver cursor-not-allowed"
                    )}
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
