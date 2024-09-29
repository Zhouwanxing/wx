<template>
    <div style="text-align: center;">
        <button @click="showChange" style="margin-top: 5px;">切换</button>
        <div id="container" style="height: 90vh;"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import Http from "../js/Http.js";

export default {
    name: "Gold",
    data() {
        return {
            showAll: true
        };
    },
    mounted() {
        this.initPage();
    },
    methods: {
        showChange: function () {
            this.showAll = !this.showAll;
            this.initPage();
        },
        initPage() {
            const myChart = echarts.init(document.getElementById('container'));
            Http.sendGet("/allGold", function (data) {
                if (data.error) {
                    return;
                }
                let {list = []} = data;
                let min = this.showAll ? list.reduce((pre, item) => {
                    if (item.zdf > item.zss) {
                        return Math.min(item.zss, pre);
                    } else {
                        return Math.min(item.zdf, pre);
                    }
                }, 10000) : 0;
                let option = {
                    title: {text: '金价'},
                    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
                    legend: {},
                    grid: {left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: {type: 'value', boundaryGap: [0, 0.01]},
                    yAxis: {type: 'category', data: []},
                    series: [
                        {
                            name: '周大福',
                            type: 'bar',
                            data: [],
                            label: {
                                show: true, // 开启显示
                                position: 'inside', // 标签的位置
                                formatter: function (params) {
                                    return `${params.seriesName}:${params.value + min}`;
                                },
                                color: '#fff' // 文字颜色
                            }
                        },
                        {
                            name: '周生生',
                            type: 'bar',
                            data: [],
                            label: {
                                show: true, // 开启显示
                                position: 'inside', // 标签的位置
                                formatter: function (params) {
                                    return `${params.seriesName}:${params.value + min}`;
                                },
                                color: '#fff' // 文字颜色
                            }
                        }
                    ]
                };
                list.forEach(item => {
                    option.yAxis.data.push(item.date);
                    option.series[0].data.push(item.zdf - min);
                    option.series[1].data.push(item.zss - min);
                });
                myChart.setOption(option);
            });
        }
    },
}
</script>