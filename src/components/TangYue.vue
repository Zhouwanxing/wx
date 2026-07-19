<template>
    <div class="tangyue">
        <div class="header">
            <div class="header-row">
                <PageBack/>
                <div class="select-wrap">
                    <select v-model="formData.xq">
                        <option :value="'ty'">唐樾</option>
                        <option :value="'yt'">悦庭</option>
                    </select>
                </div>
                <div class="select-wrap">
                    <select v-model="formData.building">
                        <option v-for="item in builds" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div class="select-wrap">
                    <select v-model="formData.unit">
                        <option :value="'1'">一单元</option>
                        <option :value="'2'" v-if="['3','4','A12','A15','A7','A9'].includes(formData.building)">二单元
                        </option>
                    </select>
                </div>
                <button type="button" class="search-btn" @click="searchAll">查询</button>
            </div>
        </div>
        <div class="content scrollable-table">
            <div class="layout">
                <div class="filters-side">
                    <div class="side-tip">点选单元格查看详情</div>
                </div>
                <div class="table-wrap">
                    <table border="1" style="width: 100%;">
                        <thead>
                        <tr>
                            <th v-for="(oneRow,index) in (table[0] || [])" :key="index" :rowspan="index === 0 ? 2 : 1">
                                {{ index === 0 ? '楼层' : index }}
                            </th>
                        </tr>
                        <tr>
                            <th v-for="(oneRow,index) in (table[0] || []).slice(1)" :key="index">
                                {{ oneRow }}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(oneRow,index) in table.slice(1)" :key="index">
                            <th v-for="(item,cIndex) in oneRow" :key="cIndex" class="cell"
                                :class="getTop(index,cIndex)"
                                @click="clickTh(index,cIndex)">{{ item }}
                            </th>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="footer">
            <div>{{ showText1 }}</div>
            <div>{{ showText2 }}</div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import PageBack from "./common/PageBack.vue";

export default {
    name: "TangYue.vue",
    components: { PageBack },
    data: function () {
        return {
            formData: {
                xq: "ty",
                building: "A6",
                unit: "1"
            },
            builds: ["A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15", "A16"],
            table: [],
            showText1: "",
            showText2: "",
            selectRow: -1,
            selectCel: -1,
        }
    },
    mounted() {
    },
    watch: {
        "formData.xq": function () {
            console.log("change");
            this.formData.unit = "1";
            if (this.formData.xq === "ty") {
                this.builds = ["A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "A14", "A15", "A16"];
                this.formData.building = "A6";
            } else {
                this.builds = ["1", "2", "3", "4", "5", "6", "7", "8"];
                this.formData.building = "1";
            }
        },
        "formData.building": function () {
            this.formData.unit = "1";
        }
    },
    computed: {
        firstRow: function () {
            const self = this;
            let one = self.table[0] || [];
            if (one.length === 0) {
                return [];
            }
            let list = [""];
            for (let i = 0; i < one.length - 1; i++) {
                list.push((i + 1) + "");
            }
            return list;
        },
        showText1: function () {
            const self = this, {formData, table, selectRow, selectCel} = self, {xq, building, unit} = formData;
            let s = (xq === "ty" ? "唐樾" : "悦庭") + building + "栋" + unit + "单元";
            if (selectRow !== -1) {
                s += table[selectRow + 1][0] + "层" + selectCel + "号";
            }
            return s;
        },
        showText2: function () {
            const self = this, {selectRow, table, selectCel} = self;
            let s = "";
            if (selectRow !== -1) {
                let price = table[selectRow + 1][selectCel];
                let area = table[0][selectCel];
                s += price + "*" + area + "=" + ((price * (area * 100)) / 100);
            }
            return s;
        }
    },
    methods: {
        searchAll: function () {
            const self = this;
            self.selectRow = -1;
            self.selectCel = -1;
            Http.sendPost("/tangyue/getList", self.formData, function (res) {
                self.table = res.data || [];
            });
        },
        clickTh: function (index, cIndex) {
            if (cIndex === 0) {
                return;
            }
            const self = this;
            self.selectRow = index;
            self.selectCel = cIndex;
        },
        getTop: function (index, cIndex) {
            if (cIndex === 0) {
                return "";
            }
            const self = this, table = self.table;
            if(self.selectRow === index && self.selectCel === cIndex){
                return "bg-blue color-crimson";
            }
            let cels = table.slice(1).map((oneRow) => oneRow[cIndex]).filter((item) => item !== 0);
            let max = Math.max(...cels);
            let min = Math.min(...cels);
            let current = table[index + 1][cIndex];
            if (current === max) {
                return "bg-red";
            } else if (current === min) {
                return "bg-yellow color-crimson";
            }
            return "";
        }
    }
}
</script>

<style scoped>
.tangyue .header, .footer {
    text-align: center;
    font-size: 20px;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
}

.tangyue .header {
    position: fixed;
    top: 0;
    min-height: calc(56px + env(safe-area-inset-top, 0));
    padding-top: env(safe-area-inset-top, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
    background: #fff;
    z-index: 10;
    width: 100%;
}

.header-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 56px;
    padding: 6px 8px;
    text-align: center;
}

.select-wrap {
    flex: 1;
    min-width: 0;
}

.select-wrap select {
    width: 100%;
    min-height: 44px;
}

.search-btn {
    flex-shrink: 0;
    min-height: 44px;
    background: #e5e7eb;
}

.cell {
    min-width: 44px;
    min-height: 44px;
    padding: 12px 4px;
}

.layout {
    display: block;
}

.filters-side {
    display: none;
}

@media (min-width: 768px) {
    .layout {
        display: flex;
        gap: 12px;
        min-height: 100%;
    }

    .filters-side {
        display: block;
        width: 160px;
        flex-shrink: 0;
        padding: 12px;
        background: #f8fafc;
        border-right: 1px solid #e2e8f0;
    }

    .side-tip {
        font-size: 14px;
        color: #64748b;
        line-height: 1.5;
    }

    .table-wrap {
        flex: 1;
        min-width: 0;
        overflow: auto;
    }
}

.tangyue .footer {
    position: fixed;
    bottom: 0;
    height: calc(70px + env(safe-area-inset-bottom, 0));
    padding-top: 5px;
    padding-bottom: env(safe-area-inset-bottom, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
    border-top: 1px solid black;
    background: #fff;
    width: 100%;
}

.tangyue .content {
    position: absolute;
    top: calc(56px + env(safe-area-inset-top, 0));
    bottom: calc(70px + env(safe-area-inset-bottom, 0));
    left: 0;
    right: 0;
    overflow-x: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
}

/* 设置表头固定 */
.tangyue thead {
    position: sticky;
    top: 2px;
    background-color: #f2f2f2;
}

/* 设置表格内容区域可滚动 */
.tangyue .scrollable-table {
    overflow-y: auto; /* 垂直方向可滚动 */
}

.tangyue .bg-red {
    background-color: red;
}

.tangyue .bg-yellow {
    background-color: yellow;
}
.tangyue .bg-blue {
    background-color: blue;
}
.tangyue .color-crimson {
    color: crimson;
}
</style>
