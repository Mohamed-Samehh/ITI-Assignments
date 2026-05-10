const messagesEl = document.getElementById("messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const resetBtn = document.getElementById("reset-btn");

const traceEmpty = document.getElementById("trace-empty");
const traceBody = document.getElementById("trace-body");
const traceRoute = document.getElementById("trace-route");
const traceClassification = document.getElementById("trace-classification");
const traceRelevance = document.getElementById("trace-relevance");
const traceDocs = document.getElementById("trace-docs");

let isLoading = false;

const ROUTE_LABELS = {
    rag_hit: "Answered from KB",
    rag_miss: "I don't know (in scope, not in KB)",
    out_of_scope: "Out of scope — introduced",
    error: "Error",
};

function autoResize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 140) + "px";
}

input.addEventListener("input", autoResize);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
    }
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";
    autoResize();

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
        });

        removeTyping();

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            addMessage("bot", err.error || "Something went wrong.");
            return;
        }

        const data = await res.json();
        const role = data.route === "rag_miss" ? "idk" : "bot";
        addMessage(role, data.answer || "(empty response)");
        updateTrace(data);
    } catch (err) {
        removeTyping();
        addMessage("bot", "Connection error. Please try again.");
    } finally {
        isLoading = false;
        sendBtn.disabled = false;
        input.focus();
    }
});

resetBtn.addEventListener("click", () => {
    messagesEl.innerHTML = "";
    addMessage(
        "bot",
        "Conversation cleared. Ask me anything about Machine Learning & AI."
    );
    traceEmpty.hidden = false;
    traceBody.hidden = true;
    input.focus();
});

function addMessage(role, content) {
    const div = document.createElement("div");
    div.className = `message ${role}`;

    const avatar = role === "user" ? "🧑" : "🧠";
    div.innerHTML = `
        <div class="avatar">${avatar}</div>
        <div class="bubble">${escapeHtml(content)}</div>
    `;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping() {
    const div = document.createElement("div");
    div.className = "message bot typing";
    div.id = "typing";
    div.innerHTML = `
        <div class="avatar">🧠</div>
        <div class="bubble"><span class="dots"><span>.</span><span>.</span><span>.</span></span></div>
    `;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTyping() {
    const el = document.getElementById("typing");
    if (el) el.remove();
}

function updateTrace(data) {
    traceEmpty.hidden = true;
    traceBody.hidden = false;

    const route = data.route || "—";
    traceRoute.textContent = ROUTE_LABELS[route] || route;
    traceRoute.className = `value route-${route}`;

    traceClassification.textContent = data.classification
        ? data.classification.replace("_", " ")
        : "—";
    traceRelevance.textContent = data.relevance
        ? data.relevance.replace("_", " ")
        : "—";

    traceDocs.innerHTML = "";
    const docs = data.retrieved_docs || [];
    if (docs.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No retrieval was performed.";
        traceDocs.appendChild(li);
    } else {
        docs.forEach((d) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${escapeHtml(d.source)}</strong>${escapeHtml(d.preview)}…`;
            traceDocs.appendChild(li);
        });
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

input.focus();
