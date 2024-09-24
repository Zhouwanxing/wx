<template>
    <div class="init-page">
        <input v-model="formData.url" placeholder="请输入" style=""/>
        <div style="margin-top: 20px;">
            <button @click="saveData">保存</button>
        </div>


        <div>
            <input v-model="checkKey" placeholder="请输入" style=""/>
            <div style="margin-top: 20px;">
                <button @click="getUrls">获取</button>
            </div>
        </div>
        <div v-for="(item,index) in showUrls" :key="index">
            {{index}}={{item}}
        </div>
    </div>
</template>

<script>
export default {
    name: "InitData",
    data() {
        return {
            formData: {
                url: ""
            },
            checkKey: "",
            showUrls: []
        };
    },
    methods: {
        saveData: function () {
            this.$http.post(import.meta.env.VITE_BASE_URL + "/initData", this.formData).then((response) => {
                console.log(response);
            });
        },
        getUrls: function () {
            this.$http.post(import.meta.env.VITE_BASE_URL + "/getUrls", {key: this.checkKey}).then((response) => {
                this.showUrls = response.urls || [];
            });
        },
    }
}
</script>
<style>
.init-page {
    padding-top: 10px;
    text-align: center;
}
</style>