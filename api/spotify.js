export default async function handler(req, res) {
    const { code, refresh_token, client_id, client_secret } = req.query

    if (!client_id || !client_secret) {
        return res.status(400).json({
            error: "Missing client_id or client_secret"
        })
    }

    try {
        const basic = Buffer.from(
            `${client_id}:${client_secret}`
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
                    redirect_uri: "https://key-system-jay-devs.vercel.app/callback"
                })
            })

            const data = await tokenRes.json()

            if (!tokenRes.ok) {
                return res.status(400).json(data)
            }

            const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Spotify Tokens</title>
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
    max-width: 500px;
    width: 90%;
}
.box {
    padding: 10px;
    margin: 10px 0;
    border-radius: 8px;
    word-break: break-all;
}
button {
    margin-top: 5px;
}
</style>
</head>
<body>
<div class="container">
<h2>Spotify Authorization Success</h2>

<div class="box" id="refresh">${data.refresh_token}</div>
<button onclick="copy('refresh')">Copy Refresh Token</button>

<div class="box" id="access">${data.access_token}</div>
<button onclick="copy('access')">Copy Access Token</button>

<p>Expires in: ${data.expires_in}s</p>
</div>

<script>
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
