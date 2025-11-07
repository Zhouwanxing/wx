<template>
    <div class="collect">
        <div class="header">
            <div style="display: flex;height: 50px;text-align: center;position: fixed;top: 0;width: 100vw;">
                <div style="flex: 2;border-right: 1px solid blue;">
                    <select v-model="formData.path" @change="list = [];formData.page = 1;searchPath()"
                            style="height: 30px;border: 1px solid #ccc;margin: 8px">
                        <option :value="'all'">请选择</option>
                        <option v-for="item in paths" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div
                    style="flex: 2;border-right: 1px solid blue;display: flex;justify-content: center;align-items: center;">
                    <select v-model="formData.showBest" @change="list = [];formData.page = 1;searchPath()"
                            style="height: 30px;border: 1px solid #ccc;margin: 8px">
                        <option :value="'top1'">top1</option>
                        <option :value="'top2'">top2</option>
                        <option :value="'top3'">top3</option>
                        <option :value="'top4'">top4</option>
                    </select>
                </div>
                <div
                    style="flex: 2;border-right: 1px solid blue;display: flex;justify-content: center;align-items: center;">
                    <select v-model="formData.beforeMonth" @change="list = [];searchPath(true)"
                            style="height: 30px;border: 1px solid #ccc;margin: 8px">
                        <option :value="''">请选择</option>
                        <option v-for="item in months" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div style="flex: 1;line-height: 50px;height: 50px;"
                     @click="formData.page = 1;searchPath();">
                    {{ count }}/{{ formData.page }}
                </div>
            </div>
        </div>
        <div class="content" @scroll="handleScroll">
            <div v-for="(item) in list" :key="item._id" class="one-mp4">
                <div style="padding: 10px;white-space: pre-wrap;overflow-wrap:break-word;">{{ item.name || item.date }}</div>
                <div class="img-div" @click="clickImg(item)" style="">
                    <img style="width: 100%;height: 100%;" :id="item._id" alt=""/>
                </div>
                <div>
                    <button @click.stop="openInXx(item)">官网打开</button>
                </div>
            </div>
        </div>
        <div class="footer">
            <div style="color: blue;"
                 @click="formData.page++;searchPath();"
                 v-if="showLoad">加载更多
            </div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import axios from "axios";

export default {
    name: "Collect",
    data() {
        return {
            formData: {
                path: "all",
                page: 1,
                showBest: "top1",
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

.collect .header {
    position: fixed;
    top: 0;
    height: 50px;
    line-height: 50px;
}

.collect .footer {
    position: fixed;
    bottom: 0;
    height: 60px;
    padding-top: 5px;
}

.collect .content {
    position: absolute;
    top: 50px;
    bottom: 60px;
    left: 0;
    right: 0;
    overflow-y: auto;
    background-color: #ccc;
}
</style>