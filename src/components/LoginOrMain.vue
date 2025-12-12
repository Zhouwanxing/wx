<template>
    <div class="login-container" v-if="showLogin">
        <div style="text-align: center;margin: 10px;">
            <img src="/Jerry.svg" width="60px" alt="1"/>
        </div>
        <div class="form-group">
            <input v-model.trim="formData.username" placeholder="请输入用户名"/>
        </div>
        <div class="form-group">
            <input v-model.trim="formData.password" placeholder="请输入密码" type="password"/>
        </div>
        <div class="radio-group">
            <div v-for="(one,index) in host" :key="index" class="radio-item">
                <input type="radio" name="repayType" v-model="selectHost" :value="one.id" @change="radioChange"/>
                <label>{{ one.id }}({{ (one.key.split('/')[2] || "").split(":")[0] }})</label>
            </div>
        </div>
        <div class="form-group">
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
            showLogin: false,
            host: [],
            selectHost:""
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.formData.username = localStorage.getItem("username") || "";
            self.checkLogin();
        }, 1);
    },
    methods: {
        radioChange: function () {
            const self = this;
            let find = self.host.find((one) => one.id === self.selectHost);
            if (find) {
                Http.currentHost = find.key;
            }
        },
        checkLogin: function () {
            const self = this;
            Http.sendGet("/user/isLogin", function (data) {
                if (data.code === 200) {
                    self.toMain(data);
                    return;
                }
                if (data.data) {
                    self.host = data.data;
                }
                self.host.push({id: "云", key: import.meta.env.VITE_BASE_URL});
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
            if (!self.formData.username || !self.formData.password) {
                return;
            }
            Http.sendGet(`/user/login?username=${self.formData.username}&password=${self.formData.password}`, function (data) {
                if (data.code !== 200) {
                    self.alertMessage = "用户名/密码错误";
                    self.showAlert = true;
                    return;
                }
                localStorage.setItem("username", self.formData.username);
                self.toMain(data);
            });
        },
    }
}
</script>

<style scoped>
body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #74b9ff, #ff7777);
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

input:focus {
    outline: 2px solid #ccc; /* 自定义焦点轮廓样式 */
}

.login-container {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
}

.form-group button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #74b9ff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
}

.form-group button:hover {
    background-color: #5a98fb;
}

.form-group a {
    display: block;
    text-align: center;
    margin-top: 10px;
    color: #74b9ff;
    text-decoration: none;
}

.form-group a:hover {
    text-decoration: underline;
}

@media (max-width: 480px) {
    .login-container {
        border-radius: 0;
        box-shadow: none;
    }
}

.login-container .radio-group {
    display: flex;
    flex-direction: column;
}

.login-container .radio-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.login-container .radio-item input[type="radio"] {
    margin-right: 8px;
}
</style>