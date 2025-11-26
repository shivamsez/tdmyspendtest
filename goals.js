document.addEventListener('DOMContentLoaded', () => {
    initChatInterface();
});

function initChatInterface() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const goalsSection = document.getElementById('goalsSection');
    const goalsList = document.getElementById('goalsList');
    
    let context = null; // To track conversation state (e.g., 'spending_query', 'trip_planning')

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = text;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addGoalCard(goalName, amount, icon = 'fa-piggy-bank', color = '#008a00') {
        goalsSection.style.display = 'flex'; // Show section if hidden
        
        const html = `
            <div class="transaction-item" style="animation: slideDown 0.3s ease-out;">
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

    function getBotResponse(userText) {
        const lowerText = userText.toLowerCase();
        
        // Logic for handling context from previous turn
        if (context === 'spending_query') {
            if (lowerText.includes('limit') || lowerText.includes('budget')) {
                context = null; // Reset context
                addGoalCard('Entertainment Limit', '$150.00', 'fa-film', '#FF9800');
                return "Done! I've set a $150 monthly limit on Entertainment for you. I'll notify you if you get close to it.";
            }
        } else if (context === 'trip_planning') {
            // Simple extraction for amount (e.g. "2k", "2000", "$2000")
            const amountMatch = lowerText.match(/(\$)?(\d+)(k)?/);
            
            if (amountMatch) {
                let amount = amountMatch[0];
                if (amount.includes('k')) {
                    amount = amount.replace('k', '000').replace('$', '');
                    amount = '$' + parseInt(amount).toLocaleString();
                } else if (!amount.includes('$')) {
                    amount = '$' + parseInt(amount).toLocaleString();
                }
                
                context = null;
                addGoalCard('Trip Fund', amount, 'fa-plane', '#008a00');
                return `Great choice! I've created a goal of ${amount} for your trip. Based on your Money Path, you could reach this in about 4 months.`;
            }
        }

        // New Queries
        if (lowerText.includes('spending most money') || lowerText.includes('top category')) {
            context = 'spending_query';
            return "You are spending the most on Entertainment ($210 this month). Would you like to set a limit on it?";
        } else if (lowerText.includes('vacation') || lowerText.includes('trip')) {
            context = 'trip_planning';
            return "How much are you thinking?";
        } else if (lowerText.includes('goal') || lowerText.includes('save')) {
            // General save query
            return "That's a great initiative! How much would you like to save each month?";
        } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return "Hi there! Ready to check your financial health?";
        } else {
            return "I can help you manage your finances. Try asking 'What am I spending most money on?' or 'I want to save for a trip'.";
        }
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'user');
            chatInput.value = '';
            
            // Simulate typing delay
            setTimeout(() => {
                const response = getBotResponse(text);
                addMessage(response, 'bot');
            }, 800);
        }
    }

    sendBtn.addEventListener('click', handleSend);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
}

// Add keyframes for slide down animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(styleSheet);
