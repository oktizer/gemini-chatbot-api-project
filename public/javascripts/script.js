const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const sendButton = form.querySelector('button');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Disable the form to prevent multiple submissions while waiting for a response
  input.disabled = true;
  sendButton.disabled = true;

  // Add a temporary "thinking" message for better UX
  const thinkingMessage = appendMessage('bot', 'Gemini is thinking...');

  try {
    // This is the fetch call to your backend API
    const response = await fetch('/gemini/api-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    // Remove the "thinking..." message once we get a response
    thinkingMessage.remove();

    if (!response.ok) {
      // Handle server-side errors (e.g., status 400, 500)
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown server error occurred.');
    }

    const data = await response.json();
    const botReply = data.reply;

    appendMessage('bot', botReply);

  } catch (error) {
    // Handle network errors or errors thrown from the try block
    console.error('Fetch Error:', error);
    // Ensure the "thinking" message is removed on error as well
    if (document.body.contains(thinkingMessage)) {
      thinkingMessage.remove();
    }
    appendMessage('bot', `Sorry, an error occurred: ${error.message}`);
  } finally {
    // Re-enable the form in all cases (success or failure)
    input.disabled = false;
    sendButton.disabled = false;
    input.focus(); // Put the cursor back in the input field
  }
});

function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);

  // Using innerText will correctly render newlines from the AI's response
  msgDiv.innerText = text;

  chatBox.appendChild(msgDiv);
  // Automatically scroll to the latest message
  chatBox.scrollTop = chatBox.scrollHeight;

  // Return the message element so we can reference it later (e.g., to remove it)
  return msgDiv;
}
