
import React, { useEffect } from 'react';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';
import Title from './Title';

export default function InventoryInfoChart() {
    function initial(dataMap) {
        var myChart = echarts.init(document.getElementById('InventoryInfoChart_div'));
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['增加', '出库', '入库']
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
                    axisTick: {
                        show: false
                    },
                    data: dataMap.dateArrary
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '增加',
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'inside'
                    },
                    data: dataMap.incData
                },
                {
                    name: '入库',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true
                    },
                    data: dataMap.in
                },
                {
                    name: '出库',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'left'
                    },
                    data: dataMap.out
                }
            ]
        });
    }
    useEffect(() => {
        fetch('./api/get/Inventory/getChart', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            mode: 'cors',
            cache: 'no-store'
        }).then(response => response.json())
            .then(data => initial(data))
            .catch(err => console.log(err))
    }, [])

    return (
        <div>
            <Title>统计数据</Title>
            <div id="InventoryInfoChart_div" style={{ width: 'auto', height: 600 }}></div>
        </div>
    );
}