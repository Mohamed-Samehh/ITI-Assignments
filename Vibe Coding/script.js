const messagesEl = document.getElementById('messages');
const textarea = document.getElementById('textarea');
const sendBtn = document.getElementById('send-btn');
const fileInput = document.getElementById('file-input');
const attachBtn = document.getElementById('attach-btn');
const previewWrap = document.getElementById('image-preview-wrap');
const previewImg = document.getElementById('image-preview');
const removeImgBtn = document.getElementById('remove-image');
const apiKeyInput = document.getElementById('api-key-input');
const modeTextBtn = document.getElementById('mode-text');
const modeImageBtn = document.getElementById('mode-image');

let currentMode = 'text';  // 'text' | 'image'

modeTextBtn.addEventListener('click', () => {
    currentMode = 'text';
    modeTextBtn.classList.add('active');
    modeImageBtn.classList.remove('active');
    textarea.placeholder = 'Message…';
});

modeImageBtn.addEventListener('click', () => {
    currentMode = 'image';
    modeImageBtn.classList.add('active');
    modeTextBtn.classList.remove('active');
    textarea.placeholder = 'Describe the image you want…';
});

let history = [];        // [{role, content}] for API
let pendingImageB64 = null;
let pendingImageMime = null;
let isLoading = false;

// Auto-resize textarea
textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px';
});

// Send on Enter (Shift+Enter = newline)
textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
});
sendBtn.addEventListener('click', send);

// Image attach
attachBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const dataURL = e.target.result;
        // Extract base64 and mime
        const [meta, b64] = dataURL.split(',');
        pendingImageMime = meta.match(/:(.*?);/)[1];
        pendingImageB64 = b64;
        previewImg.src = dataURL;
        previewWrap.style.display = 'block';
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
});

removeImgBtn.addEventListener('click', clearImage);

function clearImage() {
    pendingImageB64 = null;
    pendingImageMime = null;
    previewImg.src = '';
    previewWrap.style.display = 'none';
}

// Render helpers
function removeEmptyState() {
    const es = messagesEl.querySelector('.empty-state');
    if (es) es.remove();
}

function appendMessage(role, textContent, imageDataURL = null) {
    removeEmptyState();
    const wrap = document.createElement('div');
    wrap.className = `message ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    if (role === 'user') {
        avatar.innerHTML = '<i class="fa fa-user"></i>';
    } else {
        avatar.innerHTML = '<i class="fa fa-robot"></i>';
    }

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    if (imageDataURL) {
        const img = document.createElement('img');
        img.src = imageDataURL;
        bubble.appendChild(img);
    }

    if (textContent) {
        if (role === 'assistant' && /fa-exclamation-triangle/.test(textContent)) {
            const span = document.createElement('span');
            span.innerHTML = textContent;
            bubble.appendChild(span);
        } else {
            const span = document.createElement('span');
            span.textContent = textContent;
            bubble.appendChild(span);
        }
    }

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return bubble;
}

function appendTyping() {
    removeEmptyState();
    const wrap = document.createElement('div');
    wrap.className = 'message assistant';
    wrap.id = 'typing-indicator';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = '<i class="fa fa-robot"></i>';

    const bubble = document.createElement('div');
    bubble.className = 'bubble typing';
    bubble.innerHTML = '<span></span><span></span><span></span>';

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    scrollToBottom();
}

function removeTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Main send function
async function send() {
    if (isLoading) return;
    const text = textarea.value.trim();
    if (!text && !pendingImageB64) return;

    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) { alert('Please enter your OpenAI API key.'); return; }

    // Build user content for API
    let userContent;
    const imageDataURL = pendingImageB64
        ? `data:${pendingImageMime};base64,${pendingImageB64}` : null;

    if (pendingImageB64) {
        userContent = [
            { type: 'image_url', image_url: { url: imageDataURL } },
            ...(text ? [{ type: 'text', text }] : [])
        ];
    } else {
        userContent = text;
    }

    // Show user message in UI
    appendMessage('user', text || null, imageDataURL);

    // Add to history
    history.push({ role: 'user', content: userContent });

    // Reset input
    textarea.value = '';
    textarea.style.height = 'auto';
    clearImage();
    isLoading = true;
    sendBtn.disabled = true;
    appendTyping();

    try {
        if (currentMode === 'image' && !pendingImageB64) {
            // Image generation branch
            const imgResponse = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-image-1-mini',
                    prompt: text,
                    n: 1,
                    size: '1024x1024'
                })
            });
            const imgData = await imgResponse.json();
            if (!imgResponse.ok) {
                throw new Error(imgData.error?.message || 'Image generation error');
            }
            const generatedURL = `data:image/png;base64,${imgData.data[0].b64_json}`;
            removeTyping();
            appendMessage('assistant', null, generatedURL);
        } else {
            // Chat branch
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: history,
                    max_tokens: 1024
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'API error');
            }

            const reply = data.choices[0].message.content;
            history.push({ role: 'assistant', content: reply });

            removeTyping();
            appendMessage('assistant', reply);
        }

    } catch (err) {
        removeTyping();
        console.error('API error:', err);
        let msg = err.message;
        if (err instanceof TypeError && err.message === 'Failed to fetch') {
            msg = 'Failed to reach OpenAI. Possible causes: no internet connection, a browser extension (e.g. uBlock Origin) is blocking the request, or an invalid API key format.';
        }
        appendMessage('assistant', `<i class="fa fa-exclamation-triangle" style="color:#e53e3e;"></i>&nbsp;Error: ${msg}`);
    } finally {
        isLoading = false;
        sendBtn.disabled = false;
        textarea.focus();
    }
}
