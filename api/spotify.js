export default async function handler(req, res) {
    const { code, refresh_token, state } = req.query

    let id, secret

    if (state) {
        try {
            const decoded = Buffer.from(state, "base64").toString()
            ;[id, secret] = decoded.split(":")
        } catch {
            return res.status(400).json({
                error: "Invalid state format"
            })
        }
    }

    if (!id || !secret) {
        return res.status(400).json({
            error: "Missing client_id or client_secret"
        })
    }

    try {
        const basic = Buffer.from(
            `${id}:${secret}`
        ).toString("base64")

        if (code) {
            const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${basic}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: "https://spotify-sync-lyrics.vercel.app/sync"
                })
            })

            const data = await tokenRes.json()

            if (!tokenRes.ok) {
                return res.status(400).json(data)
            }

            const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Spotify Tokens</title>
<style>
:root {
    color-scheme: light dark;
    --bg: #ffffff;
    --text: #000000;
    --card: #f4f4f4;
    --border: #dddddd;
}
@media (prefers-color-scheme: dark) {
    :root {
        --bg: #0f0f0f;
        --text: #ffffff;
        --card: #1a1a1a;
        --border: #333333;
    }
}
body {
    margin: 0;
    font-family: system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
.container {
    width: 90%;
    max-width: 600px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
}
h1 {
    margin-top: 0;
    font-size: 20px;
}
.token {
    margin-bottom: 15px;
}
.label {
    font-size: 12px;
    opacity: 0.7;
    margin-bottom: 5px;
}
.value {
    font-size: 12px;
    word-break: break-all;
    background: var(--bg);
    padding: 10px;
    border-radius: 6px;
    border: 1px solid var(--border);
}
button {
    margin-top: 6px;
    padding: 6px 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: var(--text);
    color: var(--bg);
    font-size: 12px;
}
</style>
</head>
<body>
<div class="container">
    <h1>✅ Successfully Authorize</h1>

    <div class="token">
        <div class="label">Access Token (expires in ${data.expires_in}s)</div>
        <div class="value" id="access">${data.access_token}</div>
        <button onclick="copy('access')">Copy</button>
    </div>

    <div class="token">
        <div class="label">Refresh Token</div>
        <div class="value" id="refresh">${data.refresh_token}</div>
        <button onclick="copy('refresh')">Copy</button>
    </div>
</div>

<script>
function copy(id) {
    const text = document.getElementById(id).innerText
    navigator.clipboard.writeText(text)
}
</script>
</body>
</html>`
            res.setHeader("Content-Type", "text/html")
            return res.status(200).send(html)
        }

        if (refresh_token) {
            const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${basic}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refresh_token
                })
            })

            const data = await tokenRes.json()

            if (!tokenRes.ok) {
                return res.status(400).json(data)
            }

            return res.status(200).json({
                access_token: data.access_token,
                expires_in: data.expires_in
            })
        }

        return res.status(400).json({
            error: "Missing code or refresh_token"
        })

    } catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
