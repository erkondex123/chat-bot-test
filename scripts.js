document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const newChatBtn = document.getElementById("new-chat-btn");
    const chatList = document.getElementById("chat-list");
    const chatBox = document.getElementById("chat-box");

    let chats = JSON.parse(localStorage.getItem("chats")) || {};
    let currentChatId = Object.keys(chats)[0] || createFirstChat();

    renderChatHistory();
    loadChat(currentChatId);

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    newChatBtn.addEventListener("click", function () {
        currentChatId = createNewChat();
        loadChat(currentChatId);
        renderChatHistory();
    });

    function sendMessage() {
        const message = input.value.trim();
        if (message === "") return;

        appendMessage("Вы: " + message, "user-message");
        saveMessage(currentChatId, "Вы: " + message);

        input.value = "";

        setTimeout(() => {
            const response = generateBotResponse();
            appendMessage("Бот: " + response, "bot-message");
            saveMessage(currentChatId, "Бот: " + response);
        }, 600);
    }

    function appendMessage(text, className) {
        const msg = document.createElement("div");
        msg.className = "message " + className;
        msg.textContent = text;
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function generateBotResponse() {
        const responses = [
            "Привет! Чем могу помочь?",
            "Интересный вопрос!",
            "Я пока не знаю, но постараюсь выяснить.",
            "Расскажи подробнее.",
            "Как у тебя дела?",
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function saveMessage(chatId, message) {
        if (!chats[chatId]) chats[chatId] = [];
        chats[chatId].push(message);
        localStorage.setItem("chats", JSON.stringify(chats));
    }

    function createFirstChat() {
        chats = { "chat_1": [] }; // Только один чат при запуске
        localStorage.setItem("chats", JSON.stringify(chats));
        return "chat_1";
    }

    function createNewChat() {
        const chatId = "chat_" + (Object.keys(chats).length + 1);
        chats[chatId] = [];
        localStorage.setItem("chats", JSON.stringify(chats));
        return chatId;
    }

    function loadChat(chatId) {
        chatBox.innerHTML = "";
        if (chats[chatId]) {
            chats[chatId].forEach(msg => {
                const className = msg.startsWith("Вы") ? "user-message" : "bot-message";
                appendMessage(msg, className);
            });
        }
    }

    function renderChatHistory() {
        chatList.innerHTML = "";
        Object.keys(chats).forEach(chatId => {
            const li = document.createElement("li");
            li.textContent = "Чат " + chatId.split("_")[1];
            li.addEventListener("click", function () {
                currentChatId = chatId;
                loadChat(currentChatId);
            });
            chatList.appendChild(li);
        });
    }
});
