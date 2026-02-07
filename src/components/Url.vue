<template>
    <div class="url">
<!--        <div style="width: 80%;padding: 10px;">
            <input v-model.trim="url" placeholder="请输入网站地址" style="width: 100%;"/>
        </div>-->
        <div style="display: flex;height: 40px;text-align: center;">
<!--            <div style="flex: 1;line-height: 40px;background-color: #ccc;border-radius: 10px;"
                 @click.stop="saveUrl()">
                保存
            </div>-->
            <div style="flex: 1;line-height: 40px;background-color: #ccc;border-radius: 10px;"
                 @click.stop="getNewUrl">刷新
            </div>
        </div>
        <div style="display: flex;height: 40px;text-align: center; margin-top: 5px;">
            <div style="flex: 1;line-height: 40px;background-color: #ccc;border-radius: 10px;"
                 @click.stop="restart(1)">重启1次
            </div>
            <div style="flex: 1;line-height: 40px;background-color: #ccc;border-radius: 10px;"
                 @click.stop="restart(10)">重启10次
            </div>
            <div style="flex: 1;line-height: 40px;background-color: #ccc;border-radius: 10px;"
                 @click.stop="restart(0)">重置
            </div>
        </div>

        <div style="padding: 10px;">
            <table border="1" cellspacing="0" style="margin-left: auto; margin-right: auto;">
                <thead>
                    <tr>
                        <td>/</td>
                        <td>地址</td>
                        <td>操作</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in showUrls" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item }}</td>
                        <td>
                            <button @click="openUrl(item)">打开</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";

export default {
    name: "Url",
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