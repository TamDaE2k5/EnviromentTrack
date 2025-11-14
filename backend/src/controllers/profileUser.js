import { createClient } from '@clickhouse/client'
const client = new createClient(
    {
        url: 'http://localhost:8123',
        username: 'default',
        password: process.env.PASS_CLICK_HOUSE,
    }
)

export const profile = async (req, res) => {
  try {
    const nickName = req.user.nickName;

    const result = await client.query({
      query: `
        SELECT nickName, email 
        FROM enviTrack.users
        WHERE nickName = {nickName:String}
      `,
      query_params: { nickName },
      format: 'JSONEachRow'
    });

    const userData = await result.json(); // ← Lấy data thật

    if (!userData.length) {
      return res.status(404).json({ mess: "User not found" });
    }

    return res.status(200).json({ user: userData[0] });

  } catch (error) {
    console.error("Server error", error);
    return res.status(500).json({ mess: "Server error" });
  }
};