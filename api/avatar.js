export default async function handler(req, res) {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "Missing userId parameter"
            });
        }

        const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${encodeURIComponent(userId)}&size=420x420&format=Png`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error: data
            });
        }

        if (!data?.data || data.data.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No avatar found"
            });
        }

        const imageUrl = data.data[0].imageUrl;

        if (!imageUrl) {
            return res.status(404).json({
                success: false,
                error: "Image not ready"
            });
        }

        const imageRes = await fetch(imageUrl);

        if (!imageRes.ok) {
            return res.status(502).json({
                success: false,
                error: "Failed to fetch image"
            });
        }

        res.setHeader("Content-Type", imageRes.headers.get("content-type") || "image/png");
        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");

        const buffer = await imageRes.arrayBuffer();
        return res.status(200).send(Buffer.from(buffer));

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}
