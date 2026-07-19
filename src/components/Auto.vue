<template>
    <div class="auto-page">
        <div class="toolbar">
            <PageBack/>
            <button type="button" class="refresh-btn" @click="init">刷新</button>
        </div>
        <div class="list">
            <div v-for="item in info" :key="item.time" class="item">
                {{ item.time }}
            </div>
        </div>
        <div class="footer">
            <button type="button" class="punch-btn" @click="auto">打卡</button>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import PageBack from "./common/PageBack.vue";

export default {
    name: "Auto",
    components: { PageBack },
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
.auto-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: env(safe-area-inset-top, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
}

.toolbar {
    display: flex;
    gap: 8px;
    padding: 8px;
    align-items: center;
}

.refresh-btn {
    flex: 1;
    min-height: 44px;
}

.list {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 12px 12px;
}

.item {
    border: 1px solid #ccc;
    padding: 14px;
    margin-top: 10px;
    border-radius: 8px;
    text-align: center;
    min-height: 44px;
}

.footer {
    padding: 12px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));
}

.punch-btn {
    width: 100%;
    min-height: 52px;
    font-size: 18px;
    font-weight: 600;
    background: #1d4ed8;
    color: #fff;
    border-color: #1d4ed8;
}
</style>
