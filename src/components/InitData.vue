<template>
    <div class="init-page">
        <input v-model.trim="formData.url" placeholder="请输入网站地址" style="width: 80%;"/>
        <div style="margin-top: 10px;">
            <button @click="saveData">保存</button>
        </div>

        <input v-model.trim="devName" placeholder="请输入设备名称" style="width: 80%;"/>
        <div style="margin-top: 10px;">
            <button @click="saveDevName">保存</button>
        </div>


        <div style="margin-top: 10px;">
            <input v-model.trim="checkKey" placeholder="请输入获取密钥" style="width: 80%;"/>
            <div style="margin-top: 20px;">
                <button @click="getUrls">获取</button>
            </div>
        </div>
        <div style="margin-top: 10px;">
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

        <alert v-if="showAlert" :visible="showAlert" :message="alertMessage" @close="showAlert = false"></alert>
    </div>
</template>

<script>
import Alert from "./common/Alert.vue";
import Http from "../js/Http.js";

export default {
    name: "InitData",
    components: {Alert},
    data() {
        return {
            formData: {
                url: ""
            },
            checkKey: "",
            showUrls: [],
            showAlert: false,
            alertMessage: "",
            devName: ""
        };
    },
    methods: {
        saveDevName: function () {
            localStorage.setItem('zwx-dev-name', this.devName);
        },
        saveData: function () {
            const self = this;
            Http.sendPost("/initData", self.formData, function (res) {
                if (res.error) {
                    self.alertMessage = "保存失败";
                    self.showAlert = true;
                    return;
                }
                self.formData.url = "";
                self.alertMessage = "保存成功";
                self.showAlert = true;
            });
        },
        getUrls: function () {
            const self = this;
            Http.sendPost("/getUrls", {key: self.checkKey}, function (res) {
                self.showUrls = res.urls || [];
            });
        },
        deleteUrl: function (url) {
            const self = this;
            Http.sendPost("/deleteUrl", {url: url}, function (res) {
                self.showUrls = res.urls || [];
            });
        }
    }
}
</script>
<style>
.init-page {
    padding-top: 10px;
    text-align: center;
}
</style>