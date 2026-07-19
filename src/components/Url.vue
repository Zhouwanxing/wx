<template>
    <div class="url">
        <div class="toolbar">
            <PageBack/>
            <button type="button" class="tool-btn" @click.stop="getNewUrl">刷新</button>
        </div>
        <div class="toolbar secondary">
            <button type="button" class="tool-btn" @click.stop="restart(1)">重启1次</button>
            <button type="button" class="tool-btn" @click.stop="restart(10)">重启10次</button>
            <button type="button" class="tool-btn" @click.stop="restart(0)">重置</button>
        </div>

        <div class="list">
            <div v-for="(item,index) in showUrls" :key="index" class="url-card">
                <div class="url-index">{{ index + 1 }}</div>
                <div class="url-text">{{ item }}</div>
                <button type="button" class="open-btn" @click="openUrl(item)">打开</button>
            </div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import PageBack from "./common/PageBack.vue";

export default {
    name: "Url",
    components: { PageBack },
    data() {
        return {
            showUrls: [],
            url: ""
        };
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.getUrls();
        }, 1);
    },
    methods: {
        restart: function (times) {
            Http.sendGet("/user/sendToMq?message=restart_" + times, function (res) {

            });
        },
        saveUrl: function () {
            const self = this;
            if (!self.url) {
                return;
            }
            Http.sendPost("/mp4/saveUrl", {url: self.url}, function (res) {
                self.showUrls = (res.data || []).filter(item => !item.includes("154.88.28.8"));
            });
        },
        getNewUrl: function () {
            const self = this;
            Http.sendGet("/user/getNewStart", function (res) {
                self.getUrls();
            });
        },
        getUrls: function () {
            const self = this;
            Http.sendPost("/mp4/getUrls", {}, function (res) {
                self.showUrls = (res.data || []).filter(item => !item.includes("154.88.28.8"));
            });
        },
        openUrl: function (url) {
            //新打开url地址
            window.open(url, '_blank');
        },
        deleteUrl: function (url) {
            const self = this;
            Http.sendPost("/mp4/deleteUrl", {url: url}, function (res) {
                self.showUrls = (res.data || []).filter(item => !item.includes("154.88.28.8"));
            });
        }
    }
}
</script>

<style scoped>
.url {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: env(safe-area-inset-top, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
}

.toolbar {
    display: flex;
    gap: 8px;
    padding: 8px;
    align-items: center;
}

.toolbar.secondary {
    padding-top: 0;
}

.tool-btn {
    flex: 1;
    min-height: 44px;
    background: #e5e7eb;
}

.list {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 8px 12px 16px;
}

.url-card {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
}

.url-index {
    width: 28px;
    flex-shrink: 0;
    text-align: center;
    font-weight: 600;
}

.url-text {
    flex: 1;
    min-width: 0;
    word-break: break-all;
    font-size: 13px;
    line-height: 1.4;
}

.open-btn {
    flex-shrink: 0;
    min-height: 44px;
    min-width: 64px;
}
</style>