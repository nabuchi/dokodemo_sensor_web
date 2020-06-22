import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios';
import moment from 'moment';


const SensorChart: React.FunctionComponent = () => {
  const [airPressures, setAirPressures] = useState(0)

  useEffect(
    () => {
      axios.get(`/.netlify/functions/get_data`).then((res) => {
        setAirPressures(res.data.map((r) => {
          const time = moment(r.time)
          return [time.valueOf(), r.airPressure]
        }))
      })
    },
    []
  )

  const options = {
    time: {
      useUTC: false,
    },
    title: {
      text: '気圧'
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date'
      },
      tickInterval: 1 * 3600 * 1000,
    },
    series: [{
      name: "気圧",
      data: airPressures,
      tooltip: {
        valueDecimals: 1,
        pointFormat: '{series.name}: {point.y:,.2f} hPa'
      }
    }]
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType="stockChart"
    />
  )
}

export default SensorChart