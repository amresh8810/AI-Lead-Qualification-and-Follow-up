document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const leadForm = document.getElementById('lead-form');
  const consoleLog = document.getElementById('console-log');
  const steps = document.querySelectorAll('.step');

  // Interactive chatbot questions list
  const botQuestions = [
    "Hi! Welcome to AuraFlow AI. What is your name? 😊",
    "Great! And what is your company's email address?",
    "Perfect. What kind of business workflows or manual work are you looking to automate with AI?",
    "Awesome. We can definitely automate that! Our AI-powered system will capture your info and trigger an instant response simulation in n8n. Submit the lead below to see it in action!"
  ];

  let chatStep = 0;
  let userData = {
    name: '',
    email: '',
    message: ''
  };

  // Add message to chat box
  function addMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', sender);
    bubble.innerText = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Log message to simulator console
  function logConsole(message) {
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.innerHTML = `<span style="color: #6366f1">[${time}]</span> ${message}`;
    consoleLog.appendChild(entry);
    consoleLog.scrollTop = consoleLog.scrollHeight;
  }

  // Start chatbot conversation
  setTimeout(() => {
    addMessage('bot', botQuestions[0]);
  }, 1000);

  // Handle chatbot send
  function handleChatSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    chatInput.value = '';

    // Save inputs step-by-step
    if (chatStep === 0) {
      userData.name = text;
      document.getElementById('form-name').value = text;
      chatStep++;
      setTimeout(() => {
        addMessage('bot', botQuestions[1]);
      }, 1000);
    } else if (chatStep === 1) {
      userData.email = text;
      document.getElementById('form-email').value = text;
      chatStep++;
      setTimeout(() => {
        addMessage('bot', botQuestions[2]);
      }, 1000);
    } else if (chatStep === 2) {
      userData.message = text;
      document.getElementById('form-msg').value = text;
      chatStep++;
      setTimeout(() => {
        addMessage('bot', botQuestions[3]);
      }, 1000);
    }
  }

  chatSendBtn.addEventListener('click', handleChatSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSend();
  });

  // Handle Main Lead Form submission & simulated n8n run
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value || 'Test Lead';
    const email = document.getElementById('form-email').value || 'test@example.com';
    const message = document.getElementById('form-msg').value || 'Please automate my onboarding flow.';

    // Reset timeline classes
    steps.forEach(s => s.classList.remove('active', 'completed'));
    consoleLog.innerHTML = '';

    // Start Simulation Flow
    logConsole('Initiating Lead Capture trigger...');
    
    // Step 1: Webhook Node (Visual + Real Fetch)
    steps[0].classList.add('active');
    logConsole('⚡ Sending webhook payload to n8n cloud instance...');
    
    fetch('https://adsdfgdgtrtr.app.n8n.cloud/webhook/lead-capture', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    })
    .then(() => {
      logConsole('✅ Webhook payload dispatched to n8n Cloud successfully!');
      steps[0].classList.remove('active');
      steps[0].classList.add('completed');
    })
    .catch(err => {
      logConsole('⚠️ Network error: ' + err.message + ' (Falling back to simulated workflow)');
      steps[0].classList.remove('active');
      steps[0].classList.add('completed');
    });

    // Step 2: OpenAI intent analysis
    setTimeout(() => {
      steps[1].classList.add('active');
      logConsole('🧠 Invoking OpenAI intent analysis node...');
      logConsole('OpenAI processing: "Determining Intent & drafting custom follow-up reply..."');
      
      const intentResult = message.toLowerCase().includes('urgent') || message.toLowerCase().includes('now') ? 'HIGH INTENT' : 'MEDIUM INTENT';
      
      setTimeout(() => {
        logConsole(`OpenAI Output: Lead Intent qualified as [${intentResult}].`);
        logConsole('Draft response written successfully.');
        steps[1].classList.remove('active');
        steps[1].classList.add('completed');
      }, 1500);
    }, 2500);

    // Step 3: Google Sheets integration
    setTimeout(() => {
      steps[2].classList.add('active');
      logConsole('💾 Triggering Google Sheets: Append Row node...');
      logConsole(`Google Sheets: Row appended in sheet "Leads" successfully.`);
      steps[2].classList.remove('active');
      steps[2].classList.add('completed');
    }, 5000);

    // Step 4: Gmail dispatch
    setTimeout(() => {
      steps[3].classList.add('active');
      logConsole('✉️ Preparing Gmail client SMTP node...');
      logConsole(`Follow-up email dispatched successfully to: ${email}`);
      logConsole('🎉 AI Automation Workflow completed under 8.5 seconds!');
      steps[3].classList.remove('active');
      steps[3].classList.add('completed');
    }, 6500);
  });
});
