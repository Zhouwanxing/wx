<template>
    <div class="tangyue">
        <div class="header">
            <div style="display: flex;height: 40px;text-align: center;padding: 5px;">
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
                        <option :value="'2'">二单元</option>
                    </select>
                </div>
                <div style="flex: 1;line-height: 30px;background-color: #ccc;border-radius: 10px;"
                     @click="searchAll">查询
                </div>
            </div>
        </div>
        <div class="content scrollable-table">
            <table border="1" style="padding: 0px 5px 15px 5px;width: 100%;">
                <thead>
                <tr>
                    <th v-for="(oneRow,index) in firstRow" :key="index">
                        {{ oneRow }}
                    </th>
                </tr>
                <tr>
                    <th v-for="(oneRow,index) in (table[0] || [])" :key="index">
                        {{ oneRow }}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(oneRow,index) in table" :key="index">
                    <th v-for="(item,cIndex) in oneRow" :key="cIndex" style="padding: 5px 0;">{{ item }}</th>
                </tr>
                </tbody>
            </table>
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
            table: []
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

        }
    },
    methods: {
        searchAll: function () {
            const self = this;
            Http.sendPost("/tangyue/getList", self.formData, function (res) {
                self.table = res.data || [];
            });
        }
    }
}
</script>

<style scoped>
/* 设置表头固定 */
.tangyue thead {
    position: sticky;
    top: 0;
    background-color: #f2f2f2;
}

/* 设置表格内容区域可滚动 */
.tangyue .scrollable-table {
    height: calc(100vh - 40px); /* 设置表格内容的最大高度 */
    overflow-y: auto; /* 垂直方向可滚动 */
}
</style>
