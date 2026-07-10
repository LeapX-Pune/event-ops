(function () {
    'use strict';

    let isTyping = false;
    let chatInitialized = false;

    const STORAGE_KEY = 'conclave_chat_history';
    const MAX_HISTORY = 50;

    const KEYWORD_RESPONSES = [
        {
            keywords: ['tech', 'technology', 'coding', 'programming', 'developer', 'software'],
            response: "We have tech-focused experiences like the 'Obsidian Canvas: NFT Auction' blending digital art with blockchain. Check our Events page for more!"
        },
        {
            keywords: ['music', 'concert', 'band', 'gala', 'symphony', 'orchestra'],
            response: "The 'Skyline Gala: The Winter Solstice' features a celestial atmosphere with curated soundscapes. Browse Events for more."
        },
        {
            keywords: ['workshop', 'bootcamp', 'learn', 'class', 'course', 'training', 'masterclass'],
            response: "We offer immersive experiences designed to educate and inspire. The 'Aurora Retreat' combines biohacking with expert-led sessions."
        },
        {
            keywords: ['weekend', 'this week', 'upcoming', 'soon', 'next', 'today', 'tomorrow'],
            response: "Here are our upcoming experiences — the 'Submerged Symphony' (Dec 15) and 'Aurora Retreat' (Jan 10) are next. Check Events for full details."
        },
        {
            keywords: ['food', 'cooking', 'culinary', 'dining', 'gastronomy', 'restaurant'],
            response: "The 'Submerged Symphony' offers a 12-course molecular gastronomy dining experience 50 feet underwater. A true culinary journey!"
        },
        {
            keywords: ['sports', 'fitness', 'automotive', 'racing', 'track', 'hypercar'],
            response: "Test drive unreleased hypercars at Monza Circuit in 'The Future of Motion' experience. Pure automotive excellence!"
        },
        {
            keywords: ['register', 'sign up', 'join', 'book', 'attend', 'ticket', 'reserve'],
            response: "To book an experience, browse our Events page, select an event, and click the 'Reserve Pass' button. It's quick and seamless."
        },
        {
            keywords: ['price', 'cost', 'pricing', 'how much', 'expensive', 'cheap', 'worth'],
            response: "Our experiences range from $2,000 (Obsidian Canvas) to $15,000 (Submerged Symphony). Each is a fully curated, all-inclusive experience."
        },
        {
            keywords: ['help', 'how', 'what', 'guide', 'assist', 'support', 'can you'],
            response: "I can help you discover events! Try asking about 'tech', 'music', 'workshops', 'weekend experiences', or 'pricing'."
        },
        {
            keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening'],
            response: "Welcome to Conclave! I'm your event assistant. Ask me about our curated experiences, pricing, or how to book."
        },
        {
            keywords: ['thanks', 'thank you', 'appreciate', 'helpful', 'great'],
            response: "You're welcome! Let me know if you need anything else. Happy exploring!"
        }
    ];

    const FALLBACK_RESPONSE = "I can help you discover events. Try asking about 'tech', 'music', 'weekend experiences', or 'pricing'.";

    function formatTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    function findResponse(message) {
        const lower = message.toLowerCase().trim();
        for (const entry of KEYWORD_RESPONSES) {
            if (entry.keywords.some(kw => lower.includes(kw))) {
                return entry.response;
            }
        }
        return FALLBACK_RESPONSE;
    }

    function addMessage(text, sender) {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'chat-msg ' + sender;

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.textContent = text;
        wrapper.appendChild(bubble);

        const time = document.createElement('div');
        time.className = 'chat-timestamp';
        time.textContent = formatTimestamp();
        wrapper.appendChild(time);

        container.appendChild(wrapper);
        container.scrollTop = container.scrollHeight;
        saveHistory(sender, text);
    }

    function createTypingIndicator() {
        const wrapper = document.createElement('div');
        wrapper.className = 'chat-msg bot';
        wrapper.id = 'chat-typing';

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        const dots = document.createElement('div');
        dots.className = 'chat-typing-dots';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.className = 'chat-typing-dot';
            dots.appendChild(dot);
        }
        bubble.appendChild(dots);
        wrapper.appendChild(bubble);
        return wrapper;
    }

    function showTypingIndicator() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const el = createTypingIndicator();
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
        isTyping = true;
    }

    function removeTypingIndicator() {
        const el = document.getElementById('chat-typing');
        if (el) el.remove();
        isTyping = false;
    }

    function handleQuickReply(text) {
        const input = document.getElementById('chat-input');
        if (!input) return;
        input.value = text;
        handleSend();
    }

    function saveHistory(sender, text) {
        try {
            const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            history.push({ sender, text, time: formatTimestamp() });
            if (history.length > MAX_HISTORY) {
                history.splice(0, history.length - MAX_HISTORY);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
        }
    }

    function loadHistory() {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        let history;
        try {
            history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) {
            history = [];
        }

        if (history.length === 0) {
            injectQuickReplies();
            return;
        }

        history.forEach(entry => {
            const wrapper = document.createElement('div');
            wrapper.className = 'chat-msg ' + entry.sender;

            const bubble = document.createElement('div');
            bubble.className = 'chat-bubble';
            bubble.textContent = entry.text;
            wrapper.appendChild(bubble);

            const time = document.createElement('div');
            time.className = 'chat-timestamp';
            time.textContent = entry.time || '';
            wrapper.appendChild(time);

            container.appendChild(wrapper);
        });

        container.scrollTop = container.scrollHeight;
    }

    function injectQuickReplies() {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'chat-msg bot';

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.textContent = "Welcome to Conclave! I'm your event assistant. Ask me about our curated experiences, pricing, or how to book.";
        wrapper.appendChild(bubble);

        const time = document.createElement('div');
        time.className = 'chat-timestamp';
        time.textContent = formatTimestamp();
        wrapper.appendChild(time);

        container.appendChild(wrapper);

        const replies = document.createElement('div');
        replies.className = 'chat-quick-replies';

        const buttons = [
            { label: 'Tech Events', query: 'Show me tech events' },
            { label: 'Music', query: 'Music events' },
            { label: 'Pricing', query: 'How much do events cost' },
            { label: 'Upcoming', query: 'What is upcoming this week' }
        ];

        buttons.forEach(btn => {
            const el = document.createElement('button');
            el.className = 'quick-reply-btn';
            el.textContent = btn.label;
            el.addEventListener('click', () => handleQuickReply(btn.query));
            replies.appendChild(el);
        });

        container.appendChild(replies);
        container.scrollTop = container.scrollHeight;
    }

    function handleSend() {
        const input = document.getElementById('chat-input');
        if (!input) return;

        const text = input.value.trim();
        if (!text || isTyping) return;

        input.value = '';
        addMessage(text, 'user');
        showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator();
            const response = findResponse(text);
            addMessage(response, 'bot');
        }, 800);
    }

    function initChat() {
        if (chatInitialized) return;
        chatInitialized = true;

        const toggle = document.getElementById('chat-toggle');
        const chatWindow = document.getElementById('chat-window');
        const closeBtn = document.getElementById('chat-close');
        const sendBtn = document.getElementById('chat-send');
        const input = document.getElementById('chat-input');

        if (!toggle || !chatWindow) return;

        let hasGreeted = false;
        toggle.addEventListener('click', function () {
            chatWindow.classList.toggle('open');
            if (!hasGreeted && chatWindow.classList.contains('open')) {
                hasGreeted = true;
                loadHistory();
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                chatWindow.classList.remove('open');
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', handleSend);
        }

        if (input) {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    handleSend();
                }
            });
        }
    }

    window.initChat = initChat;
})();
