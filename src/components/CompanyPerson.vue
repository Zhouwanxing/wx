<template>
    <div class="company-person">
        <div class="header">
            记录
        </div>
        <div class="content scrollable-table" style="background-color: white;">
            <div v-for="(item,index) in list" :key="'a'+index"
                 style="height: 30px; text-align: center; line-height: 30px;">
                <span>{{ item.name }}</span>
                <span style="margin-left: 30px;"> <input type="radio" value="q" v-model="item.value"
                                                         @change="changeValue(item)">裙</span>
                <span style="margin-left: 30px;"> <input type="radio" value="k" v-model="item.value"
                                                         @change="changeValue(item)">裤</span>
            </div>
        </div>
        <div class="footer">

        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";

export default {
    name: "CompanyPerson",
    data: function () {
        return {
            list: [{name: "sy", value: ""}, {name: "xy", value: ""}, {name: "hl", value: ""}, {name: "wyl", value: ""}]
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.findToday();
        });
    },
    watch: {},
    computed: {},
    methods: {
        changeValue: function (item) {
            Http.sendPost("/company/saveOne", {name: item.name, dress: item.value}, function () {

            });
        },
        findToday: function () {
            const self = this;
            Http.sendGet("/company/findToday", function (res) {
                let obj = res.data || {};
                self.list.forEach(item => {
                    item.value = obj[item.name] || "";
                });
            });
        },
    },
    filters: {}
}
</script>

<style scoped>
.company-person .header, .footer {
    text-align: center;
    font-size: 20px;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
}

.company-person .header {
    position: fixed;
    top: 0;
    height: 50px;
    line-height: 50px;
}

.company-person .footer {
    position: fixed;
    bottom: 0;
    height: 60px;
    padding-top: 5px;
    border-top: 1px solid black;
}

.company-person .content {
    position: absolute;
    top: 50px;
    bottom: 60px;
    left: 0;
    right: 0;
    overflow-y: auto;
}

.company-person input {
    height: auto;
}
</style>
