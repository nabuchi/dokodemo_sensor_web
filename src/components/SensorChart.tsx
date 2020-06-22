import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios';
import moment from 'moment';


const SensorChart: React.FunctionComponent = () => {
  const [airPressures, setAirPressures] = useState([])
  const [temperatures, setTemperatures] = useState([])
  const [humidities, setHumidities] = useState([])

  useEffect(
    () => {
      axios.get(`/.netlify/functions/get_data`).then((res) => {
        setAirPressures(res.data.map(r => [moment(r.time).valueOf(), r.airPressure]))
        setTemperatures(res.data.map(r => [moment(r.time).valueOf(), r.temperature]))
        setHumidities(res.data.map(r => [moment(r.time).valueOf(), r.humidity]))
      })
    },
    []
  )

  const options = {
    time: {
      useUTC: false,
    },
    title: {
      text: '気象'
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date'
      },
      tickInterval: 1 * 3600 * 1000,
      dateTimeLabelFormats: {
        day: '%m/%e',
        hour: '%H:%M'
      },
      plotLines: [
        {
          value: moment().startOf('day').set({ h: 12 }),
          width: 1,
          dashStyle: 'dash'
        },
        {
          value: moment().startOf('day'),
          width: 2,
          dashStyle: 'dash'
        },
        {
          value: moment().add(-1, 'day').startOf('day').set({ h: 12 }),
          width: 1,
          dashStyle: 'dash'
        },
        {
          value: moment().add(-1, 'day').startOf('day'),
          width: 2,
          dashStyle: 'dash'
        },
        {
          value: moment().add(-2, 'day').startOf('day').set({ h: 12 }),
          width: 2,
          dashStyle: 'dash'
        }
      ],
    },
    yAxis: [
      {
        title: {
          text: '気圧'
        },
        opposite: true
      },
      {
        title: {
          text: '温度'
        },
        opposite: true
      },
      {
        title: {
          text: '湿度'
        },
        opposite: false
      }
    ],
    rangeSelector: {
      enabled: false
    },
    legend: {
      enabled: true,
      verticalAlign: 'top'
    },
    credits: {
      enabled: false
    },
    navigator: {
      enabled: false
    },
    scrollbar: {
      enabled: false
    },
    series: [
      {
        name: "気圧",
        color: '#8bbc21',
        data: airPressures,
        tooltip: {
          valueDecimals: 1,
          pointFormat: '{series.name}: {point.y:,.1f} hPa'
        },
        yAxis: 0
      },
      {
        name: "温度",
        data: temperatures,
        color: '#c42525',
        tooltip: {
          valueDecimals: 1,
          pointFormat: '{series.name}: {point.y:,.1f} ℃'
        },
        yAxis: 1
      },
      {
        name: "湿度",
        color: "#1aadce",
        data: humidities,
        tooltip: {
          valueDecimals: 1,
          pointFormat: '{series.name}: {point.y:,.1f} %'
        },
        yAxis: 2
      }
    ]
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