<template>
    <div class="collect" style="background-color: #ccc; border-radius: 20px;">
        <div style="display: flex;height: 50px;text-align: center;">
            <div style="flex: 3;border-right: 1px solid blue;">
                <select v-model="formData.path" @change="list = [];formData.page = 1;searchPath()"
                        style="height: 30px;border: 1px solid #ccc;margin: 8px">
                    <option :value="''">请选择</option>
                    <option v-for="item in paths" :value="item">{{ item }}</option>
                </select>
            </div>
            <div style="flex: 1;line-height: 50px;height: 50px;border-right: 1px solid blue;">
                {{ count }}
            </div>
            <div style="flex: 2;">
                <div style="text-align: center;padding: 10px;color: blue;height: 30px;line-height: 30px;"
                     @click="formData.page++;searchPath();"
                     v-if="showLoad">加载更多
                </div>
            </div>
        </div>

        <div style="overflow-y: auto; max-height: calc(100vh - 120px);">
            <div v-for="(item) in list" :key="item._id" class="one-mp4">
                <div style="padding: 10px;">{{ item.name || item.date }}</div>
                <div class="img-div" @click="clickImg(item)" style="padding-bottom: 10px;">
                    <img :src="item.img" style="width: 100%;height: 100%;" alt=""/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";

export default {
    name: "Collect",
    data() {
        return {
            formData: {
                path: "",
                page: 1
            },
            paths: [],
            list: [],
            showLoad: true,
            count: 0
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.getAllPath();
        }, 1);
    },
    methods: {
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