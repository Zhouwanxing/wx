<template>
    <div class="login" v-if="showLogin">
        <input v-model.trim="formData.username" placeholder="请输入用户名" style="width: 80%;"/>

        <input v-model.trim="formData.password" placeholder="请输入密码" style="width: 80%;"/>
        <div style="margin-top: 10px;">
            <button @click="login">登录</button>
        </div>

        <alert v-if="showAlert" :visible="showAlert" :message="alertMessage" @close="showAlert = false"></alert>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import Cache from "../js/Cache.js";
import Alert from "./common/Alert.vue";

export default {
    name: "LoginOrMain",
    components: {Alert},
    data() {
        return {
            formData: {
                username: "",
                password: ""
            },
            showAlert: false,
            alertMessage: "",
            showLogin: false
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.checkLogin();
        }, 1);
    },
    methods: {
        checkLogin: function () {
            const self = this;
            Http.sendGet("/user/isLogin", function (data) {
                if (data.code === 200) {
                    self.toMain(data);
                    return;
                }
                self.showLogin = true;
            });
        },
        toMain: function (res) {
            const self = this;
            let data = res.data || {};
            Cache.roles = data.roles || [];
            localStorage.setItem("tokenName", data.tokenName);
            localStorage.setItem("tokenValue", data.tokenValue);
            self.$router.replace({path: "/main"});
        },
        login: function () {
            const self = this;
            Http.sendGet(`/user/login?username=${self.formData.username}&password=${self.formData.password}`, function (data) {
                if (data.code !== 200) {
                    self.alertMessage = "用户名/密码错误";
                    self.showAlert = true;
                    return;
                }
                self.toMain(data);
            });
        },
    }
}
</script>

<style scoped>

</style>