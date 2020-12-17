
import React, { useEffect } from 'react';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default function GoodsInfoChart() {
  function initial(arraryData) {
    var myChart = echarts.init(document.getElementById('dayIncomeChart_div'));
    myChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        show: true,
        feature: {
          magicType: { show: true, type: ['stack', 'tiled'] },
          saveAsImage: { show: true }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '总销售额',
        type: 'line',
        smooth: true,
        data: arraryData
      },
      ]
    });
  }
  useEffect(() => {
    fetch('./api/get/DayIncomeChart/getData', {//访问的域名中含有/api 则会使用代理 
      method: 'GET',
      credentials: "include",//包含Cookie
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      mode: 'cors',
      cache: 'no-store'
    }).then(response => response.json())//解析为可读数据 从数据中then读取数据
      .then(data => initial(data))//执行结果是 resolve就调用then方法
      .catch(err => console.log(err))//执行结果是 reject就调用catch方法  
  }, [])

  return (
    <div>
      <div id="dayIncomeChart_div" style={{ width: 'auto', height: 220 }}></div>
    </div>
  );
}