<template>
    <div class="er-page">
        <div class="header">
            二手房
        </div>
        <div class="content scrollable-table" style="background-color: white;">
            <div v-for="(item,index) in list" :key="index" @click="clickOne(item)"
                 style="background-color: #ddd;border-radius: 5px;margin: 5px;padding: 5px;">
                <div :style="item.linkUrl ? 'color:blue;' : ''">{{ item.info }}</div>
                <div>{{ item.priceStr }}</div>
                <div v-if="(item.histories || []).length > 0" style="margin-top: 10px;color:red;">
                    <div v-for="(one,oneIndex) in item.histories" :key="'a'+oneIndex">
                        <span>{{ one.time }}</span>
                        <span style="margin-left: 20px;">{{ one.price }}</span>
                    </div>
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
            list: []
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

        },
        findAll: function () {
            const self = this;
            Http.sendPost("/tangyue/getAJK", {}, function (res) {
                self.list = res.data || [];
            });
        }
    }
}
</script>

<style scoped>
.er-page .header, .footer {
    text-align: center;
    font-size: 20px;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
}

.er-page .header {
    position: fixed;
    top: 0;
    height: 50px;
    line-height: 50px;
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
    top: 50px;
    bottom: 60px;
    left: 0;
    right: 0;
    overflow-y: auto;
}
</style>
