
import React, { useEffect } from 'react';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import Title from './Title';

export default function GoodsInfoChart() {
    function initial(dataMap) {
        var myChart = echarts.init(document.getElementById('GoodsInfoChart_div'));
        for (var i = 0; i < dataMap.goodsArrary.length; i++) {
            dataMap.goodsArrary[i]['type'] = 'line';
            dataMap.goodsArrary[i]['smooth'] = true
        }
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
                data: dataMap.dateArrary
            },
            yAxis: {
                type: 'value'
            },
            series: dataMap.goodsArrary
        });
    }
    useEffect(() => {
        fetch('./api/get/goodInfo/getChart', {
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
            <Title>销售情况</Title>
            <div id="GoodsInfoChart_div" style={{ width: 'auto', height: 400 }}></div>
        </div>
    );
}