<template>
    <div class="start-page">
        <div style="margin-top: 20px;text-align: center; " v-if="roles.includes('gold')">
            <button @click="toGold('gold')">金价</button>
        </div>
        <div style="margin-top: 20px;text-align: center; " v-if="roles.includes('gold')">
            <button @click="toGold('newGold')">新金价</button>
        </div>
        <div style="margin-top: 20px;text-align: center; " v-if="roles.includes('mp4')">
            <button @click="toGold('mp4')">视频</button>
        </div>
        <div style="margin-top: 20px;text-align: center; " v-if="roles.includes('mp4')">
            <button @click="toGold('collect')">收藏</button>
        </div>
        <div style="margin-top: 20px;text-align: center; " v-if="roles.includes('url')">
            <button @click="toGold('url')">地址</button>
        </div>

        <div style="margin-top: 20px;text-align: center; ">
            <button @click="loginOut">退出</button>
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
            // Http.sendGet("/user/isLogin", function (data) {
            //     if (data.code === 200) {
            self.roles = Cache.roles || [];
            // } else {
            //     self.$router.replace({path: "/"});
            // }
            // });
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
.start-page button {
    width: 150px;
    /*background-image: linear-gradient(45deg, #f06d06, #f0c040);*/
    background-image: linear-gradient(45deg, #483e34, #f7f4eb);
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    transition: background-image 0.2s ease-in-out;
    border-radius: 15px;
}

.start-page button:hover {
    /*background-image: linear-gradient(45deg, #f08c06, #f0d040);*/
}
</style>