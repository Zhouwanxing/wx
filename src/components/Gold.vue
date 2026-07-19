<template>
    <div class="gold-page">
        <div class="gold-toolbar">
            <PageBack/>
            <button type="button" class="switch-btn" @click="showChange">
                {{ showAll ? '切换：显示全部' : '切换：精简模式' }}
            </button>
        </div>
        <div id="container" class="chart-box"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import Http from "../js/Http.js";
import PageBack from "./common/PageBack.vue";

export default {
    name: "Gold",
    components: { PageBack },
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
        handleList: function (list) {
            if (!list || list.length === 0) {
                return [];
            }
            if (list.length < 20) {
                return list;
            }
            let length = list.length, a = Math.floor(length / 20);
            let newList = [];
            for (let i = 0; i < length; i++) {
                if (i % a === 0) {
                    newList.push(list[i]);
                }
            }
            return newList;
        },
        initPage() {
            const self = this, myChart = echarts.init(document.getElementById('container'));
            Http.sendGet("/gold/allGold", function (data) {
                if (data.code !== 200) {
                    return;
                }
                let list = self.handleList(data.data || []);
                let min = self.showAll ? list.reduce((pre, item) => {
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
                    option.yAxis.data.push(item._id);
                    option.series[0].data.push(item.zdf - min);
                    option.series[1].data.push(item.zss - min);
                });
                myChart.setOption(option);
            });
        }
    },
}
</script>

<style scoped>
.gold-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: env(safe-area-inset-top, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
}

.gold-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    flex-shrink: 0;
}

.switch-btn {
    flex: 1;
    min-height: 44px;
}

.chart-box {
    flex: 1;
    min-height: 0;
    height: calc(100dvh - 68px - env(safe-area-inset-top, 0) - env(safe-area-inset-bottom, 0));
    width: 100%;
}
</style>
