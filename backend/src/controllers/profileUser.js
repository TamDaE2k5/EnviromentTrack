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
        SELECT nickName, email, city, country
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

export const updateProfile = async (req, res) => {
  try {
    const nickName = req.user.nickName; // lấy từ token
    const { city, country } = req.body;

    if (!city || !country) {
      return res.status(400).json({ mess: "City và Country không được bỏ trống" });
    }

    // Query update
    await client.query({
      query: `
        ALTER TABLE enviTrack.users
        UPDATE city = {city:String}, country = {country:String}
        WHERE nickName = {nickName:String}
      `,
      query_params: {
        city,
        country,
        nickName
      },
    });
    
    return res.status(200).json({
      mess: "Cập nhật thành công",
      updated: { city, country }
    });

  } catch (error) {
    console.error("Update error", error);
    return res.status(500).json({ mess: "Server error" });
  }
};