export default async function handler(req, res) {
    try {
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

        const result = data.data[0];

        return res.status(200).json({
            success: true,
            userId,
            imageUrl: result.imageUrl,
            state: result.state
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}
