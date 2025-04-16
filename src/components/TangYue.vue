<template>
    <div class="tangyue">
        <div class="header">
            <div style="display: flex;text-align: center;">
                <div style="flex: 1;padding: 0 3px;">
                    <select v-model="formData.xq" style="height: 30px;border: 1px solid #ccc;width: 100%;">
                        <option :value="'ty'">唐樾</option>
                        <option :value="'yt'">悦庭</option>
                    </select>
                </div>
                <div style="flex: 1;padding: 0 3px;">
                    <select v-model="formData.building" style="height: 30px;border: 1px solid #ccc;width: 100%;">
                        <option v-for="item in builds" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div style="flex: 1;padding: 0 3px;">
                    <select v-model="formData.unit" style="height: 30px;border: 1px solid #ccc;width: 100%;">
                        <option :value="'1'">一单元</option>
                        <option :value="'2'" v-if="['3','4','A12','A15','A7','A9'].includes(formData.building)">二单元</option>
                    </select>
                </div>
                <div style="flex: 1;line-height: 50px;background-color: #ccc;border-radius: 10px;"
                     @click="searchAll">查询
                </div>
            </div>
        </div>
        <div class="content scrollable-table">
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
                    <th v-for="(item,cIndex) in oneRow" :key="cIndex" style="padding: 5px 0;"
                        :class="getTop(index,cIndex)"
                        @click="clickTh(index,cIndex)">{{ item }}
                    </th>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="footer">
            <div>{{ showText1 }}</div>
            <div>{{ showText2 }}</div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";

export default {
    name: "TangYue.vue",
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
                s += price + "*" + area + "=" + (price * area);
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
            let cels = table.slice(1).map((oneRow) => oneRow[cIndex]);
            let max = Math.max(...cels);
            let min = Math.min(...cels);
            let current = table[index + 1][cIndex];
            if (current === max) {
                return "bg-red";
            } else if (current === min) {
                return "bg-yellow";
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
    height: 50px;
    line-height: 50px;
}

.tangyue .footer {
    position: fixed;
    bottom: 0;
    height: 60px;
    padding-top: 5px;
    border-top: 1px solid black;
}

.tangyue .content {
    position: absolute;
    top: 50px;
    bottom: 60px;
    left: 0;
    right: 0;
    overflow-y: auto;
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
</style>
