export default async function handler(req, res) {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        const { user } = req.query;

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Missing user parameter"
            });
        }

        const url = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(user)}&limit=10`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error: data
            });
        }

        const users = data.data.map(u => ({
            id: u.id,
            name: u.name,
            displayName: u.displayName,
            hasVerifiedBadge: u.hasVerifiedBadge
        }));

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}
