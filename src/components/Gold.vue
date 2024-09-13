<template>
    <div id="container" style="height: 100vh;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
    name: "Gold",
    data() {
        return {};
    },
    mounted() {
        this.initPage();
    },
    methods: {
        initPage() {
            const myChart = echarts.init(document.getElementById('container'));
            this.$http.get(import.meta.env.VITE_BASE_URL + "/allGold").then((response) => {
                let data = response.data || {}, {list = []} = data;
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
                                    return `${params.seriesName}:${params.value}`;
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
                                    return `${params.seriesName}:${params.value}`;
                                },
                                color: '#fff' // 文字颜色
                            }
                        }
                    ]
                };
                list.forEach(item => {
                    option.yAxis.data.push(item.date);
                    option.series[0].data.push(item.zdf || 0);
                    option.series[1].data.push(item.zss || 0);
                });
                myChart.setOption(option);
            });
        }
    },
}
</script>