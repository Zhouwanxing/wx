<template>
    <div class="mp4">
        <div v-show="!selectMp4._id">
            <div class="header">
                <div style="display: flex;height: 40px;text-align: center;">
                    <div style="flex: 1;border-right: 1px solid blue;">
                        <select v-model="path" style="height: 30px;border: 1px solid #ccc;margin: 8px">
                            <option :value="'all'">请选择</option>
                            <option v-for="item in paths" :value="item._id">{{ item._id }}({{ item.count }})</option>
                        </select>
                    </div>
                    <div style="flex: 1;line-height: 40px;background-color: #ccc;border-radius: 10px;"
                         @click="page = 0;list = [];getList();">刷新({{ count }})
                    </div>
                </div>
            </div>
            <div class="content" @scroll="handleScroll">
                <div v-for="(item) in list" :key="item._id" class="one-mp4">
                    <div style="padding: 10px;white-space: pre-wrap;overflow-wrap: break-word;" @click.stop="clickImg(item)">
                        {{ item.name || item.date }}
                    </div>
                    <div class="img-div" @click.stop="clickImg(item)">
                        <img src="" style="width: 100%;height: 100%;" :id="item._id" alt=""/>
                    </div>
                    <div style="padding: 10px;">
                        <button @click.stop="updateLike(item,'delete','noFresh')">不喜欢</button>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div style="color: blue;" @click="getList">加载更多</div>
            </div>
        </div>
        <div v-if="selectMp4._id">
            <div style="text-align: center;padding: 10px;color: blue;" @click="selectMp4 = {};">关闭({{ count }})</div>
            <div style="padding: 10px;white-space: pre-wrap;font-size: 6px;">{{ selectMp4.name }}</div>
            <div>{{ selectMp4.path + "(" + selectMp4.date + ")" }}</div>
            <div>
                <button @click="changePlay">切换播放源</button>
                <button @click="openNewVideo">打开新地址</button>
            </div>
            <div style="height: 20vh;">
                <img src="" style="width: 100%;height: 100%;" id="one-img-id" alt=""/>
            </div>
            <video controls webkit-playsinline playsinline style="width: 100%;height: 40vh;margin-top:10px;"
                   id="mp4Video">
                <source src="" type="video/mp4">
            </video>
            <div style="display: flex;text-align: center;padding: 10px 0 20px 0;">
                <div style="flex: 1;">
                    <button @click="updateLike(selectMp4, 'delete')">不喜欢</button>
                </div>
                <div style="flex: 1;">
                    <button @click="refreshVideo">刷新</button>
                </div>
                <div style="flex: 1;">
                    <button @click="updateLike(selectMp4,'good')">good</button>
                </div>
                <div style="flex: 1;">
                    <button @click="updateLike(selectMp4,'better')">better</button>
                </div>
                <div style="flex: 1;">
                    <button @click="updateLike(selectMp4,'best')">best</button>
                </div>
                <div style="flex: 1;">
                    <button @click="updateLike(selectMp4,'top1')">top1</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import axios from "axios";

export default {
    name: "Mp4.vue",
    data: function () {
        return {
            page: 0,
            count: 0,
            list: [],
            selectMp4: {},
            isShowLike: false,
            paths: [],
            path: "all",
            loadImg: false,
            playSource: "https"
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.playSource = localStorage.getItem("mp4PlaySource") || "https";
            self.initPaths(function () {
                self.getList();
            });
        }, 1);
    },
    watch: {},
    methods: {
        changePlay: function () {
            const self = this;
            let source = localStorage.getItem("mp4PlaySource") || "";
            self.playSource = source === "https" ? "http" : "https";
            localStorage.setItem("mp4PlaySource", self.playSource);
        },
        openNewVideo: function () {
            const self = this;
            window.open(self.selectMp4.url);
        },
        playVideo: function (url) {
            const self = this;
            self.$nextTick(function () {

                const videoElement = document.getElementById('mp4Video');
                videoElement.src = self.playSource === "https" ?
                    url.replace("http:", "https:") : url.replace("https:", "http:");
                videoElement.addEventListener('loadeddata', () => {
                    // 自动播放
                    videoElement.play();
                    // 快进到视频中间位置（假设中间位置是视频时长的一半）
                    videoElement.currentTime = videoElement.duration / 2;
                });
                videoElement.load();
            });
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
                    }
                    self.loadImg = false;
                }).catch((e) => {
                    one.err = true;
                    self.loadImg = false;
                });
            } else {
                self.loadImg = false;
            }
        },
        initPaths: function (callback) {
            const self = this;
            Http.sendGet("/mp4/getAllCountAndPath", function (data) {
                self.paths = data.data || [];
                callback();
            });
        },
        refreshVideo: function () {
            const self = this;
            self.selectMp4 = {};
            self.showFirst();
        },
        updateLike: function (item, flag, fresh) {
            const self = this;
            Http.sendGet("/mp4/updateLike?id=" + item._id + "&flag=" + flag, function (data) {
                if (data.code !== 200) {
                    return;
                }
                let index = self.list.findIndex(function (item2) {
                    return item2._id === item._id;
                });
                if (index !== -1) {
                    self.list.splice(index, 1);
                }
                self.count--;
                self.selectMp4 = {};
                if (fresh !== "noFresh") {
                    if (self.list[0]) {
                        self.showFirst();
                    } else {
                        self.page = 0;
                        self.list = [];
                        self.getList(self.showFirst);
                    }
                }
            });
        },
        showFirst: function () {
            const self = this;
            if (self.list[0]) {
                self.$nextTick(function () {
                    self.selectMp4 = self.list[0];
                    self.$nextTick(function () {
                        self.setOneImg(self.selectMp4, "one-img-id");
                        self.playVideo(self.selectMp4.url);
                    });
                });
            }
        },
        setOneImg: function (item, id) {
            if (item.base64) {
                document.getElementById(id).src = item.base64;
                return;
            }
            axios.get(item.img, {timeout: 3000}).then((response) => {
                if (response.data) {
                    document.getElementById(id).src = response.data;
                }
            }).catch((e) => {
            });
        },
        clickImg: function (item) {
            const self = this;
            self.selectMp4 = item;
            if (item.img) {
                self.$nextTick(function () {
                    self.setOneImg(item, "one-img-id");
                });
            }
            self.playVideo(item.url);
        },
        getList: function (callback) {
            const self = this;
            Http.sendGet("/mp4/pageShowList?page=" + ++self.page + "&showLike=" + self.isShowLike + "&path=" + self.path, function (data) {
                if (data.code !== 200) {
                    return;
                }
                let list = data.list || [];
                list.forEach(item => {
                    if (!item.img) {
                        item.img = `https://pppp.642p.com/images/${item._id}/cover.txt`;
                    }
                });
                self.list = self.list.concat(list);
                self.count = data.count;
                if (callback) {
                    callback();
                }
            });
        },
    }
}
</script>

<style scoped>
.mp4 .header {
    background-color: #ccc;
    color: white;
    text-align: center;
    font-size: 20px;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
    position: fixed;
    top: 0;
    height: 50px;
    line-height: 50px;
}

.mp4 .footer {
    background-color: #ccc;
    color: white;
    text-align: center;
    font-size: 20px;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
    position: fixed;
    bottom: 0;
    height: 60px;
    padding-top: 5px;
}

.mp4 .content {
    position: absolute;
    top: 50px;
    bottom: 60px;
    left: 0;
    right: 0;
    overflow-y: auto;
    background-color: #ccc;
}
</style>
