export default function handler(req, res) {
    const redirect = "https://spotify-sync-lyrics.vercel.app/sync"

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Spotify Setup</title>

<style>
:root {
    --bg: #0f0f0f;
    --card: #181818;
    --text: #ffffff;
    --muted: #b3b3b3;
    --accent: #1db954;
    --border: #2a2a2a;
}

@media (prefers-color-scheme: light) {
    :root {
        --bg: #f5f5f5;
        --card: #ffffff;
        --text: #111;
        --muted: #666;
        --border: #ddd;
    }
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: system-ui, -apple-system;
    background: var(--bg);
    color: var(--text);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

.container {
    width: 100%;
    max-width: 520px;
}

.card {
    background: var(--card);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    border: 1px solid var(--border);
}

h2 {
    margin-top: 0;
    margin-bottom: 20px;
}

label {
    font-size: 13px;
    color: var(--muted);
}

input {
    width: 100%;
    padding: 12px;
    margin-top: 6px;
    margin-bottom: 16px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text);
    outline: none;
    transition: 0.2s;
}

input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(29,185,84,0.2);
}

button {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    border: none;
    background: var(--accent);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
}

button:hover {
    opacity: 0.9;
}

button:active {
    transform: scale(0.98);
}

.section {
    margin-top: 20px;
}

.box {
    background: rgba(0,0,0,0.25);
    border: 1px solid var(--border);
    padding: 12px;
    border-radius: 10px;
    font-size: 13px;
    word-break: break-all;
    margin-top: 6px;
}

.copy-btn {
    margin-top: 8px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
}

.copy-btn:hover {
    border-color: var(--accent);
}

.success {
    color: var(--accent);
    font-size: 12px;
    margin-top: 4px;
}

.hidden {
    display: none;
}
</style>
</head>

<body>

<div class="container">
<div class="card">

<h2>Spotify Sync Setup</h2>

<label>Client ID</label>
<input id="id" placeholder="Enter your client_id">

<label>Client Secret</label>
<input id="secret" placeholder="Enter your client_secret">

<button onclick="generate()">Generate Links</button>

<div id="output" class="hidden">

<div class="section">
<label>Redirect URI (add this to Spotify)</label>
<div class="box" id="redirect">${redirect}</div>
<button class="copy-btn" onclick="copy('redirect', this)">Copy</button>
<div class="success hidden">✔ Copied</div>
</div>

<div class="section">
<label>Authorization URL</label>
<div class="box" id="auth"></div>
<button class="copy-btn" onclick="copy('auth', this)">Copy</button>
<div class="success hidden">✔ Copied</div>
</div>

<div class="section">
<label>Refresh URL</label>
<div class="box" id="refresh"></div>
<button class="copy-btn" onclick="copy('refresh', this)">Copy</button>
<div class="success hidden">✔ Copied</div>
</div>

</div>

</div>
</div>

<script>
function generate(){
    const id = document.getElementById("id").value.trim()
    const secret = document.getElementById("secret").value.trim()

    if(!id || !secret){
        alert("Fill both fields")
        return
    }

    const state = btoa(id + ":" + secret)
    const redirect = "${redirect}"

    const auth = "https://accounts.spotify.com/authorize"
        + "?client_id=" + encodeURIComponent(id)
        + "&response_type=code"
        + "&redirect_uri=" + encodeURIComponent(redirect)
        + "&scope=user-read-currently-playing"
        + "&state=" + state

    const refresh = redirect
        + "?refresh_token=YOUR_REFRESH_TOKEN"
        + "&state=" + state

    document.getElementById("auth").innerText = auth
    document.getElementById("refresh").innerText = refresh

    document.getElementById("output").classList.remove("hidden")
}

function copy(id, btn){
    const text = document.getElementById(id).innerText
    navigator.clipboard.writeText(text)

    const success = btn.nextElementSibling
    success.classList.remove("hidden")

    setTimeout(() => {
        success.classList.add("hidden")
    }, 1500)
}
</script>

</body>
</html>
    `

    res.setHeader("Content-Type", "text/html")
    return res.status(200).send(html)
}
