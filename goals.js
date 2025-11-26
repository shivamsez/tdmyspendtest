document.addEventListener('DOMContentLoaded', () => {
    initChatInterface();
    injectStyles();
});

// Configuration
const SYSTEM_PROMPT = `You are a helpful and friendly financial assistant for TD Bank.
Your goal is to help users manage their finances and set goals.

If the user wants to set a financial goal, you MUST include a special JSON block at the end of your response (and nowhere else). 
The format is:
|||GOAL_JSON
{
  "name": "Goal Name",
  "amount": "$1,000",
  "icon": "fa-piggy-bank",
  "color": "#008a00"
}
|||

Common icons to use: 
- fa-car (for vehicles)
- fa-house (for home)
- fa-plane (for travel)
- fa-piggy-bank (general savings)
- fa-graduation-cap (education)
- fa-ring (wedding)
- fa-laptop (electronics)
- fa-shirt (clothing)

Colors: 
- #008a00 (TD Green - default)
- #FF9800 (Orange - dining/fun)
- #2196F3 (Blue - travel/tech)
- #9C27B0 (Purple - long term)
- #F44336 (Red - debt)

Keep your textual response concise, encouraging, and friendly. Do not mention the JSON in your text.
If you are asked about things outside of finance, try to bring it back to financial goals if possible, or just answer helpfully.
`;

function initChatInterface() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const goalsSection = document.getElementById('goalsSection');
    const goalsList = document.getElementById('goalsList');
    
    // Gemini uses 'user' and 'model' roles
    let conversationHistory = [];

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = text; // Safe text content
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addGoalCard(goalName, amount, icon = 'fa-piggy-bank', color = '#008a00') {
        goalsSection.style.display = 'flex'; // Show section if hidden
        
        const html = `
            <div class="transaction-item" style="animation: slideDown 0.5s ease-out;">
                <div class="t-left">
                    <div class="t-icon" style="background-color: ${color}20; color: ${color}">
                        <i class="fa-solid ${icon}"></i>
                    </div>
                    <div class="t-info">
                        <h4>${goalName}</h4>
                        <p>Target: ${amount}</p>
                    </div>
                </div>
                <div class="t-amount positive">
                    Active
                </div>
            </div>
        `;
        
        goalsList.insertAdjacentHTML('afterbegin', html);
    }

    function showTyping() {
        const id = 'typing-' + Date.now();
        const html = `
            <div class="message bot-message" id="${id}">
                <div class="message-content typing-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `;
        chatMessages.insertAdjacentHTML('beforeend', html);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    async function getAIResponse(userText) {
        // Check for API Key in CONFIG or localStorage override
        const apiKey = (typeof CONFIG !== 'undefined' ? CONFIG.GOOGLE_API_KEY : '') || localStorage.getItem('google_api_key');

        // If no key, use Smart Mock
        if (!apiKey) {
            return await getMockResponse(userText);
        }

        // Call Google Gemini API
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        ...conversationHistory,
                        { role: 'user', parts: [{ text: userText }] }
                    ],
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }]
                    },
                    generationConfig: {
                        temperature: 0.7
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API Request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
                const botContent = data.candidates[0].content.parts[0].text;
                return botContent;
            } else {
                throw new Error('Invalid API response structure');
            }
            
        } catch (error) {
            console.error('AI Error:', error);
            return "I'm having trouble connecting to my brain right now. (Fallback: " + getMockResponseSync(userText) + ")";
        }
    }

    // Synchronous mock for fallbacks
    function getMockResponseSync(text) {
        const lower = text.toLowerCase();
        if (lower.includes('trip') || lower.includes('vacation')) return "That sounds exciting! Where are you planning to go?";
        return "I can help you set financial goals. Try saying 'I want to save for a car'.";
    }

    // Async Mock with delay
    async function getMockResponse(userText) {
        await new Promise(r => setTimeout(r, 1000)); // Simulate thinking
        
        const lowerText = userText.toLowerCase();
        
        // Extended Mock Logic
        if (lowerText.includes('spending') && lowerText.includes('most')) {
             return "You are spending the most on Entertainment ($210 this month). Would you like to set a limit on it?";
        }
        if (lowerText.includes('limit') || (lowerText.includes('budget') && lowerText.includes('entertainment'))) {
            addGoalCard('Entertainment Limit', '$150.00', 'fa-film', '#FF9800');
            return "Done! I've set a $150 monthly limit on Entertainment for you. I'll notify you if you get close to it.";
        }
        
        // Regex for simple goal setting in mock mode
        const carMatch = lowerText.match(/save \$?([\d,]+) for (a )?car/);
        if (carMatch) {
            addGoalCard('New Car Fund', '$' + carMatch[1], 'fa-car', '#008a00');
            return `Great goal! I've set up a target of $${carMatch[1]} for your new car.`;
        }

        const tripMatch = lowerText.match(/trip to (\w+)/);
        if (tripMatch) {
            return `A trip to ${tripMatch[1]} sounds amazing! How much do you need to save?`;
        }
        
        if (lowerText.match(/\$?(\d+)(k)?/)) {
             const amount = lowerText.match(/\$?(\d+)(k)?/)[0];
             addGoalCard('Savings Goal', amount, 'fa-piggy-bank', '#2196F3');
             return `I've created a savings goal of ${amount}. You can do this!`;
        }

        return "I'm currently in Demo Mode. Please check config.js for the API Key.";
    }

    async function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        // User Message
        addMessage(text, 'user');
        chatInput.value = '';
        
        // Typing Indicator
        const typingId = showTyping();

        // Get Response
        const rawResponse = await getAIResponse(text);
        
        // Update History BEFORE processing (to keep context clean)
        conversationHistory.push({ role: 'user', parts: [{ text: text }] });
        conversationHistory.push({ role: 'model', parts: [{ text: rawResponse }] });

        removeTyping(typingId);

        // Process Response (Check for Goal JSON)
        let displayMessage = rawResponse;
        const jsonMatch = rawResponse.match(/\|\|\|GOAL_JSON\n([\s\S]*?)\n\|\|\|/);
        
        if (jsonMatch) {
            try {
                const goalData = JSON.parse(jsonMatch[1]);
                addGoalCard(goalData.name, goalData.amount, goalData.icon, goalData.color);
                // Remove the JSON block from the displayed message
                displayMessage = rawResponse.replace(jsonMatch[0], '').trim();
            } catch (e) {
                console.error("Failed to parse goal JSON", e);
            }
        }

        addMessage(displayMessage, 'bot');
    }

    sendBtn.addEventListener('click', handleSend);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
}

function injectStyles() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 12px 16px;
        align-items: center;
        height: 44px;
    }
    
    .dot {
        width: 6px;
        height: 6px;
        background: #888;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;
    }
    
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }
    `;
    document.head.appendChild(styleSheet);
}
