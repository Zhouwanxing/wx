<template>
    <div style="text-align: center;">
        <div style="margin-top: 10px;">
            <button @click="init">刷新</button>
        </div>
        <div v-for="item in info" style="border: 1px solid #ccc;padding: 10px;margin-top: 10px;">
            {{ item.time }}
        </div>

        <div style="margin-top: 10px;">
            <button @click="auto">打卡</button>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";

export default {
    name: "Auto",
    data() {
        return {
            info: []
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.init();
        });
    },
    methods: {
        init: function () {
            const self = this;
            Http.sendGet("/auto/getInfo", function (data) {
                self.info = (data.data || []).map((item) => {
                    item.time = new Date(item.punchTime).toLocaleString();
                    return item;
                });
            });
        },
        auto: function () {
            const self = this;
            Http.sendGet("/auto/inWork", function (data) {
                self.init();
            });
        }
    },
    filters: {
        showTime: function (time) {
            //时间戳转换为日期格式
            return new Date(time).toLocaleString();
        }
    }
}
</script>

<style scoped>

</style>