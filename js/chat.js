// ═══ Homepage Chat Widget ═══
// Floating chat interface with keyword-based event responses.
// PRD: FR-9 — Homepage Chat UI

(function () {
    // Only load on homepage
    const isHomepage = !window.location.pathname.includes('/pages/');
    if (!isHomepage) return;

    // ── Styles ──
    const style = document.createElement('style');
    style.textContent = `
        .chat-fab {
            position: fixed;
            bottom: 28px;
            right: 28px;
            z-index: 9000;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--gold), #d4a853);
            color: #0a0a12;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 24px rgba(230,198,135,0.3);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: auto;
        }
        .chat-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 32px rgba(230,198,135,0.5);
        }
        .chat-fab .material-symbols-outlined { font-size: 26px; }

        .chat-panel {
            position: fixed;
            bottom: 96px;
            right: 28px;
            z-index: 9000;
            width: 380px;
            max-width: calc(100vw - 56px);
            height: 500px;
            max-height: calc(100vh - 140px);
            background: rgba(14, 14, 22, 0.95);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .chat-panel.open {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        .chat-header {
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .chat-header-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            font-weight: 500;
            color: white;
            letter-spacing: 0.5px;
        }
        .chat-header-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 20px;
            padding: 0;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .chat-bubble {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            line-height: 1.6;
            color: rgba(255,255,255,0.85);
            animation: chatFadeIn 0.3s ease;
        }
        .chat-bubble.bot {
            align-self: flex-start;
            background: rgba(255,255,255,0.06);
            border-bottom-left-radius: 4px;
        }
        .chat-bubble.user {
            align-self: flex-end;
            background: rgba(230,198,135,0.15);
            border-bottom-right-radius: 4px;
            color: var(--gold);
        }
        .chat-timestamp {
            font-size: 10px;
            color: rgba(255,255,255,0.25);
            margin-top: 4px;
        }
        .chat-event-card {
            display: block;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 8px;
            padding: 10px 12px;
            margin-top: 8px;
            text-decoration: none;
            color: inherit;
            transition: border-color 0.3s;
        }
        .chat-event-card:hover { border-color: rgba(230,198,135,0.3); }
        .chat-event-card-title {
            font-size: 12px;
            font-weight: 500;
            color: white;
            margin-bottom: 2px;
        }
        .chat-event-card-meta {
            font-size: 11px;
            color: rgba(255,255,255,0.4);
        }

        @keyframes chatFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .chat-input-bar {
            padding: 12px 16px;
            border-top: 1px solid rgba(255,255,255,0.06);
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .chat-input-bar input {
            flex: 1;
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 999px;
            padding: 10px 16px;
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            color: white;
            outline: none;
            transition: border-color 0.3s;
        }
        .chat-input-bar input::placeholder { color: rgba(255,255,255,0.25); }
        .chat-input-bar input:focus { border-color: rgba(230,198,135,0.4); }
        .chat-input-bar button {
            background: none;
            border: none;
            color: var(--gold);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s;
        }
        .chat-input-bar button:hover { opacity: 0.7; }

        .chat-suggestions {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
        }
        .chat-suggestion-chip {
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            padding: 6px 12px;
            border-radius: 999px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.03);
            color: rgba(255,255,255,0.5);
            cursor: pointer;
            transition: all 0.2s;
        }
        .chat-suggestion-chip:hover {
            border-color: rgba(230,198,135,0.4);
            color: var(--gold);
        }
    `;
    document.head.appendChild(style);

    // ── HTML ──
    const chatHTML = `
        <button class="chat-fab" id="chat-fab">
            <span class="material-symbols-outlined">chat</span>
        </button>
        <div class="chat-panel" id="chat-panel">
            <div class="chat-header">
                <span class="chat-header-title">Conclave Assistant</span>
                <button class="chat-header-close material-symbols-outlined" id="chat-close">close</button>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="chat-input-bar">
                <input type="text" id="chat-input" placeholder="Ask about events..." autocomplete="off"/>
                <button id="chat-send"><span class="material-symbols-outlined" style="font-size:22px;">send</span></button>
            </div>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = chatHTML;
    wrapper.style.pointerEvents = 'auto';
    document.body.appendChild(wrapper);

    // ── Logic ──
    const fab = document.getElementById('chat-fab');
    const panel = document.getElementById('chat-panel');
    const closeBtn = document.getElementById('chat-close');
    const messagesContainer = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');

    let isOpen = false;

    function toggleChat() {
        isOpen = !isOpen;
        panel.classList.toggle('open', isOpen);
        fab.querySelector('.material-symbols-outlined').textContent = isOpen ? 'close' : 'chat';
        if (isOpen) input.focus();
    }

    fab.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    function getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function addMessage(text, sender, html) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + sender;
        if (html) {
            bubble.innerHTML = text;
        } else {
            bubble.textContent = text;
        }
        const ts = document.createElement('div');
        ts.className = 'chat-timestamp';
        ts.textContent = getTimestamp();
        bubble.appendChild(ts);
        messagesContainer.appendChild(bubble);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function findEvents(query) {
        const events = window.CONCLAVE_EVENTS || [];
        const q = query.toLowerCase();

        const categoryKeywords = {
            'tech': ['Technology', 'Digital Art & Crypto'],
            'digital': ['Digital Art & Crypto'],
            'art': ['Digital Art & Crypto'],
            'crypto': ['Digital Art & Crypto'],
            'nft': ['Digital Art & Crypto'],
            'automotive': ['Automotive Excellence'],
            'car': ['Automotive Excellence'],
            'racing': ['Automotive Excellence'],
            'aviation': ['Aviation Showcase'],
            'jet': ['Aviation Showcase'],
            'flying': ['Aviation Showcase'],
            'gala': ['Celestial Gala'],
            'social': ['Celestial Gala', 'Gastronomic Journey'],
            'party': ['Celestial Gala'],
            'food': ['Gastronomic Journey'],
            'culinary': ['Gastronomic Journey'],
            'dining': ['Gastronomic Journey'],
            'wellness': ['Extreme Wellness'],
            'health': ['Extreme Wellness'],
            'retreat': ['Extreme Wellness'],
            'music': ['Celestial Gala'],
            'workshop': ['Automotive Excellence', 'Extreme Wellness']
        };

        let matches = [];

        // Check category keywords
        for (const [keyword, categories] of Object.entries(categoryKeywords)) {
            if (q.includes(keyword)) {
                matches.push(...events.filter(e => categories.includes(e.category)));
            }
        }

        // Check title match
        if (matches.length === 0) {
            matches = events.filter(e => e.title.toLowerCase().includes(q));
        }

        // Upcoming check
        if (q.includes('upcoming') || q.includes('next') || q.includes('soon')) {
            matches = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        // Weekend check
        if (q.includes('weekend') || q.includes('saturday') || q.includes('sunday')) {
            matches = events.filter(e => {
                const day = new Date(e.date).getDay();
                return day === 0 || day === 6;
            });
        }

        // Remove duplicates
        const seen = new Set();
        return matches.filter(e => {
            if (seen.has(e.id)) return false;
            seen.add(e.id);
            return true;
        }).slice(0, 3);
    }

    function buildEventCards(events) {
        return events.map(e => `
            <a href="pages/event-detail.html?event=${e.id}" class="chat-event-card">
                <div class="chat-event-card-title">${e.title}</div>
                <div class="chat-event-card-meta">${e.date} · ${e.location} · ${e.price}</div>
            </a>
        `).join('');
    }

    function getResponse(userMsg) {
        const q = userMsg.toLowerCase().trim();

        if (!q) return null; // empty input prevention

        // Greetings
        if (/^(hi|hello|hey|yo|greetings)/i.test(q)) {
            return "Hello! 👋 Welcome to Conclave. I can help you discover events. Try asking about specific categories like <b>automotive</b>, <b>wellness</b>, or <b>culinary</b>!";
        }

        // Help
        if (q.includes('help') || q === '?') {
            return "I can help you with:<br>• Finding events by category<br>• Upcoming events<br>• Event details<br><br>Try: <i>\"Show me automotive events\"</i> or <i>\"Any wellness retreats?\"</i>";
        }

        // All events
        if (q.includes('all event') || q.includes('show event') || q.includes('what event') || q.includes('list event')) {
            const events = window.CONCLAVE_EVENTS || [];
            return "Here are all our current experiences:" + buildEventCards(events);
        }

        // Category / keyword search
        const matches = findEvents(q);
        if (matches.length > 0) {
            return "Here's what I found:" + buildEventCards(matches);
        }

        // Fallback
        return "I'm not sure about that. Try asking about event categories like <b>automotive</b>, <b>wellness</b>, <b>culinary</b>, or <b>aviation</b>. You can also type <b>help</b> for more options!";
    }

    function handleSend() {
        const msg = input.value.trim();
        if (!msg) return; // FR: empty submission prevention

        addMessage(msg, 'user');
        input.value = '';

        // Simulate brief typing delay
        setTimeout(() => {
            const response = getResponse(msg);
            if (response) addMessage(response, 'bot', true);
        }, 400);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Welcome message
    setTimeout(() => {
        addMessage("Welcome to Conclave! 🌟 Ask me about our curated events, or try one of the suggestions below.", 'bot');

        // Add suggestion chips
        const suggestions = document.createElement('div');
        suggestions.className = 'chat-suggestions';
        ['Show me tech events', 'Any wellness retreats?', 'Upcoming events', 'Help'].forEach(text => {
            const chip = document.createElement('button');
            chip.className = 'chat-suggestion-chip';
            chip.textContent = text;
            chip.addEventListener('click', () => {
                input.value = text;
                handleSend();
            });
            suggestions.appendChild(chip);
        });
        messagesContainer.appendChild(suggestions);
    }, 500);
})();
