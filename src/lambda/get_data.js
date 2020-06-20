import axios from 'axios';
import moment from 'moment';
process.env.NODE_ENV

exports.handler = async (event, context) => {
  const from = moment().add(-1, "months").format("YYYY-MM-DD HH:mm:ss")
  const to = moment().format("YYYY-MM-DD HH:mm:ss")
  const token = process.env.DOKODEMO_API_TOKEN
  console.log(from)
  console.log(to)
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
    return {
      time: r[0],
      temperature: r[1],
      humidity: r[2],
      airPressure: r[3]
    }
  })

  return {
    statusCode: 200,
    body: JSON.stringify(records)
  }
};
