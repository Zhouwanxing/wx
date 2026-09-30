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
                    index: path.resolve(__dirname, "./index.html"),
                    zwx: path.resolve(__dirname, "./zwx.html"),
                    l: path.resolve(__dirname, "./l.html"),
                    mp4: path.resolve(__dirname, "./mp4.html"),
                    s: path.resolve(__dirname, "./s.html"),
                    c: path.resolve(__dirname, "./c.html"),
                    video: path.resolve(__dirname, "./video.html"),
                    v2: path.resolve(__dirname, "./v2.html"),
                    caller: path.resolve(__dirname, "./caller.html"),
                    callee: path.resolve(__dirname, "./callee.html"),
                    mfa: path.resolve(__dirname, "./mfa.html"),
                    f: path.resolve(__dirname, "./f.html"),
                    r: path.resolve(__dirname, "./r.html"),
                    o: path.resolve(__dirname, "./o.html"),
                    f1: path.resolve(__dirname, "./f1.html"),
                    m: path.resolve(__dirname, "./m.html"),
                    marble: path.resolve(__dirname, "./marble.html"),
                    loop: path.resolve(__dirname, "./loop.html"),
                    pipes: path.resolve(__dirname, "./pipes.html"),
                    tetris: path.resolve(__dirname, "./tetris.html"),
                    snake: path.resolve(__dirname, "./snake.html"),
                    sokoban: path.resolve(__dirname, "./sokoban.html"),
                    memory: path.resolve(__dirname, "./memory.html"),
                    gomoku: path.resolve(__dirname, "./gomoku.html"),
                    minesweeper: path.resolve(__dirname, "./minesweeper.html"),
                    blocks: path.resolve(__dirname, "./blocks.html"),
                    checkers: path.resolve(__dirname, "./checkers.html"),
                    flow: path.resolve(__dirname, "./flow.html"),
                    mole: path.resolve(__dirname, "./mole.html"),
                    bulls: path.resolve(__dirname, "./bulls.html"),
                    matrix: path.resolve(__dirname, "./matrix.html"),
                    twenty48: path.resolve(__dirname, "./twenty48.html"),
                    lights: path.resolve(__dirname, "./lights.html")
                },
            }
        }
    }
})
