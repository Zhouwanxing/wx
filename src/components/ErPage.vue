<template>
    <div class="er-page">
        <div class="header">
            <div style="display: flex;height: 40px;text-align: center;width: 100%;">
                <div style="flex: 3;">
                    价格：<input type="number" placeholder="最小价格" style="width: 30%;" v-model="formData.priceMin">
                    <span>~</span>
                    <input type="number" placeholder="最大价格" style="width: 30%;" v-model="formData.priceMax">
                </div>
                <div style="flex: 3;">
                    面积：<input type="number" placeholder="最小面积" style="width: 30%;" v-model="formData.areaMin">
                    <span>~</span>
                    <input type="number" placeholder="最大面积" style="width: 30%;" v-model="formData.areaMax">
                </div>
                <div style="flex: 1;">
                    <button @click.stop="formData.showAll = !formData.showAll">
                        {{ formData.showAll ? '全部' : '低/中' }}
                    </button>
                </div>
            </div>
            <div style="display: flex;height: 40px;text-align: center;width: 100%;">
                <div style="flex: 1;">
                    <button @click.stop="formData.sortKey = 'price';formData.sortValue = -formData.sortValue;">
                        价格{{ formData.sortKey !== 'price' ? '' : formData.sortValue === 1 ? '⇑' : '⇓' }}
                    </button>
                </div>
                <div style="flex: 1;">
                    <button @click.stop="formData.sortKey = 'area';formData.sortValue = -formData.sortValue;">
                        面积{{ formData.sortKey !== 'area' ? '' : formData.sortValue === 1 ? '⇑' : '⇓' }}
                    </button>
                </div>
                <div style="flex: 1;">
                    <button @click.stop="formData.sortKey = 'lastTime';formData.sortValue = -formData.sortValue;">
                        时间{{ formData.sortKey !== 'lastTime' ? '' : formData.sortValue === 1 ? '⇑' : '⇓' }}
                    </button>
                </div>
                <div style="flex: 1;">
                    <button @click.stop="findAll">查询({{ list.length }})</button>
                </div>
            </div>
        </div>
        <div class="content scrollable-table" style="background-color: white;">
            <div v-for="(item,index) in list" :key="index" @click="clickOne(item)"
                 style="background-color: #ddd;border-radius: 5px;margin: 5px;padding: 5px;"
                 :style="selectId === item._id ? 'border:2px solid red;' : ''">
                <div :style="item.linkUrl ? 'color:blue;' : ''">{{ item.info }}</div>
                <div>{{ item.priceStr }}/{{ item.from }}/{{ item.lastTime || "" }}</div>
                <div v-for="(cItem,cIndex) in areaPlace(item.area)" :key="'c' + cIndex">
                    <span>{{ cItem._id }}</span>
                    <span style="margin-left: 20px;">{{ cItem.closestArea }}</span>
                    <span style="margin-left: 20px;">{{ cItem.diff.toFixed(2) }}</span>
                </div>
                <div v-if="(item.histories || []).length > 0" style="margin-top: 10px;color:red;">
                    <div v-for="(one,oneIndex) in item.histories" :key="'a'+oneIndex">
                        <span>{{ one.time }}</span>
                        <span style="margin-left: 20px;">{{ one.price }}</span>
                    </div>
                </div>
                <div>
                    <button @click.stop="updateLike(item, 'delete')">没了</button>
                    <button @click.stop="updateLike(item, 'notLike')" style="margin-left: 20px;">不喜欢</button>
                </div>
            </div>
        </div>
        <div class="footer">

        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";

export default {
    name: "ErPage",
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
                areaMin: 110,
                areaMax: 130,
                priceMin: 180,
                priceMax: 240,
                sortKey: "price",
                sortValue: 1,
                showAll: false
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
        clickOne: function (item) {
            if (item.linkUrl) {
                this.selectId = item._id;
                window.open(item.linkUrl);
            }
        },
        findAll: function () {
            const self = this;
            Http.sendPost("/tangyue/getAJK", self.formData, function (res) {
                self.list = res.data || [];
            });
        },
        updateLike: function (item, type) {
            const self = this;
            Http.sendPost("/tangyue/updateErSF", {id: item._id, type: type}, function (res) {
                let index = self.list.findIndex(function (item2) {
                    return item2._id === item._id;
                });
                if (index !== -1) {
                    self.list.splice(index, 1);
                }
            });
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
.er-page .footer {
    text-align: center;
    font-size: 20px;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
}

.er-page .header {
    position: fixed;
    top: 0;
    height: 82px;
    line-height: 50px;
    width: 100%;
}

.er-page .footer {
    position: fixed;
    bottom: 0;
    height: 60px;
    padding-top: 5px;
    border-top: 1px solid black;
}

.er-page .content {
    position: absolute;
    top: 82px;
    bottom: 60px;
    left: 0;
    right: 0;
    overflow-y: auto;
}
</style>
