<template>
    <div class="mp4">
        <div v-show="!selectMp4._id">
            <div class="header">
                <div class="list-toolbar">
                    <PageBack/>
                    <select v-model="path" class="path-select" @change="changePath">
                        <option :value="'all'">请选择</option>
                        <option v-for="item in paths" :value="item._id">{{ item._id }}({{ item.count }})</option>
                    </select>
                    <button type="button" class="toolbar-hit" @click="page = 0;list = [];getList();">
                        {{ count }}/{{ list.length }}
                    </button>
                    <button type="button" class="toolbar-hit" @click="sort = !sort;">排序</button>
                </div>
            </div>
            <div class="content" @scroll="handleScroll">
                <div v-for="(item) in list" :key="item._id" class="one-mp4">
                    <div style="padding: 10px;white-space: pre-wrap;overflow-wrap: break-word;"
                         @click.stop="clickImg(item)">
                        {{ item.name || item.date }}（{{ formatDuration(item.duration) }}）
                    </div>
                    <div class="img-div" @click.stop="clickImg(item)">
                        <img src="" style="width: 100%;height: 100%;" :id="item._id" alt=""/>
                    </div>
                    <div style="padding: 10px;">
                        <button @click.stop="updateLike(item,'delete','noFresh')">不喜欢</button>
                    </div>
                </div>
            </div>
            <div class="footer list-footer">
                <button type="button" class="footer-btn" @click="loadNextPage">加载下一页 ({{ page }})</button>
            </div>
        </div>
        <div v-if="selectMp4._id" class="detail">
            <div class="detail-header">
                <button type="button" class="close-btn" @click="closeVideo">关闭 ({{ count }}/{{ list.length }})</button>
                <select v-model="path" class="path-select" @change="changePath">
                    <option :value="'all'">请选择</option>
                    <option v-for="item in paths" :value="item._id">{{ item._id }}({{ item.count }})</option>
                </select>
            </div>
            <div class="detail-body">
                <div class="meta" @click="metaExpanded = !metaExpanded">
                    <div class="meta-title">{{ selectMp4.name }}（{{ formatDuration(selectMp4.duration) }}）</div>
                    <div v-show="metaExpanded" class="meta-extra">
                        <div>{{ selectMp4.path + "(" + selectMp4.date + ")" }}</div>
                        <div>{{ selectMp4.url }}</div>
                        <div v-if="selectMp4.m3u8">m3u8: {{ selectMp4.m3u8 }}</div>
                    </div>
                    <div class="meta-tip">{{ metaExpanded ? '收起详情' : '展开详情' }}</div>
                </div>
                <div class="play-mode-row">
                    <button @click="changePlayMode">{{ useM3u8 ? '切换URL' : '切换M3U8' }}</button>
                    <button @click="changePlay">协议({{ playSource }})</button>
                    <button @click="openNewVideo">新地址</button>
                </div>
                <div class="cover-wrap">
                    <img src="" style="width: 100%;height: 100%;object-fit: cover;" id="one-img-id" alt=""/>
                </div>
                <video controls webkit-playsinline playsinline class="detail-video" id="mp4Video">
                    <source src="" type="video/mp4">
                </video>
                <div v-for="(tag,tagIn) in (selectMp4.tags || [])" :key="tagIn + '_tag'" class="tag-item">
                    {{ tag }}
                </div>
            </div>
            <div class="detail-footer">
                <div class="action-primary">
                    <button @click="updateLike(selectMp4, 'delete')">不喜欢</button>
                    <button class="best-btn" @click="updateLike(selectMp4,'best')">best</button>
                    <button @click="refreshVideo">刷新</button>
                    <button @click="openInXx(selectMp4)">官网</button>
                </div>
                <div class="action-secondary">
                    <button @click="rotateVideo">旋转</button>
                    <button @click="updateLike(selectMp4,'top1')">top1</button>
                    <button @click="updateLike(selectMp4,'top2')">top2</button>
                    <button @click="updateLike(selectMp4,'top3')">top3</button>
                    <button @click="updateLike(selectMp4,'top4')">top4</button>
                    <button @click="getList">更多</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import axios from "axios";
import Hls from 'hls.js';
import PageBack from "./common/PageBack.vue";

