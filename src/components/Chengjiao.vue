<template>
    <div class="er-page">
        <div class="header">
            <div class="page-toolbar">
                <PageBack/>
                <span style="font-weight: 600;">成交</span>
            </div>
            <div class="filter-stack">
                <div class="filter-row">
                    <span class="label">价格</span>
                    <input type="number" inputmode="numeric" placeholder="最小" v-model="formData.priceMin">
                    <span>~</span>
                    <input type="number" inputmode="numeric" placeholder="最大" v-model="formData.priceMax">
                </div>
                <div class="filter-row">
                    <span class="label">面积</span>
                    <input type="number" inputmode="decimal" placeholder="最小" v-model="formData.areaMin">
                    <span>~</span>
                    <input type="number" inputmode="decimal" placeholder="最大" v-model="formData.areaMax">
                </div>
            </div>
            <div class="toolbar-scroll">
                <div>
                    <button @click.stop="formData.sortKey = 'price';formData.sortValue = -formData.sortValue;">
                        价格{{ formData.sortKey !== 'price' ? '' : formData.sortValue === 1 ? '⇑' : '⇓' }}
                    </button>
                </div>
                <div>
                    <button @click.stop="formData.sortKey = 'area';formData.sortValue = -formData.sortValue;">
                        面积{{ formData.sortKey !== 'area' ? '' : formData.sortValue === 1 ? '⇑' : '⇓' }}
                    </button>
                </div>
                <div>
                    <button @click.stop="formData.sortKey = 'createTime';formData.sortValue = -formData.sortValue;">
                        时间{{ formData.sortKey !== 'createTime' ? '' : formData.sortValue === 1 ? '⇑' : '⇓' }}
                    </button>
                </div>
                <div>
                    <button @click.stop="formData.showFloor ++;formData.showFloor = formData.showFloor % 4;">
                        {{ ['楼层', '低', '中', '高'][formData.showFloor] }}
                    </button>
                </div>
                <div>
                    <button @click.stop="findAll">查询({{ list.length }})</button>
                </div>
            </div>
        </div>
        <div class="content scrollable-table" style="background-color: white;">
            <div v-for="(item,index) in list" :key="index"
                 style="background-color: #ddd;border-radius: 5px;margin: 5px;padding: 5px;">
                <div>{{ item.title }} <span style="color:blue;">{{ item.price }}万元</span> <span
                    style="color:red;">{{ item.floor }}层</span></div>
                <div><span style="color:red;">{{ item.createTime }}</span> {{ item.sale }} <span
                    style="color:blue;">{{ item.unitPrice }}元/m²</span></div>
                <div v-for="(cItem,cIndex) in areaPlace(item.area)" :key="'c' + cIndex">
                    <span>{{ cItem._id }}</span>
                    <span style="margin-left: 20px;">{{ cItem.closestArea }}</span>
                    <span style="margin-left: 20px;">{{ cItem.diff.toFixed(2) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import PageBack from "./common/PageBack.vue";

export default {
    name: "Chengjiao",
    components: { PageBack },
    data: function () {
        return {
            list: [],
            buildings: [
                {_id: "A11", areas: [117.83, 117.42, 120.07, 119.75]},
                {_id: "A13", areas: [119.53, 117.54, 117.97, 119.5, 118.42, 120.19]},
                {_id: "A8", areas: [89.69, 117.24, 85.98]},
                {_id: "A10", areas: [141.42, 122.81, 141.85, 141.54, 123.11]},
                {_id: "A15", areas: [91.52, 91.85, 113.36, 113.19]},
                {_id: "A16", areas: [91.52, 91.85, 113.36, 113.19]},
                {_id: "A9", areas: [194.29, 159.57]},
                {_id: "A12", areas: [120.05, 118.94, 114.45]},
                {_id: "A7", areas: [112.8, 120.99, 118.22, 113.11, 118.42, 120.87, 113.33, 121.32, 117.98, 120.83]},
                {_id: "A14", areas: [117.99, 119.89]},
                {_id: "A6", areas: [118.83, 121.38]}
            ],
            formData: {
                areaMin: 100,
                areaMax: 130,
                priceMin: 80,
                priceMax: 300,
                sortKey: "createTime",
                sortValue: -1,
                showFloor: 0,
                showLike: 0
            },
            selectId: "",
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.findAll();
        });
    },
    watch: {},
    computed: {},
    methods: {
        findAll: function () {
            const self = this;
            Http.sendPost("/tangyue/getCj", self.formData, function (res) {
                self.list = res.data || [];
            }, 10000);
        },
        areaPlace: function (targetArea) {
            const self = this;
            const matches = [];
            self.buildings.forEach(building => {
                const closest = building.areas.reduce((closestSoFar, area) => {
                    const diff = Math.abs(area - targetArea);
                    return diff < closestSoFar.diff ? {area, diff} : closestSoFar;
                }, {area: null, diff: Infinity});

                if (closest.diff <= 2) {
                    matches.push({
                        _id: building._id,
                        closestArea: closest.area,
                        diff: closest.diff
                    });
                }
            });
            return matches.sort((a, b) => a.diff - b.diff).slice(0, 5);
        }
    },
    filters: {}
}
</script>

<style scoped>
.er-page .header {
    min-height: 200px;
}

.er-page .content {
    top: calc(200px + env(safe-area-inset-top, 0));
}
</style>
