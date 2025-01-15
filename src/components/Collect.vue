<template>
    <div class="collect">
        <div class="header">
            <div style="display: flex;height: 50px;text-align: center;position: fixed;top: 0;width: 100vw;">
                <div style="flex: 2;border-right: 1px solid blue;">
                    <select v-model="formData.path" @change="list = [];formData.page = 1;searchPath()"
                            style="height: 30px;border: 1px solid #ccc;margin: 8px">
                        <option :value="''">请选择</option>
                        <option v-for="item in paths" :value="item">{{ item }}</option>
                    </select>
                </div>
                <div style="flex: 1;border-right: 1px solid blue;display: flex;justify-content: center;align-items: center;  ">
                    <input type="checkbox" v-model="formData.isShowBest"
                           @change="list = [];formData.page = 1;searchPath()"/>
                </div>
                <div style="flex: 1;line-height: 50px;height: 50px;"
                     @click="formData.page = 1;searchPath();">
                    {{ count }}
                </div>
            </div>
        </div>
        <div class="content" @scroll="handleScroll">
            <div v-for="(item) in list" :key="item._id" class="one-mp4">
                <div style="padding: 10px;">{{ item.name || item.date }}</div>
                <div class="img-div" @click="clickImg(item)" style="">
                    <img style="width: 100%;height: 100%;" :id="item._id" alt=""/>
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
                path: "",
                page: 1,
                isShowBest: true
            },
            paths: [],
            list: [],
            showLoad: true,
            count: 0,
            loadImg: false
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.getAllPath();
        }, 1);
    },
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
        clickImg: function (item) {
            window.open("./video.html?url=" + item.url);
        },
        searchPath: function () {
            const self = this;
            Http.sendPost("/mp4/getLikeList", self.formData, function (data) {
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