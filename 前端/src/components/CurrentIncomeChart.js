
import React, { useEffect } from 'react';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

export default function CurrentIncomeChart() {
  function initial(dataMap) {
    var myChart = echarts.init(document.getElementById('CurrentIncomeChart_div'));
    myChart.setOption({
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: dataMap.dateArrary,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: '60%',
          data: dataMap.countData
        }
      ]
    });
  }
  useEffect(() => {
    //获取数据
    fetch('./api/get/CurrentIncomeChart/getData', {//访问的域名中含有/api 则会使用代理 
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
      <div id="CurrentIncomeChart_div" style={{ width: 'auto', height: 220 }}></div>
    </div>
  );
}