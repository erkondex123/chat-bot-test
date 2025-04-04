document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const newChatBtn = document.getElementById("new-chat-btn");
    const chatList = document.getElementById("chat-list");
    const chatBox = document.getElementById("chat-box");
    const chatTitle = document.getElementById("current-chat-name");

    let chats = JSON.parse(localStorage.getItem("chats")) || [{ id: 1, name: "Чат 1", messages: [] }];
    let currentChatId = chats[0].id;

    // 🔹 Функция обновления списка чатов
    function updateChatList() {
        chatList.innerHTML = "";
        chats.forEach(chat => {
            let chatButton = document.createElement("button");
            chatButton.textContent = chat.name;
            chatButton.classList.add("chat-btn");
            chatButton.onclick = () => switchChat(chat.id);
            chatList.appendChild(chatButton);
        });
    }

    // 🔹 Переключение между чатами
    function switchChat(chatId) {
        currentChatId = chatId;
        chatTitle.textContent = chats.find(c => c.id === chatId).name;
        renderMessages();
    }

    // 🔹 Создание нового чата
    function createNewChat() {
        let newChatId = chats.length + 1;
        let newChat = { id: newChatId, name: `Чат ${newChatId}`, messages: [] };
        chats.push(newChat);
        saveChats();
        updateChatList();
        switchChat(newChatId);
    }

    // 🔹 Отображение сообщений текущего чата
    function renderMessages() {
        chatBox.innerHTML = "";
        let chat = chats.find(c => c.id === currentChatId);
        chat.messages.forEach(msg => {
            let messageDiv = document.createElement("div");
            messageDiv.classList.add(msg.sender === "user" ? "user-message" : "bot-message");
            messageDiv.textContent = msg.text;
            chatBox.appendChild(messageDiv);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // 🔹 Отправка сообщений
    function sendMessage() {
        let text = input.value.trim();
        if (text === "") return;

        let chat = chats.find(c => c.id === currentChatId);
        chat.messages.push({ sender: "user", text: text });
        chat.messages.push({ sender: "bot", text: "Я пока не знаю ответа, но скоро найду его!" });

        input.value = "";
        saveChats();
        renderMessages();
    }

    // 🔹 Сохранение чатов в localStorage
    function saveChats() {
        localStorage.setItem("chats", JSON.stringify(chats));
    }

    // 🔹 Инициализация
    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });
    newChatBtn.addEventListener("click", createNewChat);

    updateChatList();
    switchChat(currentChatId);
});
