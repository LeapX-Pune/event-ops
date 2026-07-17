(function () {
    'use strict';

    let isTyping = false;
    let chatInitialized = false;
    let fallbackStreak = 0;

    const STORAGE_KEY = 'ep_chat_history';
    const MAX_HISTORY = 50;

    let msgCounter = 0;

    function generateMsgId() {
        return 'chat_' + Date.now().toString(36) + '_' + (++msgCounter);
    }

    function formatISOTimestamp() {
        return new Date().toISOString();
    }

    function formatDisplayTime(isoString) {
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (_) { return ''; }
    }

    function hasWord(message, keyword) {
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('\\b' + escaped + '\\b', 'i');
        return regex.test(message);
    }

    function getEvents() {
        return window.CONCLAVE_EVENTS || [];
    }

    function getCategoryId(key) {
        const map = {
            tech: 'cat_tech',
            music: 'cat_music',
            sports: 'cat_sports',
            art: 'cat_art',
            business: 'cat_business',
            food: 'cat_food',
            health: 'cat_health',
            edu: 'cat_edu',
            auto: 'cat_auto',
            aviation: 'cat_aviation'
        };
        return map[key] || null;
    }

    var responseIndex = {};

    function pickResponse(key) {
        if (!responseIndex[key]) responseIndex[key] = 0;
        var config = KEYWORD_RESPONSES[key];
        if (!config.responses) return config.response;
        var idx = responseIndex[key] % config.responses.length;
        responseIndex[key] = idx + 1;
        return config.responses[idx];
    }

    const KEYWORD_RESPONSES = {
        tech: {
            keywords: ['tech', 'technology', 'coding', 'programming', 'developer', 'software', 'frontend', 'backend', 'ai', 'software engineer'],
            response: "Here are our tech events:",
            category: 'cat_tech'
        },
        music: {
            keywords: ['concert', 'band', 'orchestra', 'music', 'live music', 'dj', 'festival', 'symphony'],
            response: "Check out these music events:",
            category: 'cat_music'
        },
        workshop: {
            keywords: ['workshop', 'bootcamp', 'masterclass', 'class', 'learn', 'training', 'course', 'tutorial', 'seminar'],
            response: "We have these workshops and learning experiences:",
            category: 'cat_edu'
        },
        sports: {
            keywords: ['fitness', 'game', 'running', 'yoga', 'marathon', 'sports', 'match', 'tournament', 'football', 'cricket', 'tennis', 'basketball'],
            response: "Explore these sports events:",
            category: 'cat_sports'
        },
        art: {
            keywords: ['exhibition', 'gallery', 'creative', 'design', 'paint', 'art', 'photography', 'sculpture', 'museum'],
            response: "Art events coming up:",
            category: 'cat_art'
        },
        food: {
            keywords: ['cooking', 'culinary', 'dining', 'gastronomy', 'food', 'restaurant', 'bakery', 'street food', 'wine'],
            response: "Food events you'll enjoy:",
            category: 'cat_food'
        },
        business: {
            keywords: ['networking', 'startup', 'entrepreneur', 'corporate', 'fintech', 'business', 'investor', 'pitch', 'conference'],
            response: "Business events available:",
            category: 'cat_business'
        },
        health: {
            keywords: ['wellness', 'meditation', 'fitness', 'nutrition', 'health', 'mental health', 'therapy', 'retreat'],
            response: "Health and wellness events:",
            category: 'cat_health'
        },
        auto: {
            keywords: ['car', 'racing', 'automotive', 'hypercar', 'auto', 'motor', 'vehicle', 'supercar', 'expo'],
            response: "Automotive events:",
            category: 'cat_auto'
        },
        aviation: {
            keywords: ['airshow', 'aerospace', 'aviation', 'flight', 'aircraft', 'plane', 'jet', 'airport'],
            response: "Aviation events:",
            category: 'cat_aviation'
        },
        upcoming: {
            keywords: ['upcoming', 'soon', 'next', 'weekend', 'future', 'events', 'event', 'calendar', 'schedule', 'happening', 'planned'],
            response: "Here are upcoming events:",
            getEvents: function () {
                const now = new Date();
                const all = getEvents();
                return all.filter(function (e) {
                    var d = new Date(e.date);
                    return d >= now;
                }).sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
            }
        },
        register: {
            keywords: ['register', 'sign up', 'join', 'ticket', 'booking', 'reserve', 'book', 'buy', 'purchase', 'enroll', 'attend'],
            response: "To register for any event, just find it on our Events page, click the event card, and hit the 'Reserve Pass' button!"
        },
        pricing: {
            keywords: ['price', 'cost', 'how much', 'expensive', 'cheap', 'pricing', 'worth', 'value', 'fee', 'donation', 'free'],
            response: "Our events range from free to premium experiences. Browse the Events page to see specific pricing for each event."
        },
        help: {
            keywords: ['help', 'how', 'what', 'guide', 'assist', 'support', 'can you', 'could you', 'would you', 'how to', 'what is', 'what are', 'how does', 'i need', 'looking for'],
            responses: [
                "I can help you find events! Try asking about: tech, music, art, sports, food, business, health, automotive, or aviation events. You can also ask about upcoming events or pricing.",
                "Sure, I'm here to help! You can ask me about event categories like tech or music, check pricing, or find out what's upcoming. What are you interested in?",
                "Need help navigating? Try typing a category name like 'tech', 'music', or 'sports', or ask about 'upcoming events' to see what's happening soon!"
            ]
        },
        hello: {
            keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'good afternoon', 'good day', 'howdy', 'sup', 'yo', 'how are you', 'how do you do', 'nice to meet', 'whats up', 'wasup'],
            responses: [
                "Hey there! Welcome to Conclave! I'm your event assistant. Ask me about our curated experiences, pricing, or how to book. Try 'Show me tech events' or 'What's upcoming?'",
                "Hi! Great to see you. I can help you discover amazing events. Try asking about categories like tech, music, or sports!",
                "Hello! Welcome aboard. Browse our events or just ask me anything — I'm here to help you find the perfect experience!"
            ]
        },
        thanks: {
            keywords: ['thanks', 'thank you', 'thank you so much', 'thx', 'appreciate', 'helpful', 'great', 'awesome', 'wonderful', 'perfect', 'amazing', 'good', 'cool'],
            responses: [
                "You're welcome! Let me know if you need anything else. Happy exploring!",
                "Happy to help! Enjoy your event journey with Conclave.",
                "Anytime! If you have more questions, I'm right here. Enjoy!"
            ]
        }
    };

    const EVENT_CATEGORIES = ['tech', 'music', 'workshop', 'sports', 'art', 'food', 'business', 'health', 'auto', 'aviation'];

    function suggestOtherCategories(excludeKey) {
        var others = [];
        for (var i = 0; i < EVENT_CATEGORIES.length; i++) {
            if (EVENT_CATEGORIES[i] !== excludeKey) {
                others.push(EVENT_CATEGORIES[i]);
            }
        }
        var shuffled = others.sort(function () { return 0.5 - Math.random(); });
        var picked = shuffled.slice(0, 3);
        return "Try asking about " + picked.join(', ') + ", or check upcoming events!";
    }

    const FALLBACK_RESPONSE = "I'm not sure about that, but I can help you find something incredible. Try asking about tech, music, art, sports, food, business, or aviation events.";

    var FALLBACK_ESCALATIONS = [
        function () {
            var all = getEvents();
            var now = new Date();
            var upcoming = all.filter(function (e) {
                var d = new Date(e.date);
                return d >= now;
            }).sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
            if (upcoming.length > 0) {
                return {
                    text: "Having trouble finding something? Here are some upcoming events you might like!",
                    events: upcoming.slice(0, 3)
                };
            }
            return null;
        },
        function () {
            return {
                text: "Let me help! You can browse all our events on the Events page, or try asking about categories like tech, music, or sports. What interests you?",
                events: []
            };
        },
        function () {
            return {
                text: "I'm here to help! Head over to our Events page to see everything, or type something like 'tech events', 'music', or 'upcoming' to get started!",
                events: []
            };
        }
    ];

    function findResponse(message) {
        var lower = message.toLowerCase().trim();

        var todayMatch = lower.match(/\btoday\b/);
        var tomorrowMatch = lower.match(/\btomorrow\b/);
        var thisWeekMatch = lower.match(/\bthis\s+week\b/);

        if (todayMatch || tomorrowMatch || thisWeekMatch) {
            var now = new Date();
            var target = new Date(now);

            if (todayMatch) {
                // keep today
            } else if (tomorrowMatch) {
                target.setDate(target.getDate() + 1);
            } else if (thisWeekMatch) {
                var dayOfWeek = target.getDay();
                var diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                target.setDate(target.getDate() + diffToMonday);
                var endOfWeek = new Date(target);
                endOfWeek.setDate(endOfWeek.getDate() + 6);

                var all = getEvents();
                var weekEvents = all.filter(function (e) {
                    var d = new Date(e.date);
                    return d >= target && d <= endOfWeek;
                }).sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

                return {
                    text: weekEvents.length > 0 ? "Events happening this week:" : "Nothing scheduled this week. " + suggestOtherCategories(null),
                    events: weekEvents.slice(0, 3)
                };
            }

            var targetStr = target.getFullYear() + '-' +
                String(target.getMonth() + 1).padStart(2, '0') + '-' +
                String(target.getDate()).padStart(2, '0');

            var all = getEvents();
            var dayEvents = all.filter(function (e) { return e.date === targetStr; });

            var label = todayMatch ? 'today' : 'tomorrow';
            return {
                text: dayEvents.length > 0
                    ? "Events happening " + label + ":"
                    : "Nothing happening " + label + ". " + suggestOtherCategories(null),
                events: dayEvents.slice(0, 3)
            };
        }

        for (var key in KEYWORD_RESPONSES) {
            if (KEYWORD_RESPONSES.hasOwnProperty(key)) {
                var config = KEYWORD_RESPONSES[key];
                var matched = false;

                for (var ki = 0; ki < config.keywords.length; ki++) {
                    if (hasWord(lower, config.keywords[ki])) {
                        matched = true;
                        break;
                    }
                }

                if (matched) {
                    var matchingEvents;

                    if (typeof config.getEvents === 'function') {
                        matchingEvents = config.getEvents();
                    } else if (config.category) {
                        var allEvents = getEvents();
                        matchingEvents = allEvents.filter(function (e) {
                            return e.category === config.category;
                        });
                    } else {
                        matchingEvents = [];
                    }

                    if (matchingEvents.length > 0) {
                        return {
                            text: pickResponse(key),
                            events: matchingEvents.slice(0, 3)
                        };
                    } else {
                        if (config.category) {
                            return {
                                text: "No " + key + " events are happening right now. " + suggestOtherCategories(key),
                                events: []
                            };
                        }
                        if (typeof config.getEvents === 'function') {
                            return {
                                text: "No " + key + " events found. " + suggestOtherCategories(null),
                                events: []
                            };
                        }
                        return {
                            text: pickResponse(key),
                            events: []
                        };
                    }
                }
            }
        }

        return {
            text: FALLBACK_RESPONSE,
            events: [],
            isFallback: true
        };
    }

    function createMessageElement(sender, text, timestamp, events) {
        var messageDiv = document.createElement('div');
        messageDiv.className = 'chat-msg ' + sender;

        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.textContent = text;
        messageDiv.appendChild(bubble);

        if (events && events.length > 0) {
            var suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'chat-quick-replies';
            suggestionsDiv.style.marginTop = '6px';

            for (var i = 0; i < events.length; i++) {
                (function (evt) {
                    var suggestion = document.createElement('div');
                    suggestion.className = 'chat-event-suggestion';
                    suggestion.setAttribute('role', 'button');
                    suggestion.setAttribute('tabindex', '0');
                    suggestion.innerHTML =
                        '<div class="suggestion-title">' + evt.title + '</div>' +
                        '<div class="suggestion-meta">' + (evt.date || '') + ' \u2022 ' + (evt.location || '').split(',')[0] + '</div>';

                    suggestion.addEventListener('click', function () {
                        window.dispatchEvent(new CustomEvent('openEventDetail', {
                            detail: { eventId: evt.id }
                        }));
                        var chatWindow = document.getElementById('chat-window');
                        if (chatWindow) chatWindow.classList.remove('open');
                    });

                    suggestionsDiv.appendChild(suggestion);
                })(events[i]);
            }

            messageDiv.appendChild(suggestionsDiv);
        }

        var timeEl = document.createElement('div');
        timeEl.className = 'chat-timestamp';
        timeEl.textContent = formatDisplayTime(timestamp);
        messageDiv.appendChild(timeEl);

        return messageDiv;
    }

    function createTypingIndicator() {
        var wrapper = document.createElement('div');
        wrapper.className = 'chat-msg bot';
        wrapper.id = 'chat-typing';

        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        var dots = document.createElement('div');
        dots.className = 'chat-typing-dots';
        for (var i = 0; i < 3; i++) {
            var dot = document.createElement('span');
            dot.className = 'chat-typing-dot';
            dots.appendChild(dot);
        }
        bubble.appendChild(dots);
        wrapper.appendChild(bubble);
        return wrapper;
    }

    function showTypingIndicator() {
        var container = document.getElementById('chat-messages');
        if (!container) return;
        var el = createTypingIndicator();
        container.appendChild(el);
        container.scrollTop = container.scrollHeight;
        isTyping = true;
    }

    function removeTypingIndicator() {
        var el = document.getElementById('chat-typing');
        if (el) el.remove();
        isTyping = false;
    }

    function scrollToBottom() {
        var container = document.getElementById('chat-messages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    function addMessage(text, sender, events) {
        var container = document.getElementById('chat-messages');
        if (!container) return;

        events = events || [];

        var timestamp = formatISOTimestamp();
        var messageEl = createMessageElement(sender, text, timestamp, events);
        container.appendChild(messageEl);
        scrollToBottom();

        saveHistory(sender, text, timestamp, events.map(function (e) { return e.id; }));
    }

    function handleQuickReply(text) {
        var input = document.getElementById('chat-input');
        if (!input) return;
        input.value = text;
        handleSend();
    }

    function saveHistory(sender, text, timestamp, eventIds) {
        try {
            var history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            history.push({
                id: generateMsgId(),
                sender: sender,
                text: text,
                timestamp: timestamp,
                events: eventIds || []
            });
            if (history.length > MAX_HISTORY) {
                history.splice(0, history.length - MAX_HISTORY);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) { /* localStorage unavailable */ }
    }

    function loadHistory() {
        var container = document.getElementById('chat-messages');
        if (!container) return;

        var history;
        try {
            history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) {
            history = [];
        }

        if (history.length === 0) {
            injectQuickReplies();
            return;
        }

        var allEvents = getEvents();

        for (var i = 0; i < history.length; i++) {
            var entry = history[i];
            var linkedEvents = [];

            if (entry.events && entry.events.length > 0) {
                for (var j = 0; j < entry.events.length; j++) {
                    var found = null;
                    for (var k = 0; k < allEvents.length; k++) {
                        if (allEvents[k].id === entry.events[j]) {
                            found = allEvents[k];
                            break;
                        }
                    }
                    if (found) linkedEvents.push(found);
                }
            }

            var msgEl = createMessageElement(
                entry.sender,
                entry.text,
                entry.timestamp || new Date().toISOString(),
                linkedEvents
            );
            container.appendChild(msgEl);
        }

        scrollToBottom();
    }

    function injectQuickReplies() {
        var container = document.getElementById('chat-messages');
        if (!container) return;

        var wrapper = document.createElement('div');
        wrapper.className = 'chat-msg bot';

        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.textContent = "Welcome to Conclave! I'm your event assistant. Ask me about our curated experiences, pricing, or how to book.";
        wrapper.appendChild(bubble);

        var time = document.createElement('div');
        time.className = 'chat-timestamp';
        time.textContent = formatDisplayTime(formatISOTimestamp());
        wrapper.appendChild(time);

        container.appendChild(wrapper);

        var replies = document.createElement('div');
        replies.className = 'chat-quick-replies';

        var buttons = [
            { label: 'Tech Events', query: 'Show me tech events' },
            { label: 'Music', query: 'Music events' },
            { label: 'Pricing', query: 'How much do events cost' },
            { label: 'Upcoming', query: 'What is upcoming soon' }
        ];

        for (var i = 0; i < buttons.length; i++) {
            (function (btn) {
                var el = document.createElement('button');
                el.className = 'quick-reply-btn';
                el.textContent = btn.label;
                el.addEventListener('click', function () { handleQuickReply(btn.query); });
                replies.appendChild(el);
            })(buttons[i]);
        }

        container.appendChild(replies);
        scrollToBottom();
    }

    function handleSend() {
        var input = document.getElementById('chat-input');
        if (!input) return;

        var text = input.value.trim();
        if (!text || isTyping) return;

        input.value = '';
        addMessage(text, 'user');

        showTypingIndicator();

        setTimeout(function () {
            try {
                var response = findResponse(text);
                removeTypingIndicator();

                if (response.isFallback) {
                    fallbackStreak++;
                    if (fallbackStreak >= 2) {
                        var idx = Math.min(fallbackStreak - 2, FALLBACK_ESCALATIONS.length - 1);
                        var escalated = FALLBACK_ESCALATIONS[idx]();
                        if (escalated) {
                            addMessage(escalated.text, 'bot', escalated.events);
                            return;
                        }
                    }
                } else {
                    fallbackStreak = 0;
                }

                addMessage(response.text, 'bot', response.events);
            } catch (err) {
                removeTypingIndicator();
                addMessage("Sorry, something went wrong. Please try again.", 'bot');
            }
        }, 800 + Math.random() * 400);
    }

    function initChat() {
        if (chatInitialized) return;
        chatInitialized = true;

        var toggle = document.getElementById('chat-toggle');
        var chatWindow = document.getElementById('chat-window');
        var closeBtn = document.getElementById('chat-close');
        var sendBtn = document.getElementById('chat-send');
        var input = document.getElementById('chat-input');

        if (!toggle || !chatWindow) return;

        var hasGreeted = false;

        toggle.addEventListener('click', function () {
            chatWindow.classList.toggle('open');
            if (!hasGreeted && chatWindow.classList.contains('open')) {
                hasGreeted = true;
                loadHistory();
                if (input) input.focus();
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

        window.addEventListener('openEventDetail', function (e) {
            var eventId = e.detail && e.detail.eventId;
            if (eventId) {
                var path = window.location.pathname;
                var base = '';
                if (path.indexOf('/pages/') !== -1) {
                    base = 'event-detail.html';
                } else {
                    base = 'pages/event-detail.html';
                }
                window.location.href = base + '?event=' + eventId;
            }
        });
    }

    window.initChat = initChat;
})();