export default {
    name: "Mp4.vue",
    components: { PageBack },
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
            playSource: "https",
            currentDuration: 0,
            rotateDeg: 0,
            useM3u8: false,
            sort: false,
            hls: null,
            metaExpanded: false
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.getInitPath();
            self.playSource = localStorage.getItem("mp4PlaySource") || "https";
            self.useM3u8 = localStorage.getItem("mp4UseM3u8") === "true";
            self.initPaths(function () {
                self.getList();
            });
        }, 1);
    },
    beforeUnmount() {
        if (this.hls) {
            this.hls.destroy();
        }
    },
    watch: {},
    methods: {
        loadNextPage: function () {
            this.page++;
            this.getList();
        },
        openInXx: function (item) {
            const self = this;
            Http.sendGet("/mp4/getInXxUrl?id=" + item._id, function (data) {
                if (data.data) {
                    window.open(data.data);
                }
            });
        },
        changePath: function () {
            const self = this;
            localStorage.setItem("mp4Path", self.path);
        },
        getInitPath: function () {
            const self = this;
            self.path = localStorage.getItem("mp4Path") || "all";
        },
        changePlay: function () {
            const self = this;
            let source = localStorage.getItem("mp4PlaySource") || "";
            self.playSource = source === "https" ? "http" : "https";
            localStorage.setItem("mp4PlaySource", self.playSource);
            self.refreshVideo();
        },
        changePlayMode: function () {
            const self = this;
            self.useM3u8 = !self.useM3u8;
            localStorage.setItem("mp4UseM3u8", self.useM3u8+"");
            self.refreshVideo();
        },
        openNewVideo: function () {
            const self = this;
            window.open(self.selectMp4.url);
        },
        rotateVideo: function () {
            const self = this;
            self.rotateDeg = (self.rotateDeg + 90) % 360;
            const video = document.getElementById('mp4Video');
            video.style.transform = `rotate(${self.rotateDeg}deg)`;
        },
        playVideo: function (url) {
            const self = this;
            self.$nextTick(function () {
                self.currentDuration = 0;
                self.rotateDeg = 0;
                const videoElement = document.getElementById('mp4Video');
                videoElement.style.transform = "rotate(0deg)";
                videoElement.playsInline = true;
                if (self.hls) {
                    self.hls.destroy();
                    self.hls = null;
                }
                let playUrl = url;
                if (self.useM3u8 && self.selectMp4.m3u8) {
                    playUrl = "https://publices.ttjkbx.com" +self.selectMp4.m3u8;
                }
                playUrl = self.playSource === "https" ? playUrl.replace("http:", "https:") : playUrl.replace("https:", "http:");
                
                if (self.useM3u8 && Hls.isSupported()) {
                    self.hls = new Hls();
                    self.hls.loadSource(playUrl);
                    self.hls.attachMedia(videoElement);
                    self.hls.on(Hls.Events.MANIFEST_PARSED, function () {
                        videoElement.addEventListener('loadedmetadata', () => {
                            self.currentDuration = videoElement.duration;
                            videoElement.currentTime = videoElement.duration / 3;
                        });
                        videoElement.addEventListener('playing', () => {
                            videoElement.playbackRate = 1.5;
                        });
                        videoElement.play();
                    });
                } else {
                    videoElement.src = playUrl;
                    videoElement.addEventListener('loadedmetadata', () => {
                        self.currentDuration = videoElement.duration;
                        videoElement.currentTime = videoElement.duration / 3;
                    });
                    videoElement.addEventListener('playing', () => {
                        videoElement.playbackRate = 1.5;
                    });
                    videoElement.load();
                    videoElement.play();
                }
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
        initPaths: function (callback) {
            const self = this;
            Http.sendGet("/mp4/getAllCountAndPath", function (data) {
                self.paths = data.data || [];
                callback();
            });
        },
        refreshVideo: function () {
            const self = this;
            if (self.hls) {
                self.hls.destroy();
                self.hls = null;
            }
            self.closeVideo();
            self.showFirst();
        },
        closeVideo: function () {
            const self = this;
            self.selectMp4 = {};
            const videoElement = document.getElementById('mp4Video');
            if (videoElement) {
                videoElement.src = "";
            }
        },
        updateDuration: function () {
            const self = this;
            Http.sendGet("/mp4/updateDuration?id=" + self.selectMp4._id + "&duration=" + self.currentDuration, function (data) {
                self.currentDuration = -1;
            }, true);
        },
        updateLike: function (item, flag, fresh) {
            const self = this;
            Http.sendGet("/mp4/updateLike?id=" + item._id + "&flag=" + flag + "&duration=" + self.currentDuration, function (data) {
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
                self.closeVideo();
                if (fresh !== "noFresh") {
                    if (self.list.length > 0) {
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
            if (self.list.length > 0 && self.list[self.list.length - 1]) {
                self.$nextTick(function () {
                    self.selectMp4 = self.list[self.list.length - 1];
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
                } else {
                    document.getElementById(id).src = item.img;
                }
            }).catch((e) => {
                document.getElementById(id).src = item.img;
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
            Http.sendGet("/mp4/pageShowList?page=" + ++self.page + "&showLike=" + self.isShowLike + "&path=" + self.path + "&sort="+self.sort, function (data) {
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
        formatDuration: function (time) {
            if (!time) {
                return "";
            }
            let seconds = parseInt(time);
            if (seconds === 0) {
                return "0";
            }
            if (seconds === -1) {
                return "-1";
            }
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = seconds % 60;
            return `${h}:${m < 10 ? ("0" + m) : m}:${s < 10 ? ("0" + s) : s}`;
        }
    },
    filters: {

    },
}
</script>

<style scoped>
.mp4 {
    position: relative;
    height: 100%;
    width: 100%;
}

.mp4 .header {
    background-color: #ccc;
    color: #111;
    text-align: center;
    left: 0;
    right: 0;
    border-bottom: 1px solid #bbb;
    position: fixed;
    top: 0;
    min-height: calc(56px + env(safe-area-inset-top, 0));
    padding-top: env(safe-area-inset-top, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
    z-index: 10;
}

.list-toolbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    min-height: 56px;
}

.path-select {
    flex: 1;
    min-width: 0;
    min-height: 44px;
}

.toolbar-hit {
    flex-shrink: 0;
    min-height: 44px;
    padding: 8px 10px;
    background: #e5e7eb;
    border: 1px solid #9ca3af;
}

.mp4 .footer {
    background-color: #ccc;
    color: #111;
    text-align: center;
    left: 0;
    right: 0;
    border-top: 1px solid #bbb;
    position: fixed;
    bottom: 0;
    min-height: calc(56px + env(safe-area-inset-bottom, 0));
    padding: 6px 8px;
    padding-bottom: calc(6px + env(safe-area-inset-bottom, 0));
    padding-left: calc(8px + env(safe-area-inset-left, 0));
    padding-right: calc(8px + env(safe-area-inset-right, 0));
}

.list-footer {
    display: flex;
}

.footer-btn {
    width: 100%;
    min-height: 44px;
}

.mp4 .content {
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

.detail {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
}

.detail-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
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

.close-btn {
    flex: 1;
    min-height: 44px;
    color: #1d4ed8;
    font-weight: 600;
    background: #eff6ff;
    border-color: #93c5fd;
}

.detail-body {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: calc(60px + env(safe-area-inset-top, 0)) 8px calc(140px + env(safe-area-inset-bottom, 0));
}

.meta {
    padding: 8px;
    background: #f8fafc;
    border-radius: 8px;
    margin-bottom: 8px;
}

.meta-title {
    font-size: 14px;
    font-weight: 600;
    word-break: break-all;
}

.meta-extra {
    margin-top: 6px;
    font-size: 12px;
    color: #64748b;
    word-break: break-all;
}

.meta-tip {
    margin-top: 4px;
    font-size: 12px;
    color: #2563eb;
}

.play-mode-row {
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
}

.play-mode-row button {
    flex: 1;
    min-height: 44px;
    font-size: 13px;
    padding: 8px 6px;
}

.cover-wrap {
    width: 100%;
    height: 18vh;
    background: #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
}

.detail-video {
    width: 100%;
    height: auto;
    max-height: 45vh;
    margin-top: 10px;
    background: #000;
}

.tag-item {
    border: 1px solid #3b82f6;
    padding: 8px;
    margin-top: 6px;
    border-radius: 6px;
    font-size: 13px;
}

.detail-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    background: #fff;
    border-top: 1px solid #ddd;
    padding: 8px;
    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0));
    padding-left: calc(8px + env(safe-area-inset-left, 0));
    padding-right: calc(8px + env(safe-area-inset-right, 0));
}

.action-primary,
.action-secondary {
    display: flex;
    gap: 6px;
}

.action-primary {
    margin-bottom: 6px;
}

.action-primary button,
.action-secondary button {
    flex: 1;
    min-height: 44px;
    font-size: 13px;
    padding: 8px 4px;
}

.best-btn {
    background: #fef3c7;
    border-color: #f59e0b;
    font-weight: 600;
}
</style>