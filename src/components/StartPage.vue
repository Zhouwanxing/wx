<template>
    <div class="start-page">
        <div class="card">
            <div class="button-grid">
                <button class="menu-btn" v-if="roles.includes('gold')" @click="toGold('gold')">
                    <span class="icon">💰</span>
                    <span class="label">金价</span>
                </button>
                <button class="menu-btn" v-if="roles.includes('gold')" @click="toGold('newGold')">
                    <span class="icon">✨</span>
                    <span class="label">新金价</span>
                </button>
                <button class="menu-btn" v-if="roles.includes('tangyue')" @click="toGold('tangyue')">
                    <span class="icon">🏠</span>
                    <span class="label">房价</span>
                </button>
                <button class="menu-btn" v-if="roles.includes('tangyue')" @click="toGold('erPage')">
                    <span class="icon">📦</span>
                    <span class="label">二手房</span>
                </button>
                <button class="menu-btn" v-if="roles.includes('tangyue')" @click="toGold('chengjiao')">
                    <span class="icon">📦</span>
                    <span class="label">成交</span>
                </button>
                <button class="menu-btn" v-if="roles.includes('mp4')" @click="toGold('mp4')">
                    <span class="icon">🎬</span>
                    <span class="label">视频</span>
                </button>
                <button class="menu-btn" v-if="roles.includes('mp4')" @click="toGold('collect')">
                    <span class="icon">⭐</span>
                    <span class="label">收藏</span>
                </button>
                <button class="menu-btn" v-if="roles.includes('url')" @click="toGold('url')">
                    <span class="icon">🔗</span>
                    <span class="label">地址</span>
                </button>
                <button class="menu-btn" v-if="roles.includes('auto')" @click="toGold('auto')">
                    <span class="icon">⏰</span>
                    <span class="label">打卡</span>
                </button>
<!--                <button class="menu-btn" v-if="roles.includes('company')" @click="toGold('companyPerson')">
                    <span class="icon">👤</span>
                    <span class="label">记录人员</span>
                </button>-->
                <button class="menu-btn" v-if="roles.includes('tangyue')" @click="toGold('fdjsq')">
                    <span class="icon">🐓</span>
                    <span class="label">房贷计算器</span>
                </button>
                <button class="menu-btn danger" @click="loginOut">
                    <span class="icon">🚪</span>
                    <span class="label">退出</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>

import Http from "../js/Http.js";
import Cache from "../js/Cache.js";

export default {
    name: "StartPage",
    components: {},
    data() {
        return {
            roles: []
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
                    Cache.roles = data.data?.roles || [];
                    self.roles = Cache.roles || [];
                } else {
                    self.$router.replace({path: "/"});
                }
            });
        },
        toGold: function (page) {
            this.$router.push({path: '/' + page});
        },
        loginOut: function () {
            Http.sendGet("/user/logout", function () {
                localStorage.removeItem("tokenName");
                localStorage.removeItem("tokenValue");
                // self.$router.replace({path: "/"});
                window.location.href = "./"
            });
        },
    }
}
</script>
<style scoped>
.start-page {
    height: 100%;
    background: #f8f9fa;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    background: #ffffff;
    padding: 40px 32px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    max-width: 480px;
    width: 100%;
    text-align: center;
}

.title {
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin-bottom: 24px;
}

.button-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
}

.menu-btn {
    background-color: #f1f3f5;
    border: 1px solid #d3dce6;
    color: #333;
    border-radius: 12px;
    width: 110px;
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.menu-btn:hover {
    background-color: #e4e7eb;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
}

.menu-btn .icon {
    font-size: 26px;
    margin-bottom: 6px;
    color: #666;
}

.menu-btn.danger {
    background-color: #fef1f1;
    color: #d9534f;
    border: 1px solid #f5c6cb;
}

.menu-btn.danger:hover {
    background-color: #fae3e3;
}
</style>