'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Bot, User, Send, MessageSquare, CheckCircle, HelpCircle, Mail, ChevronRight } from 'lucide-react';
import { addContactMessage } from '@/lib/firestore';

// --- Support Bot Logic ---

type Message = {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    options?: { label: string; action: string }[];
};

const INITIAL_MESSAGE: Message = {
    id: 'intro',
    text: "Hi there! I'm the AVP Support Bot. How can I help you today?",
    sender: 'bot',
    options: [
        { label: "Login / Account Issues", action: "topic_account" },
        { label: "Game Download Issues", action: "topic_download" },
        { label: "Game Crashing / Bugs", action: "topic_bugs" },
        { label: "I want to upload a game", action: "topic_upload" },
        { label: "Other / Talk to Human", action: "contact_form" },
    ]
};

const BOT_RESPONSES: Record<string, Partial<Message>> = {
    topic_account: {
        text: "I can help with account issues. What specifically is happening?",
        options: [
            { label: "I forgot my password", action: "sol_password" },
            { label: "I can't receive verify email", action: "sol_verify" },
            { label: "Delete my account", action: "sol_delete" },
            { label: "Something else", action: "contact_form" }
        ]
    },
    topic_download: {
        text: "Download issues are annoying! Let's check a few things.",
        options: [
            { label: "Download is stuck at 0%", action: "sol_stuck" },
            { label: "Link is broken (404)", action: "sol_broken" },
            { label: "Slow download speed", action: "sol_slow" },
            { label: "None of these", action: "contact_form" }
        ]
    },
    topic_upload: {
        text: "You want to upload a game? That's awesome! We love new creators.",
        options: [
            { label: "How to become a publisher?", action: "sol_publisher" },
            { label: "My upload failed", action: "sol_upload_fail" },
            { label: "Other upload question", action: "contact_form" }
        ]
    },
    topic_bugs: {
        text: "Found a bug? Oh no! Tell me more.",
        options: [
            { label: "Game keeps crashing", action: "sol_crash" },
            { label: "Visual glitch / weird graphics", action: "sol_glitch" },
            { label: "Report a serious bug", action: "contact_form" }
        ]
    },
    sol_password: {
        text: "To reset your password, go to the Login page and click 'Forgot Password?'. We'll send you a reset link immediately. Did that help?",
        options: [
            { label: "Yes, thanks!", action: "end_good" },
            { label: "No, still stuck", action: "contact_form" }
        ]
    },
    sol_verify: {
        text: "If you didn't get the verification email, check your Spam/Junk folder. It can take up to 5 minutes. Still nothing?",
        options: [
            { label: "Found it!", action: "end_good" },
            { label: "Still nothing", action: "contact_form" }
        ]
    },
    sol_delete: {
        text: "We're sad to see you go. To delete your account, please go to your Profile settings -> Danger Zone. This cannot be undone.",
        options: [
            { label: "Okay, thanks", action: "end_good" },
            { label: "I can't access profile", action: "contact_form" }
        ]
    },
    sol_stuck: {
        text: "If downloads are stuck, try disabling your ad-blocker or VPN temporarily. Refresh the page and try again. Is it working now?",
        options: [
            { label: "Yes, working!", action: "end_good" },
            { label: "No", action: "contact_form" }
        ]
    },
    sol_broken: {
        text: "A 404 error means the file might have been moved. Please let us know specifically which game it is so we can fix it.",
        options: [
            { label: "Report Broken Link", action: "contact_form" }
        ]
    },
    sol_slow: {
        text: "Slow speeds are usually due to network traffic. Try pausing and resuming, or using a download manager.",
        options: [
            { label: "Okay, I'll try that", action: "end_good" }
        ]
    },
    sol_publisher: {
        text: "Go to your Profile -> Admin Dashboard -> 'Add New Game'. You can publish instantly!",
        options: [
            { label: "Got it!", action: "end_good" }
        ]
    },
    sol_upload_fail: {
        text: "Uploads might fail if the file is too big or your internet dropped. Ensure your game is under 2GB or host it externally (Drive/Itch.io).",
        options: [
            { label: "I'll try external link", action: "end_good" },
            { label: "Still failing", action: "contact_form" }
        ]
    },
    sol_crash: {
        text: "Crashes are often due to missing drivers. Update your Graphics Drivers and DirectX. Does that help?",
        options: [
            { label: "I'll try that", action: "end_good" },
            { label: "Didn't work", action: "contact_form" }
        ]
    },
    sol_glitch: {
        text: "Try changing the game resolution or quality settings in the launcher.",
        options: [
            { label: "Okay", action: "end_good" }
        ]
    },
    end_good: {
        text: "Great! Glad I could help. Happy gaming!",
        options: [] // End
    },
    contact_form: {
        text: "I see. It sounds like you need human assistance. Please fill out the form below, and our team will get back to you shortly.",
        options: [] // Triggers form display
    }
};

