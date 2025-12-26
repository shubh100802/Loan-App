let fallbackCount = 0;

const MLCChat = (() => {
    // DOM Elements
    const box = () => document.getElementById("mlc-chatbot");
    const messages = () => document.getElementById("mlc-messages");
    const userInput = () => document.getElementById("mlc-user-input");
    const sendBtn = () => document.getElementById("mlc-send-btn");
    const voiceBtn = () => document.getElementById("mlc-voice-btn");
    const typingIndicator = () => document.getElementById("mlc-typing");
    const notificationBadge = () => document.querySelector(".notification-badge");

    // State
    let isListening = false;
    let recognition = null;
    let notificationCount = 0;

    // Initialize speech recognition if available
    const initSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                userInput().value = transcript;
                sendMessage();
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                isListening = false;
                voiceBtn()?.classList?.remove('listening');
            };

            recognition.onend = () => {
                isListening = false;
                voiceBtn()?.classList?.remove('listening');
                userInput().placeholder = "Type your message...";
            };
        }
    };

    // Toggle voice input
    const toggleVoice = () => {
        if (!recognition) {
            initSpeechRecognition();
            if (!recognition) {
                bot("Speech recognition is not supported in your browser.");
                return;
            }
        }

        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
                isListening = true;
                voiceBtn()?.classList?.add('listening');
                userInput().placeholder = "Listening...";
            } catch (e) {
                console.error('Speech recognition error:', e);
            }
        }
    };

    // Show typing indicator
    const showTyping = (show = true) => {
        if (!typingIndicator()) return;

        if (show) {
            typingIndicator().classList.add('active');
            messages().scrollTop = messages().scrollHeight;
        } else {
            typingIndicator().classList.remove('active');
        }
    };

    // Add message to chat
    const addMessage = (text, isUser = false) => {
        if (!messages()) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `mlc-message ${isUser ? 'mlc-user' : 'mlc-bot'}`;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageDiv.innerHTML = `
      <div>${text.replace(/\n/g, '<br>')}</div>
      <span class="message-time">${time}</span>
    `;

        messages().appendChild(messageDiv);
        messages().scrollTop = messages().scrollHeight;
    };

    // Bot response
    const bot = (text) => {
        showTyping();
        setTimeout(() => {
            showTyping(false);
            addMessage(text, false);
            notificationCount++;
            updateNotificationBadge();
        }, 1000 + Math.random() * 1000);
    };

    // User message
    const user = (text) => {
        addMessage(text, true);
        if (userInput()) {
            userInput().value = '';
        }
    };

    // Update notification badge
    const updateNotificationBadge = () => {
        const badge = notificationBadge();
        const chatButton = document.getElementById('mlc-chatbot-btn');
        if (!badge || !chatButton) return;

        if (box()?.classList?.contains('active')) {
            notificationCount = 0;
            badge.style.display = 'none';
            chatButton.classList.remove('has-notification');
        } else if (notificationCount > 0) {
            badge.style.display = 'flex';
            badge.textContent = notificationCount > 9 ? '9+' : notificationCount;
            chatButton.classList.add('has-notification');
        }
    };

    // FAQ responses
    const faq = {
        loan: "You can check your loan status in the 'My Applications' section of your dashboard. If you need further assistance, our support team is available 24/7.",
        emi: "EMI is calculated based on loan amount, tenure, and interest rate. You can use our EMI Calculator tool for accurate estimates. Would you like me to open the EMI Calculator for you?",
        documents: "For loan application, you'll need:\n- Aadhaar Card (Front & Back)\n- PAN Card\n- Last 3 months' Bank Statements\n- Latest Salary Slip\n- Address Proof (if different from Aadhaar)",
        rejected: "Common reasons for loan rejection include:\n- Low credit score\n- Insufficient income\n- High existing debt\n- Incomplete documentation\n- Negative credit history\n\nWould you like to know how to improve your chances of approval?",
        interest: "Our interest rates start from 8.5% p.a. and vary based on:\n- Loan amount\n- Repayment tenure\n- Credit score\n- Employment type\n\nWould you like a personalized rate quote?",
        eligibility: "Basic eligibility criteria:\n- Age: 21 to 60 years\n- Minimum income: ₹15,000/month\n- Minimum work experience: 1 year\n- Credit score: 650+",
        processing: "Loan processing typically takes 24-48 hours after document verification. You'll receive updates via SMS and email at each stage.",
        prepayment: "Yes, you can prepay your loan after 6 EMIs with a nominal prepayment charge of 2% on the principal amount.",
        foreclosure: "Foreclosure is allowed after 6 months with applicable charges. Would you like to know the exact foreclosure amount?",
        hello: "Hello! 👋 I'm your MLC Assistant. How can I help you today?",
        hi: "Hi there! 😊 How can I assist you with your loan today?",
        thanks: "You're welcome! Is there anything else I can help you with?",
        bye: "Thank you for chatting with MLC Assistant! Have a great day! 👋",
        howareyou: "I'm just a bot, but I'm functioning perfectly! How can I assist you today?",
        help: "I can help you with:\n- Loan applications\n- EMI calculations\n- Document requirements\n- Application status\n- Interest rates\n- And more!\n\nWhat would you like to know?",
        contact: "You can reach our customer support at:\n📞 1800-123-4567\n✉️ support@mlc.com\n\nOur support is available 24/7 to assist you!",
        workinghours: "Our customer support is available 24/7. You can also visit any of our branches from 9:30 AM to 6:30 PM, Monday to Saturday.",
        features: "Our loan features include:\n- Quick approval\n- Competitive interest rates\n- Flexible tenure up to 5 years\n- Minimal documentation\n- No hidden charges\n- Online account management",
        charges: "Here are the applicable charges:\n- Processing fee: Up to 2.5% of loan amount\n- Late payment: 2% per month\n- Prepayment: 2% after 6 months\n- Cheque bounce: ₹500 per instance",

        // 👋 Casual / Daily-life
        morning: "Good morning ☀️ Hope you have a great day! How can I help you with My Loan Credit?",
        afternoon: "Good afternoon 😊 How can I assist you today?",
        evening: "Good evening 🌆 Let me know if you need help with loans or EMIs.",
        night: "Good night 🌙 If you need help, I’m always here.",

        whoareyou: "I’m the MLC Assistant 🤖, here to help you with loans, EMIs, and your account.",
        whatcanyoudo: "I can help with loan status, EMI calculation, documents, eligibility, interest rates, and more.",
        bored: "😄 I can’t play games yet, but I can help you save money by managing your loan better!",
        joke: "Why did the loan application feel confident? Because it had good *credit* 😉",
        weather: "I can’t check the weather yet 🌦️, but I can help you check your loan status anytime.",
        time: "⏰ I don’t track time, but our support is available 24/7!",
        ok: "👍 Great! Let me know if you need anything else.",
        cool: "😎 Awesome! Happy to help.",
    };

    // 💰Loan & Finance
    const financeFaq = {
        cibil: "Your CIBIL score is a 3-digit credit score. A score above 700 increases loan approval chances.",
        creditScore: "A good credit score shows responsible repayment behavior and helps you get lower interest rates.",
        latePayment: "Late EMI payments may attract penalties and negatively affect your credit score.",
        emiMissed: "If you miss an EMI, please pay it as soon as possible to avoid extra charges.",
        partPayment: "Yes, part-payment is allowed after 6 EMIs with minimal charges.",
        loanTenure: "Loan tenure can range from 12 to 60 months depending on eligibility.",
        salaryLoan: "Salaried individuals can apply with salary slips and bank statements.",
        businessLoan: "Business loans require income proof, GST returns, or bank statements.",
        multipleLoans: "Having multiple loans may affect eligibility due to higher repayment burden.",
    };

    // Process user message
    const processMessage = (text) => {
        const message = text.toLowerCase().trim();
        let response = "I'm not sure I understand. Could you please rephrase? You can ask me about loans, EMIs, documents, or type 'help' for assistance.";


        // 🔥 FINANCE FIRST (MOST SPECIFIC)
        if (message.includes("cibil") || message.includes("credit score")) {
            response = financeFaq.cibil;
        }
        else if (message.includes("late payment") || message.includes("late emi")) {
            response = financeFaq.latePayment;
        }
        else if (message.includes("missed emi")) {
            response = financeFaq.emiMissed;
        }
        else if (message.includes("part payment") || message.includes("prepayment")) {
            response = financeFaq.partPayment;
        }
        else if (message.includes("tenure")) {
            response = financeFaq.loanTenure;
        }
        else if (message.includes("salary loan")) {
            response = financeFaq.salaryLoan;
        }
        else if (message.includes("business loan")) {
            response = financeFaq.businessLoan;
        }
        else if (message.includes("multiple loan")) {
            response = financeFaq.multipleLoans;
        }

        // Loan related
        else if (message.includes('loan') || message.includes('status')) {
            response = faq.loan;
        }
        else if (message.includes('emi') || message.includes('repayment') || message.includes('installment')) {
            response = faq.emi;
        }
        else if (message.includes('doc') || message.includes('document') || message.includes('required')) {
            response = faq.documents;
        }
        else if (message.includes('reject') || message.includes('denied') || message.includes('approv')) {
            response = faq.rejected;
        }
        else if (message.includes('interest') || message.includes('rate')) {
            response = faq.interest;
        }
        else if (message.includes('eligib') || message.includes('qualif')) {
            response = faq.eligibility;
        }
        else if (message.includes('process') || message.includes('time') || message.includes('how long')) {
            response = faq.processing;
        }
        else if (message.includes('prepay') || message.includes('close early')) {
            response = faq.prepayment;
        }
        else if (message.includes('foreclos') || message.includes('settle')) {
            response = faq.foreclosure;
        }

        // General conversations
        else if (message.match(/^h(i|ello|ey)$/)) {
            response = faq.hi;
        }
        else if (message.includes('thank')) {
            response = faq.thanks;
        }
        else if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
            response = faq.bye;
        }
        else if (message.includes('how are you') || message.includes("how're you")) {
            response = faq.howareyou;
        }
        else if (message.includes('help') || message === '?') {
            response = faq.help;
        }
        else if (message.includes('contact') || message.includes('support') || message.includes('call')) {
            response = faq.contact;
        }
        else if (message.includes('time') && (message.includes('open') || message.includes('close') || message.includes('hour'))) {
            response = faq.workinghours;
        }
        else if (message.includes('feature') || message.includes('benefit') || message.includes('why choose')) {
            response = faq.features;
        }
        else if (message.includes('charge') || message.includes('fee') || message.includes('cost')) {
            response = faq.charges;
        }
        // Daily-life matching
        else if (message.includes("good morning")) response = faq.morning;
        else if (message.includes("good afternoon")) response = faq.afternoon;
        else if (message.includes("good evening")) response = faq.evening;
        else if (message.includes("good night")) response = faq.night;
        else if (message.includes("who are you")) response = faq.whoareyou;
        else if (message.includes("what can you do")) response = faq.whatcanyoudo;
        else if (message.includes("joke")) response = faq.joke;
        else if (message.includes("bored")) response = faq.bored;

        // Navigation intent
        else if (message.includes("my application"))
            response = faq.loan;

        else if (message.includes("emi calculator"))
            response = faq.emi;

        else if (message.includes("profile"))
            response = faq.profile;

        else if (message.includes("dashboard"))
            response = faq.dashboard;

        const isFallback = response.toLowerCase().includes("not sure");

        if (isFallback) {
            fallbackCount++;

            if (fallbackCount >= 2) {
                const waBtn = document.getElementById("whatsapp-btn");
                if (waBtn) waBtn.style.display = "flex";

                response += "\n\nYou can also chat with our support team if you need further help on WhatsApp. Just click the button.";
            }
        } else {
            fallbackCount = 0;
        }




        // Simulate typing delay
        showTyping();
        setTimeout(() => {
            showTyping(false);
            bot(response);
        }, 1000);
    };

    // Send message
    const sendMessage = () => {
        const input = userInput();
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        user(message);
        processMessage(message);
    };

    // Toggle chat window
    const toggle = () => {
        const chatWindow = box();
        const chatButton = document.getElementById('mlc-chatbot-btn');

        if (!chatWindow || !chatButton) {
            console.error('Chat elements not found!');
            return;
        }

        chatWindow.classList.toggle('active');
        chatButton.classList.toggle('active');

        if (chatWindow.classList.contains('active')) {
            notificationCount = 0;
            updateNotificationBadge();
            // Focus the input when chat is opened
            setTimeout(() => {
                const input = userInput();
                if (input) input.focus();
            }, 100);
        }
    };

    // Close chat
    const close = () => {
        const chatWindow = box();
        const chatButton = document.getElementById('mlc-chatbot-btn');

        if (chatWindow) chatWindow.classList.remove('active');
        if (chatButton) chatButton.classList.remove('active');
    };

    // Initialize chat
    const init = () => {
        console.log('Initializing chat...');

        // Add event listeners
        const chatButton = document.getElementById('mlc-chatbot-btn');
        if (chatButton) {
            chatButton.addEventListener('click', toggle);
            console.log('Chat button event listener added');
        } else {
            console.error('Chat button not found!');
        }

        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = e.currentTarget.getAttribute('data-action');
                if (action) {
                    user(e.currentTarget.textContent.trim());
                    processMessage(action);
                }
            });
        });

        // Close button
        const closeBtn = document.getElementById('mlc-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                close();
            });
        }

        // Minimize button
        const minimizeBtn = document.getElementById('mlc-minimize-btn');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggle();
            });
        }

        // WhatsApp button
        const whatsappBtn = document.getElementById('whatsapp-btn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const phone = "9818020320";
                const msg = "Hi, I need help regarding My Loan Credit.";
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
            });
        }

        // Send button
        const sendButton = sendBtn();
        if (sendButton) {
            sendButton.addEventListener('click', sendMessage);
        }

        // Input field
        const input = userInput();
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }

        // Voice button
        const vBtn = voiceBtn();
        if (vBtn) {
            vBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleVoice();
            });
        }

        // Initialize with welcome message
        setTimeout(() => {
            if (messages() && !messages().innerHTML.trim()) {
                bot("Hello! 👋 I'm your MLC Assistant. How can I help you today?");
            }
        }, 1000);
    };

    // Public API
    return {
        init,
        toggle,
        close,
        ask: (type) => {
            user(type);
            processMessage(type);
        },
        whatsapp: () => {
            const phone = "9818020320";
            const msg = "Hi, I need help regarding My Loan Credit.";
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
        },
        toggleVoice,
        sendMessage
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing chat...');
    MLCChat.init();
});

// Fallback in case DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM already loaded, initializing chat...');
    MLCChat.init();
}


const suggestionsBox = () => document.getElementById("mlc-suggestions");

const suggestionMap = {
    loan: ["Loan Status", "Business Loan", "Salary Loan"],
    emi: ["EMI Calculator", "Missed EMI", "Late Payment"],
    credit: ["CIBIL Score", "Improve Credit Score"],
    document: ["Required Documents"],
};

const showSuggestions = (text) => {
    const box = suggestionsBox();
    if (!box) return;

    box.innerHTML = "";
    const key = Object.keys(suggestionMap).find(k => text.includes(k));
    if (!key) return;

    suggestionMap[key].forEach(item => {
        const btn = document.createElement("button");
        btn.innerText = item;
        btn.onclick = () => {
            user(item);
            processMessage(item.toLowerCase());
            box.innerHTML = "";
        };
        box.appendChild(btn);
    });
};
