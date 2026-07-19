<template>
    <div class="company-person">
        <div class="header">
            <PageBack/>
            <span class="title">记录</span>
        </div>
        <div class="content scrollable-table" style="background-color: white;">
            <div v-for="(item,index) in list" :key="'a'+index" class="row">
                <span class="name">{{ item.name }}</span>
                <label class="choice" :class="{ active: item.value === 'q' }">
                    <input type="radio" value="q" v-model="item.value" @change="changeValue(item)">
                    <span>裙</span>
                </label>
                <label class="choice" :class="{ active: item.value === 'k' }">
                    <input type="radio" value="k" v-model="item.value" @change="changeValue(item)">
                    <span>裤</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import PageBack from "./common/PageBack.vue";

export default {
    name: "CompanyPerson",
    components: { PageBack },
    data: function () {
        return {
            list: [{name: "sy", value: ""}, {name: "xy", value: ""}, {name: "hl", value: ""}]
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
.company-person {
    position: relative;
    height: 100%;
    width: 100%;
}

.company-person .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: calc(52px + env(safe-area-inset-top, 0));
    padding: 6px 8px;
    padding-top: calc(6px + env(safe-area-inset-top, 0));
    padding-left: calc(8px + env(safe-area-inset-left, 0));
    padding-right: calc(8px + env(safe-area-inset-right, 0));
    background: #fff;
    border-bottom: 1px solid #ddd;
}

.title {
    font-size: 18px;
    font-weight: 600;
}

.company-person .content {
    position: absolute;
    top: calc(52px + env(safe-area-inset-top, 0));
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 12px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
}

.row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 52px;
    padding: 8px 4px;
    border-bottom: 1px solid #eee;
}

.name {
    width: 48px;
    font-weight: 600;
}

.choice {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
}

.choice.active {
    border-color: #2563eb;
    background: #eff6ff;
}

.company-person input {
    height: auto;
    min-height: 20px;
    width: 20px;
}
</style>
