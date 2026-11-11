import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import compress from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
    const env = loadEnv(mode, process.cwd(), '')
    console.log(env);
    return {
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV),
        },
        plugins: [vue(), compress()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src/')
            }
        },
        build: {
            minify: false,
            rollupOptions: {
                // 配置多个入口文件
                input: {
                    // 指定有多个入口html文件
                    // 主入口 - Never 应用主页
                    index: path.resolve(__dirname, "./index.html"),
                    // 测试页面 - URL 参数展示
                    zwx: path.resolve(__dirname, "./zwx.html"),
                    // 图片轮播 - 自动轮播展示
                    l: path.resolve(__dirname, "./l.html"),
                    // MP4 播放器 - 视频播放与标记
                    mp4: path.resolve(__dirname, "./mp4.html"),
                    // iPhone 静态页 - 固定头尾布局
                    s: path.resolve(__dirname, "./s.html"),
                    // 贷款还款计算器 - 等额本息/本金计算
                    c: path.resolve(__dirname, "./c.html"),
                    // 视频播放 - 协议切换
                    video: path.resolve(__dirname, "./video.html"),
                    // 视频播放 V2 - 带标记功能
                    v2: path.resolve(__dirname, "./v2.html"),
                    // WebRTC 采集端 - MQTT 信令推流
                    caller: path.resolve(__dirname, "./caller.html"),
                    // WebRTC 播放端 - MQTT 信令拉流
                    callee: path.resolve(__dirname, "./callee.html"),
                    // MFA 验证码 - TOTP 动态令牌
                    mfa: path.resolve(__dirname, "./mfa.html"),
                    // 小区房价趋势分析 - 成交数据可视化
                    f: path.resolve(__dirname, "./f.html"),
                    // 随机点数 - 随机数生成器
                    r: path.resolve(__dirname, "./r.html"),
                    // 拉面馆点单 - 菜单选择系统
                    o: path.resolve(__dirname, "./o.html"),
                    // 成交趋势分析 - 多维度数据图表
                    f1: path.resolve(__dirname, "./f1.html"),
                    // M3U8 视频播放 - HLS 流媒体
                    m: path.resolve(__dirname, "./m.html"),
                    // 弹珠游戏 - 物理弹珠机
                    marble: path.resolve(__dirname, "./marble.html"),
                    // 数回游戏 - 逻辑连线谜题
                    loop: path.resolve(__dirname, "./loop.html"),
                    // 水管游戏 - 管道连接谜题
                    pipes: path.resolve(__dirname, "./pipes.html"),
                    // 俄罗斯方块 - 经典方块消除
                    tetris: path.resolve(__dirname, "./tetris.html"),
                    // 贪吃蛇 - 经典蛇形游戏
                    snake: path.resolve(__dirname, "./snake.html"),
                    // 推箱子 - 经典推箱谜题
                    sokoban: path.resolve(__dirname, "./sokoban.html"),
                    // 记忆翻牌 - 卡片配对游戏
                    memory: path.resolve(__dirname, "./memory.html"),
                    // 五子棋 - 人机对战棋类
                    gomoku: path.resolve(__dirname, "./gomoku.html"),
                    // 扫雷 - 经典扫雷游戏
                    minesweeper: path.resolve(__dirname, "./minesweeper.html"),
                    // 方块消除 - 拖拽放置消除
                    blocks: path.resolve(__dirname, "./blocks.html"),
                    // 跳棋 - 六角跳棋游戏
                    checkers: path.resolve(__dirname, "./checkers.html"),
                    // 连线 - 颜色连线谜题
                    flow: path.resolve(__dirname, "./flow.html"),
                    // 打地鼠 - 反应速度游戏
                    mole: path.resolve(__dirname, "./mole.html"),
                    // 1A2B - 猜数字游戏
                    bulls: path.resolve(__dirname, "./bulls.html"),
                    // 记忆矩阵 - 位置记忆游戏
                    matrix: path.resolve(__dirname, "./matrix.html"),
                    // 2048 - 数字合并游戏
                    twenty48: path.resolve(__dirname, "./twenty48.html"),
                    // 关灯 - 灯光切换谜题
                    lights: path.resolve(__dirname, "./lights.html")
                },
            }
        }
    }
})
