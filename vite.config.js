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
                    video: path.resolve(__dirname, "./video.html")
                },
            }
        }
    }
})
