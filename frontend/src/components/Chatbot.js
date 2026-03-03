import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUserShield, FaUser } from 'react-icons/fa';
import { Store } from '../context/StoreContext';

const Chatbot = () => {
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [isOpen, setIsOpen] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 How can I help you today?", sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isAdminMode]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        if (isAdminMode) {
            // Admin sending a message
            const newAdminMessage = {
                id: messages.length + 1,
                text: inputText,
                sender: 'bot' // Admin acts as the bot
            };
            setMessages(prev => [...prev, newAdminMessage]);
        } else {
            // User sending a message
            const newUserMessage = {
                id: messages.length + 1,
                text: inputText,
                sender: 'user'
            };
            setMessages(prev => [...prev, newUserMessage]);
        }

        setInputText("");
    };

    // If a non-admin user somehow gets into admin mode (e.g. logs out while in admin mode), reset it
    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            setIsAdminMode(false);
        }
    }, [userInfo]);

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'Inter, sans-serif' }}>
            {/* Chat Trigger Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#FF8717',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <FaComments size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    right: '0',
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'fadeInUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        backgroundColor: isAdminMode ? '#2c3e50' : '#1a1e21',
                        color: 'white',
                        padding: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '3px solid #FF8717'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '35px',
                                height: '35px',
                                backgroundColor: '#FF8717',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {isAdminMode ? <FaUserShield size={20} /> : <FaRobot size={20} />}
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                                    {isAdminMode ? 'Admin Console' : 'Radios Assistant'}
                                </h4>
                                <span style={{ fontSize: '12px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ width: '8px', height: '8px', backgroundColor: '#2ecc71', borderRadius: '50%', display: 'inline-block' }}></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {userInfo && userInfo.isAdmin && (
                                <button
                                    onClick={() => setIsAdminMode(!isAdminMode)}
                                    title={isAdminMode ? "Switch to User Mode" : "Switch to Admin Mode"}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        color: '#ccc',
                                        cursor: 'pointer',
                                        padding: '5px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {isAdminMode ? <FaUser size={14} /> : <FaUserShield size={14} />}
                                </button>
                            )}
                            <button
                                onClick={toggleChat}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#ccc',
                                    cursor: 'pointer',
                                    padding: '5px'
                                }}
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '15px',
                        overflowY: 'auto',
                        backgroundColor: isAdminMode ? '#eef2f3' : '#f8f9fa',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    alignSelf: msg.sender === 'user' ? (isAdminMode ? 'flex-start' : 'flex-end') : (isAdminMode ? 'flex-end' : 'flex-start'),
                                    maxWidth: '80%',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    backgroundColor: msg.sender === 'user'
                                        ? (isAdminMode ? 'white' : '#FF8717')
                                        : (isAdminMode ? '#FF8717' : 'white'),
                                    color: msg.sender === 'user'
                                        ? (isAdminMode ? '#333' : 'white')
                                        : (isAdminMode ? 'white' : '#333'),
                                    borderBottomRightRadius:
                                        (msg.sender === 'user' && !isAdminMode) || (msg.sender === 'bot' && isAdminMode) ? '2px' : '12px',
                                    borderBottomLeftRadius:
                                        (msg.sender === 'bot' && !isAdminMode) || (msg.sender === 'user' && isAdminMode) ? '2px' : '12px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    fontSize: '14px',
                                    lineHeight: '1.5'
                                }}
                            >
                                {isAdminMode && (
                                    <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '2px' }}>
                                        {msg.sender === 'user' ? 'User' : 'You (Admin)'}
                                    </div>
                                )}
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form
                        onSubmit={handleSendMessage}
                        style={{
                            padding: '15px',
                            backgroundColor: 'white',
                            borderTop: '1px solid #eee',
                            display: 'flex',
                            gap: '10px'
                        }}
                    >
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={isAdminMode ? "Reply as Admin..." : "Type your message..."}
                            style={{
                                flex: 1,
                                padding: '10px 15px',
                                borderRadius: '25px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#FF8717',
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            <FaPaperPlane size={16} style={{ marginLeft: '-2px' }} />
                        </button>
                    </form>
                </div>
            )}
            <style>
                {`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </div>
    );
};

export default Chatbot;
