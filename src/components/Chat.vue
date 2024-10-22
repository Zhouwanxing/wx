<template>
    <div class="chat">
        <div class="top-container">
            <div class="user-item" v-for="(item,index) in onlineUser" :class="{'select-user':selectUser === item}"
                 :key="index" @click.stop="selectUser = item;">
                {{ item.substring(0, 7) }}
            </div>
        </div>

        <div>
            <div v-for="(item,index) in currentMessages" :key="index">
                {{ item.message }}
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "Chat",
    data() {
        return {
            socketObj: null,
            onlineUser: [],
            selectUser: "",
            currentId: "zwx",
            allMessage: []
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.initWs();
        }, 1);
    },
    computed: {
        currentMessages: function () {
            const self = this;
            return self.allMessage.filter(item => [item.from, item.to].includes(self.selectUser));
        }
    },
    methods: {
        initWs() {
            const self = this;
            if (self.socketObj !== null) {
                self.socketObj.close();
            }
            self.socketObj = new WebSocket(import.meta.env.VITE_WS_URL + "/ws/" + self.currentId);

            self.socketObj.addEventListener('open', function (event) {
                console.log('WebSocket连接已打开');
                // socket.send('Hello Server!');
            });

            self.socketObj.addEventListener('message', function (event) {
                self.handleNewMessage(event.data);
            });

            self.socketObj.addEventListener('error', function (event) {
                console.error('WebSocket发生错误: ', event);
            });

            self.socketObj.addEventListener('close', function (event) {
                console.log('WebSocket连接已关闭');
            });
        },
        handleNewMessage: function (newMessage) {
            const self = this;
            try {
                let parse = JSON.parse(newMessage);
                switch (parse.type) {
                    case "onlineUser":
                        self.onlineUser = parse.message.split(",").filter(item => item !== self.currentId);
                        break;
                    case "newMessage":
                        self.allMessage.push(parse);
                        break;
                    default:
                        break;
                }
            } catch (e) {
                console.log('收到消息: ', newMessage);
            }
        },
        closeSocket: function () {
            const self = this;
            if (self.socketObj) {
                self.socketObj.close();
            }
        }
    },

}
</script>

<style scoped>
.top-container {
    display: flex;
    overflow-x: auto; /* 允许横向滚动 */
    white-space: nowrap; /* 防止子元素换行 */
    padding: 5px 0;
    border-bottom: 1px solid #ccc;
    width: 100%; /* 父容器宽度 */
}

.user-item {
    flex: 0 0 auto; /* 防止子元素伸缩 */
    margin-right: 10px; /* 子元素之间的间距 */
    padding: 20px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 25px;
    white-space: normal; /* 子元素内部允许换行 */
}

.select-user {
    border: 1px solid #f0c040;
}
</style>