export default function ContactPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [showForm, setShowForm] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessageBody] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
            setEmail(user.email || '');
        }
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    const handleOptionClick = (action: string, label: string) => {
        processResponse(action, label);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const text = inputValue.trim().toLowerCase();
        let action = 'unknown';
        let label = inputValue;

        // Basic Keyword Matching
        if (text.includes('login') || text.includes('password') || text.includes('account')) action = 'topic_account';
        else if (text.includes('download') || text.includes('install') || text.includes('stuck')) action = 'topic_download';
        else if (text.includes('upload') || text.includes('publish') || text.includes('developer')) action = 'topic_upload';
        else if (text.includes('bug') || text.includes('crash') || text.includes('error')) action = 'topic_bugs';
        else if (text.includes('help') || text.includes('support') || text.includes('contact')) action = 'contact_form';

        processResponse(action, label);
        setInputValue('');
    };

    const processResponse = (action: string, label: string) => {
        // Add user selection
        const userMsg: Message = { id: Date.now().toString(), text: label, sender: 'user' };

        // Find bot response
        let botResp = BOT_RESPONSES[action];

        // Default fallback
        if (!botResp && action !== 'contact_form') {
            botResp = {
                text: "I didn't quite catch that. Could you choose one of the topics below, or just say 'help' to contact us?",
                options: INITIAL_MESSAGE.options
            };
        } else if (action === 'contact_form') {
            setShowForm(true);
        }

        const nextBotMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: botResp?.text || "Let's connect you to support.",
            sender: 'bot',
            options: botResp?.options
        };

        setMessages(prev => [...prev, userMsg, nextBotMsg]);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await addContactMessage({ name, email, subject, message });
            setFormSuccess(true);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: "Thanks! We've received your message. A support agent will email you properly.",
                sender: 'bot'
            }]);
            setShowForm(false); // Hide form after success
        } catch (error) {
            console.error(error);
            alert("Failed to send message. Please try again.");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Contact Support</h1>
                    <p className="text-muted-foreground">Chat with our bot for instant answers, or leave a message for the team.</p>
                </div>

                <div className={`flex flex-col lg:flex-row gap-8 items-start justify-center transition-all duration-500`}>

                    {/* Chat Bot Window */}
                    <div className={`w-full transition-all duration-500 bg-card border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl ${showForm ? 'lg:w-1/3 opacity-80 hover:opacity-100' : 'lg:max-w-2xl lg:mx-auto'
                        }`}>
                        {/* Bot Header */}
                        <div className="bg-white/5 p-4 border-b border-white/10 flex items-center gap-3 shrink-0">
                            <div className="bg-violet-500/20 p-2 rounded-full">
                                <Bot className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">AVP Assistant</h3>
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-4 ${msg.sender === 'user'
                                        ? 'bg-violet-600 text-white rounded-tr-sm'
                                        : 'bg-white/10 text-white rounded-tl-sm'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>

                                        {/* Options (only for latest bot message) */}
                                        {msg.options && msg === messages[messages.length - 1] && !showForm && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {msg.options.map((opt) => (
                                                    <button
                                                        key={opt.action}
                                                        onClick={() => handleOptionClick(opt.action, opt.label)}
                                                        className="text-xs border border-white/20 hover:bg-white/10 rounded-full px-4 py-2 transition-colors animate-in fade-in slide-in-from-bottom-2"
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/5 border-t border-white/10 shrink-0">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your issue..."
                                    className="bg-black/20 border-white/10 focus-visible:ring-violet-500"
                                />
                                <Button type="submit" className="shrink-0 w-10 h-10 p-0" disabled={!inputValue.trim()}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Form (Appears when needed or requested) */}
                    {(showForm || formSuccess) && (
                        <div className="w-full lg:flex-1 animate-in slide-in-from-right duration-500 fade-in">
                            <div className="bg-card border border-white/10 rounded-2xl p-8 relative overflow-hidden h-full lg:h-[600px] flex flex-col justify-center">
                                {formSuccess ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                        <p className="text-muted-foreground">Reference ID: #{Math.floor(Math.random() * 10000)}</p>
                                        <Button className="mt-8" variant="outline" onClick={() => window.location.reload()}>
                                            Start New Chat
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleFormSubmit} className="space-y-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="bg-white/10 p-2 rounded-lg">
                                                <Mail className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Send a Message</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-muted-foreground">Your Name</label>
                                                <Input
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="John Doe"
                                                    required
                                                    className="bg-black/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                                <Input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="john@example.com"
                                                    required
                                                    className="bg-black/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Subject</label>
                                            <Input
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                placeholder="e.g. Account Recovery Help"
                                                required
                                                className="bg-black/20"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-muted-foreground">Message</label>
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessageBody(e.target.value)}
                                                placeholder="Describe your issue in detail..."
                                                className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                                                required
                                            ></textarea>
                                        </div>

                                        <div className="pt-2">
                                            <Button type="submit" className="w-full" isLoading={formLoading}>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send to Support
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
