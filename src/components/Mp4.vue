<template>
    <div class="mp4">
        <div v-show="!selectMp4._id">
            <div class="header">
                <div style="display: flex;height: 40px;text-align: center;">
                    <div style="flex: 1;border-right: 1px solid blue;">
                        <select v-model="path" style="height: 30px;border: 1px solid #ccc;margin: 8px">
                            <option :value="''">请选择</option>
                            <option v-for="item in paths" :value="item">{{ item }}</option>
                        </select>
                    </div>
                    <div style="flex: 1;line-height: 40px;background-color: #ccc;border-radius: 10px;"
                         @click="page = 0;list = [];getList();">刷新({{ count }})
                    </div>
                </div>
            </div>
            <div class="content" @scroll="handleScroll">
                <div v-for="(item) in list" :key="item._id" class="one-mp4">
                    <div style="padding: 10px;" @click.stop="clickImg(item)">{{ item.name || item.date }}</div>
                    <div class="img-div" @click.stop="clickImg(item)">
                        <img src="" style="width: 100%;height: 100%;" :id="item._id" alt=""/>
                    </div>
                    <div style="padding: 10px;">
                        <button @click.stop="updateLike(item,'delete','noFresh')">不喜欢</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="selectMp4._id">
            <div style="text-align: center;padding: 10px;color: blue;" @click="selectMp4 = {};">关闭({{ count }})</div>
            <div style="padding: 10px;">{{
                    selectMp4.name + "(" + selectMp4.path + ")" + "(" + selectMp4.date + ")"
                }}
            </div>
            <video controls webkit-playsinline playsinline style="width: 100%;height: 60vh;">
                <source :src="selectMp4.name ? selectMp4.url : ''" type="video/mp4">
            </video>
            <div style="display: flex;text-align: center;">
                <div style="flex: 1;">
                    <button @click="updateLike(selectMp4, 'delete')">不喜欢</button>
                </div>
                <div style="flex: 1;">
                    <button @click="refreshVideo">刷新</button>
                </div>
                <div style="flex: 1;">
                    <button @click="updateLike(selectMp4,'good')">收藏</button>
                </div>
                <div style="flex: 1;">
                    <button @click="updateLike(selectMp4,'best')">最爱</button>
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
            path: "",
            loadImg: false
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.initPaths(function () {
                self.getList();
            });
        }, 1);
    },
    watch: {},
    methods: {
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
            Http.sendGet("/mp4/getAllPath", function (data) {
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
                });
            }
        },
        clickImg: function (item) {
            this.selectMp4 = item;
        },
        getList: function (callback) {
            const self = this;
            Http.sendGet("/mp4/pageShowList?page=" + ++self.page + "&showLike=" + self.isShowLike + "&path=" + self.path, function (data) {
                if (data.code !== 200) {
                    return;
                }
                self.list = self.list.concat(data.list);
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