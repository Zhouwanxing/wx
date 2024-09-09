import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
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
            },
        }
    }
})
