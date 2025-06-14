// DOM Elements
const localVideo = document.getElementById('localVideo');
const giftButton = document.getElementById('giftButton');
const giftDropdown = document.getElementById('giftDropdown');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const collabButton = document.getElementById('collab-button');

let cameraStream; // Store the camera stream globally

// Start the camera feed once and reuse it
async function startCamera() {
    try {
        if (!localVideo) {
            console.error("localVideo element not found!");
            return;
        }
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        localVideo.srcObject = cameraStream;
        localVideo.play();
        console.log("Camera started.");
    } catch (error) {
        console.error("Error accessing webcam:", error);
        alert("Could not access your webcam. Please check browser permissions.");
    }
}

// Call camera function after the page loads
window.addEventListener("DOMContentLoaded", startCamera);

// Ensure chat is fullscreen from the start
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("chat").style.position = "fixed";
    document.getElementById("chat").style.top = "0";
    document.getElementById("chat").style.left = "0";
    document.getElementById("chat").style.width = "100vw";
    document.getElementById("chat").style.height = "100vh";
    document.getElementById("chat").style.zIndex = "999";
    document.getElementById("chat").style.backgroundColor = "black";
    console.log("Chat set to fullscreen automatically.");
});

// Hide other users' messages except previews in the banner
const otherChats = document.querySelectorAll('.other-chat');
otherChats.forEach(chat => {
    chat.style.display = "none";
});

// Toggle dropdown menu
giftButton.addEventListener('click', () => {
    giftDropdown.style.display = (giftDropdown.style.display === 'none' || giftDropdown.style.display === '') ? 'block' : 'none';
});

// WebSocket Setup
const socket = io(); // Connect to the WebSocket server

// Send a chat message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit("chatMessage", message); // Send message to server
        messageInput.value = ""; // Clear input field
    }
}

// Listen for incoming messages
socket.on("chatMessage", (message) => {
    const messageElement = document.createElement("p");
    messageElement.textContent = `User: ${message}`;
    messagesDiv.appendChild(messageElement);
});

// Attach send function to button click
sendMessageButton.addEventListener("click", sendMessage);
