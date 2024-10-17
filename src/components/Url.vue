<template>
    <div class="url">
        <div style="height: 40px; text-align: center; background-color: #ccc; border-radius: 10px; line-height: 40px;"
             @click.stop="getUrls()">
            刷新
        </div>
        <div style="padding: 10px;">
            <table border="1" cellspacing="0" style="margin-left: auto; margin-right: auto;">
                <tr>
                    <td>/</td>
                    <td>地址</td>
                    <td>操作</td>
                </tr>
                <tr v-for="(item,index) in showUrls" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item }}</td>
                    <td>
                        <button @click="deleteUrl(item)">删除</button>
                    </td>
                </tr>
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
            showUrls: []
        };
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.getUrls();
        }, 1);
    },
    methods: {
        getUrls: function () {
            const self = this;
            Http.sendPost("/mp4/getUrls", {}, function (res) {
                self.showUrls = res.data || [];
            });
        },
        deleteUrl: function (url) {
            const self = this;
            Http.sendPost("/mp4/deleteUrl", {url: url}, function (res) {
                self.showUrls = res.data || [];
            });
        }
    }
}
</script>