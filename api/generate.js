export default function handler(req, res) {
    const redirect = "https://spotify-sync-lyrics.vercel.app/sync"

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Spotify Setup</title>
<style>
:root { color-scheme: light dark; }
body {
    font-family: system-ui;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.container {
    width: 90%;
    max-width: 600px;
}
input {
    width: 100%;
    padding: 10px;
    margin: 8px 0;
}
.box {
    padding: 10px;
    margin: 10px 0;
    border-radius: 8px;
    word-break: break-all;
}
button {
    padding: 10px;
    margin-top: 5px;
    width: 100%;
}
</style>
</head>
<body>
<div class="container">

<h2>Spotify Sync Setup</h2>

<h4>Client ID</h4>
<input id="id" placeholder="Enter your client_id">

<h4>Client Secret</h4>
<input id="secret" placeholder="Enter your client_secret">

<button onclick="generate()">Generate Links</button>

<div id="output" style="display:none;">

<h4>Redirect URI (put in Spotify app)</h4>
<div class="box" id="redirect">${redirect}</div>
<button onclick="copy('redirect')">Copy</button>

<h4>Authorization URL</h4>
<div class="box" id="auth"></div>
<button onclick="copy('auth')">Copy</button>

<h4>Refresh URL (after getting refresh_token)</h4>
<div class="box" id="refresh"></div>
<button onclick="copy('refresh')">Copy</button>

</div>

</div>

<script>
function generate(){
    const id = document.getElementById("id").value.trim()
    const secret = document.getElementById("secret").value.trim()

    if(!id || !secret){
        alert("Please fill both fields")
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

    document.getElementById("output").style.display = "block"
}

function copy(id){
    navigator.clipboard.writeText(document.getElementById(id).innerText)
}
</script>

</body>
</html>
    `

    res.setHeader("Content-Type", "text/html")
    return res.status(200).send(html)
}
