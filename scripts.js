document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const newChatBtn = document.getElementById("new-chat-btn");
    const chatList = document.getElementById("chat-list");
    const chatBox = document.getElementById("chat-box");

let chats = [{ id: 1, name: "Чат 1", messages: [] }];
let currentChatId = 1;

// Функция для обновления списка чатов
function updateChatList() {
    let chatListContainer = document.getElementById("chat-list");
    chatListContainer.innerHTML = ""; // Очищаем список перед обновлением

    chats.forEach(chat => {
        let chatButton = document.createElement("button");
        chatButton.textContent = chat.name;
        chatButton.classList.add("chat-btn");
        chatButton.onclick = () => switchChat(chat.id);
        chatListContainer.appendChild(chatButton);
    });
}

// Функция для переключения чата
function switchChat(chatId) {
    currentChatId = chatId;
    document.getElementById("current-chat-name").textContent = chats.find(c => c.id === chatId).name;
    renderMessages();
}

// Функция для создания нового чата
function createNewChat() {
    let newChatId = chats.length + 1;
    let newChat = { id: newChatId, name: `Чат ${newChatId}`, messages: [] };
    chats.push(newChat);
    updateChatList();
    switchChat(newChatId);
}

// Функция для отображения сообщений текущего чата
function renderMessages() {
    let chatWindow = document.getElementById("chat-window");
    chatWindow.innerHTML = "";
    
    let chat = chats.find(c => c.id === currentChatId);
    chat.messages.forEach(msg => {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add(msg.sender === "user" ? "user-message" : "bot-message");
        messageDiv.textContent = msg.text;
        chatWindow.appendChild(messageDiv);
    });
}

// Функция отправки сообщения
function sendMessage() {
    let input = document.getElementById("chat-input");
    let text = input.value.trim();
    if (text === "") return;

    let chat = chats.find(c => c.id === currentChatId);
    chat.messages.push({ sender: "user", text: text });
    chat.messages.push({ sender: "bot", text: "Я пока не знаю ответа, но скоро найду его!" });

    input.value = "";
    renderMessages();
}

// Первичная инициализация
document.getElementById("new-chat-btn").onclick = createNewChat;
document.getElementById("send-btn").onclick = sendMessage;
updateChatList();
switchChat(1);


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
