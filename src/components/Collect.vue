<template>
    <div class="collect">
        <div class="header">
            <div class="header-inner">
                <PageBack/>
                <select v-model="formData.path" @change="list = [];formData.page = 1;searchPath()"
                        class="header-select">
                    <option :value="'all'">请选择</option>
                    <option v-for="item in paths" :value="item">{{ item }}</option>
                </select>
                <select v-model="formData.showBest" @change="list = [];formData.page = 1;searchPath()"
                        class="header-select">
                    <option :value="'best'">best</option>
                    <option :value="'top1'">top1</option>
                    <option :value="'top2'">top2</option>
                    <option :value="'top3'">top3</option>
                    <option :value="'top4'">top4</option>
                </select>
                <button type="button" class="header-refresh" @click="formData.page = 1;searchPath();">
                    {{ count }}/{{ formData.page }}
                </button>
            </div>
        </div>
        <div class="content" @scroll="handleScroll">
            <div v-for="(item) in list" :key="item._id" class="one-mp4">
                <div style="padding: 10px;white-space: pre-wrap;overflow-wrap:break-word;">{{ item.name || item.date }}[{{ item.useCount || 0 }}]</div>
                <div class="img-div" @click="clickImgNew(item)" style="">
                    <img style="width: 100%;height: 100%;" :id="item._id" alt=""/>
                </div>
                <div class="card-actions">
                    <button @click.stop="openInXx(item)">官网</button>
                    <button @click.stop="updateLike(item,'best')">best</button>
                    <button @click.stop="clickImg(item)">旧播放</button>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="footer-inner">
                <button type="button" v-if="showLoad" class="footer-btn" @click="formData.page++;searchPath();">加载更多</button>
                <button type="button" v-if="formData.showBest === 'best' && count > 0" class="footer-btn" @click="randomMp4">随机</button>
            </div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import axios from "axios";
import PageBack from "./common/PageBack.vue";

export default {
    name: "Collect",
    components: { PageBack },
    data() {
        return {
            formData: {
                path: "all",
                page: 1,
                showBest: "best",
                beforeMonth: ""
            },
            paths: [],
            list: [],
            months: [],
            showLoad: true,
            count: 0,
            loadImg: false
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.initMonth();
            self.getAllPath();
            self.searchPath();
        }, 1);
    },
    methods: {
        randomMp4: function () {
            const self = this;
            Http.sendGet("/mp4/getRandomMp4Id?count=" + self.count, function (data) {
                if (data.data) {
                    self.clickImgNew({_id: data.data});
                }
            });
        },
        updateLike: function (item, flag) {
            const self = this;
            Http.sendGet("/mp4/updateLike?id=" + item._id + "&flag=" + flag, function (data) {

            });
        },
        initMonth() {
            //从当前月20个月前的yyyy-MM
            const self = this;
            const currentDate = new Date();
            self.months = [];
            for (let i = 0; i < 10; i++) {
                // const date = new Date(currentDate);
                // date.setMonth(date.getMonth() - i * 2);
                // self.months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
                self.months.push(`${i + 1}`);
            }
        },
        handleScroll: function () {
            const self = this;
            if (self.loadImg) {
                return;
            }
            self.loadImg = true;
            let one = self.list.find(item => !item.base64 && !item.err);
            if (one) {
                axios.get(one.img, {timeout: 10000}).then((response) => {
                    if (response.data) {
                        one.base64 = response.data;
                        document.getElementById(one._id).src = response.data;
                    } else {
                        document.getElementById(one._id).src = one.img;
                    }
                    self.loadImg = false;
                }).catch((e) => {
                    one.err = true;
                    document.getElementById(one._id).src = one.img;
                    self.loadImg = false;
                });
            } else {
                self.loadImg = false;
            }
        },
        openInXx: function (item) {
            const self = this;
            Http.sendGet("/mp4/getInXxUrl?id=" + item._id, function (data) {
                if (data.data) {
                    window.open(data.data);
                }
            });
        },
        clickImg: function (item) {
            window.open("./video.html?url=" + item.url);
        },
        clickImgNew: function (item) {
            let url = "./v2.html?id=" + item._id + "&count=" + this.count;
            let baseInfo = Http.getBaseInfo();
            for (let key in baseInfo) {
                url += "&" + key + "=" + baseInfo[key];
            }
            window.open(url);
        },
        searchPath: function (flag) {
            const self = this;
            let all = {...self.formData};
            if (flag && all.beforeMonth) {
                self.formData.page = all.page = parseInt(self.count / 10 / 10 * parseInt(self.formData.beforeMonth));
            }
            all.beforeMonth = "";
            Http.sendPost("/mp4/getLikeList", all, function (data) {
                let list = data.data || [];
                self.showLoad = list.length > 0;
                self.list = self.list.concat(list);
                self.count = data.count || 0;
            });
        },
        getAllPath: function () {
            const self = this;
            Http.sendGet("/mp4/getAllPath", function (data) {
                self.paths = data.data || [];
            });
        }
    }
}
</script>

<style>
.collect .header, .footer {
    background-color: #ccc;
    color: white;
    text-align: center;
    font-size: 20px;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
}

.collect {
    position: relative;
    height: 100%;
    width: 100%;
}

.collect .header {
    position: fixed;
    top: 0;
    min-height: calc(56px + env(safe-area-inset-top, 0));
    padding-top: env(safe-area-inset-top, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
    z-index: 10;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #ddd;
}

.header-inner {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 56px;
    padding: 6px 8px;
}

.header-select {
    flex: 1;
    min-width: 0;
    min-height: 44px;
}

.header-refresh {
    flex-shrink: 0;
    min-height: 44px;
    padding: 8px 10px;
}

.card-actions {
    display: flex;
    gap: 8px;
    padding: 10px;
}

.card-actions button {
    flex: 1;
    min-height: 44px;
}

.collect .footer {
    position: fixed;
    bottom: 0;
    min-height: calc(56px + env(safe-area-inset-bottom, 0));
    padding: 6px 8px;
    padding-bottom: calc(6px + env(safe-area-inset-bottom, 0));
    padding-left: calc(8px + env(safe-area-inset-left, 0));
    padding-right: calc(8px + env(safe-area-inset-right, 0));
    width: 100%;
    background: #fff;
    border-top: 1px solid #ddd;
}

.footer-inner {
    display: flex;
    gap: 8px;
}

.footer-btn {
    flex: 1;
    min-height: 44px;
    color: #1d4ed8;
}

.collect .content {
    position: absolute;
    top: calc(56px + env(safe-area-inset-top, 0));
    bottom: calc(56px + env(safe-area-inset-bottom, 0));
    left: 0;
    right: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #ccc;
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
}
</style>