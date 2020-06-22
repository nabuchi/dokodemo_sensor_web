import axios from 'axios';
import moment from 'moment-timezone';
process.env.NODE_ENV

exports.handler = async (event, context) => {
  const from = moment.utc().add(-2, "day").format("YYYY-MM-DD HH:mm:ss")
  const to = moment.utc().format("YYYY-MM-DD HH:mm:ss")
  const token = process.env.DOKODEMO_API_TOKEN
  const res = await axios.get(`https://svcipp.planex.co.jp/api/get_data.php`, {
    params: {
      type: "WS-USB01-THP",
      mac: "247260315816",
      from: from,
      to: to,
      token: token
    }
  })
  const records = res.data.map(r => {
    const time = moment.utc(r[0], "YYYY-MM-DD HH:mm:ss")
    return {
      time: time.tz('Asia/Tokyo').format(),
      temperature: Number(r[1]),
      humidity: Number(r[2]),
      airPressure: Number(r[3])
    }
  })

  return {
    statusCode: 200,
    body: JSON.stringify(records)
  }
};
