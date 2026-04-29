<template>
    <div class="login-page" v-if="showLogin">
        <!-- 背景渐变 -->
        <div class="bg-gradient"></div>

        <div class="container">
            <!-- 毛玻璃卡片 -->
            <div class="glass-card">
                <div style="text-align: center; margin-bottom: 24px;">
                    <img src="/Jerry.svg" width="72px" alt="logo" class="logo-img"/>
                </div>

                <div class="form-group">
                    <input v-model.trim="formData.username" placeholder="请输入用户名" class="glass-input"/>
                </div>
                <div class="form-group">
                    <input v-model.trim="formData.password" placeholder="请输入密码" type="password" class="glass-input"/>
                </div>

                <!-- 主机选择 -->
                <div class="radio-group">
                    <div v-for="(one,index) in host" :key="index" class="radio-item">
                        <input type="radio" name="repayType" v-model="selectHost" :value="one.id" @change="radioChange" class="glass-radio"/>
                        <label>{{ one.id }}({{ (one.key.split('/')[2] || "").split(":")[0] }})</label>
                    </div>
                </div>

                <div class="form-group">
                    <button @click="login" class="primary-btn">
                        <span class="icon">🔐</span>
                        <span class="text">登录</span>
                    </button>
                </div>
            </div>

            <!-- 随机数按钮 -->
            <button class="secondary-btn" @click="toOther('./r.html')">
                <span class="icon">🎲</span>
                <span class="text">随机数</span>
            </button>
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
        toOther: function (route) {
            window.open(route);
        },
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
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.login-page {
    min-height: 100vh;
    min-height: 100dvh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-family: 'Arial', sans-serif;
}

/* 渐变背景 */
.bg-gradient {
    position: fixed;
    inset: 0;
    background:
        radial-gradient(circle at 20% 30%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 60%),
        linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    z-index: 0;
}

.container {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px 20px;
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
}

/* 毛玻璃卡片 */
.glass-card {
    width: 100%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    padding: 32px 28px;
}

.logo-img {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.form-group {
    margin-bottom: 16px;
}

/* 毛玻璃输入框 */
.glass-input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: rgba(255, 255, 255, 0.95);
    font-size: 14px;
    transition: all 0.25s ease;
}

.glass-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.glass-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.35);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

/* 单选组 */
.radio-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

.radio-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 8px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
}

.radio-item label {
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    margin-left: 8px;
    cursor: pointer;
}

.glass-radio {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: rgba(99, 102, 241, 0.8);
}

/* 主按钮 */
.primary-btn {
    width: 100%;
    padding: 14px 24px;
    border: none;
    border-radius: 12px;
    background: rgba(99, 102, 241, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    color: white;
}

.primary-btn:hover {
    background: rgba(99, 102, 241, 0.75);
    transform: translateY(-2px);
    box-shadow:
        0 6px 16px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.primary-btn:active {
    transform: translateY(0) scale(0.98);
}

/* 次要按钮 */
.secondary-btn {
    margin-top: 16px;
    padding: 14px 24px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    flex-shrink: 0;
    color: white;
    font-size: 14px;
}

.secondary-btn:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: translateY(-2px);
}

.secondary-btn:active {
    transform: translateY(0) scale(0.98);
}

.icon {
    font-size: 18px;
    line-height: 1;
}

.text {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
}

/* 响应式适配 */
@media (max-width: 360px) {
    .container {
        padding: 16px 14px;
    }

    .glass-card {
        padding: 24px 20px;
        border-radius: 20px;
    }

    .glass-input {
        padding: 12px 14px;
        font-size: 13px;
    }
}

@media (min-width: 768px) {
    .container {
        max-width: 440px;
    }

    .glass-card {
        padding: 40px 36px;
    }

    .logo-img {
        width: 80px;
    }
}
</style>