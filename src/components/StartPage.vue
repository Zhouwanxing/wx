<template>
    <div class="start-page">
        <!-- 背景渐变 -->
        <div class="bg-gradient"></div>

        <div class="container">
            <!-- 毛玻璃卡片 -->
            <div class="glass-card">
                <div class="grid">
                    <!-- 金价 -->
                    <button class="btn" v-if="roles.includes('gold')" @click="toGold('gold')">
                        <span class="icon">💰</span>
                        <span class="text">金价</span>
                    </button>
                    <button class="btn" v-if="roles.includes('gold')" @click="toGold('newGold')">
                        <span class="icon">✨</span>
                        <span class="text">新金价</span>
                    </button>

                    <!-- 房产 -->
                    <button class="btn" v-if="roles.includes('tangyue')" @click="toGold('tangyue')">
                        <span class="icon">🏠</span>
                        <span class="text">房价</span>
                    </button>
                    <button class="btn" v-if="roles.includes('tangyue')" @click="toGold('erPage')">
                        <span class="icon">🏢</span>
                        <span class="text">二手房</span>
                    </button>
                    <button class="btn" v-if="roles.includes('tangyue')" @click="toGold('chengjiao')">
                        <span class="icon">📊</span>
                        <span class="text">成交</span>
                    </button>
                    <button class="btn" v-if="roles.includes('tangyue')" @click="toGold('fdjsq')">
                        <span class="icon">🧮</span>
                        <span class="text">计算器</span>
                    </button>

                    <!-- 媒体 -->
                    <button class="btn" v-if="roles.includes('mp4')" @click="toGold('mp4')">
                        <span class="icon">🎬</span>
                        <span class="text">视频</span>
                    </button>
                    <button class="btn" v-if="roles.includes('mp4')" @click="toGold('collect')">
                        <span class="icon">⭐</span>
                        <span class="text">收藏</span>
                    </button>

                    <!-- 工具 -->
                    <button class="btn" v-if="roles.includes('url')" @click="toGold('url')">
                        <span class="icon">🔗</span>
                        <span class="text">地址</span>
                    </button>
                    <button class="btn" v-if="roles.includes('auto')" @click="toGold('auto')">
                        <span class="icon">⏰</span>
                        <span class="text">打卡</span>
                    </button>
                </div>
            </div>

            <!-- 退出按钮 -->
            <button class="logout-btn" @click="loginOut">
                <span class="icon">🚪</span>
                <span class="text">退出</span>
            </button>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import Cache from "../js/Cache.js";

export default {
    name: "StartPage",
    data() {
        return {
            roles: []
        }
    },
    mounted() {
        setTimeout(() => {
            this.checkLogin();
        }, 1);
    },
    methods: {
        checkLogin() {
            Http.sendGet("/user/isLogin", (data) => {
                if (data.code === 200) {
                    Cache.roles = data.data?.roles || [];
                    this.roles = Cache.roles || [];
                } else {
                    this.$router.replace({path: "/"});
                }
            });
        },
        toGold(page) {
            this.$router.push({path: '/' + page});
        },
        loginOut() {
            Http.sendGet("/user/logout", () => {
                localStorage.removeItem("tokenName");
                localStorage.removeItem("tokenValue");
                window.location.href = "./";
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

.start-page {
    height: 100vh;
    height: 100dvh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    padding: 24px 20px;
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
}

/* 毛玻璃卡片 */
.glass-card {
    flex: 1;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 1px solid rgba(0, 255, 255, 0.3);
    box-shadow:
        0 8px 32px rgba(0, 255, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        0 0 20px rgba(0, 255, 255, 0.2);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* 网格 - flex布局自动居中 */
.grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    padding: 4px;
}

.grid .btn {
    flex: 0 0 calc(33.333% - 8px);
    max-width: 120px;
    aspect-ratio: 1;
}

/* 毛玻璃按钮 */
.btn {
    aspect-ratio: 1;
    border: none;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.3) 0%, rgba(255, 0, 255, 0.3) 100%);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 255, 0.4);
    box-shadow:
        0 4px 12px rgba(0, 255, 255, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        0 0 15px rgba(0, 255, 255, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.25s ease;
    padding: 8px;
}

.btn:hover {
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.5) 0%, rgba(255, 0, 255, 0.5) 100%);
    transform: translateY(-2px);
    box-shadow:
        0 6px 16px rgba(0, 255, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.5),
        0 0 25px rgba(0, 255, 255, 0.3);
}

.btn:active {
    transform: translateY(0) scale(0.96);
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(255, 0, 255, 0.2) 100%);
}

.icon {
    font-size: 26px;
    line-height: 1;
    filter: drop-shadow(0 1px 2px rgba(0, 255, 255, 0.3));
}

.text {
    font-size: 12px;
    font-weight: 600;
    color: #00ffff;
    text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
}

/* 退出按钮 */
.logout-btn {
    margin-top: 16px;
    padding: 14px 24px;
    border-radius: 12px;
    border: 1px solid rgba(255, 215, 0, 0.5);
    background: rgba(255, 215, 0, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.15), 0 0 20px rgba(255, 215, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    flex-shrink: 0;
}

.logout-btn:hover {
    background: rgba(255, 215, 0, 0.35);
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(255, 215, 0.3);
}

.logout-btn:active {
    transform: translateY(0) scale(0.98);
}

.logout-btn .icon {
    font-size: 20px;
}

.logout-btn .text {
    font-size: 14px;
    font-weight: 600;
    color: #ffd700;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

/* iPad 适配 */
@media (min-width: 768px) {
    .container {
        max-width: 600px;
        padding: 32px 28px;
    }

    .glass-card {
        padding: 28px;
        border-radius: 28px;
    }

    .grid {
        gap: 16px;
    }

    .btn {
        border-radius: 20px;
    }

    .icon {
        font-size: 32px;
    }

    .text {
        font-size: 14px;
    }
}

/* iPhone 12/13/14 Pro Max */
@media (min-width: 390px) and (max-width: 428px) {
    .glass-card {
        padding: 24px;
    }

    .icon {
        font-size: 28px;
    }

    .text {
        font-size: 13px;
    }
}

/* 小屏手机 */
@media (max-width: 360px) {
    .container {
        padding: 16px 14px;
    }

    .glass-card {
        padding: 16px;
        border-radius: 20px;
    }

    .grid {
        gap: 10px;
    }

    .btn {
        border-radius: 14px;
    }

    .icon {
        font-size: 22px;
    }

    .text {
        font-size: 11px;
    }
}
</style>