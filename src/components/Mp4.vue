<template>
    <div class="mp4" style="background-color: #ccc;padding: 5px; border-radius: 20px;">
        <div v-show="!selectMp4._id">
            <div style="text-align: center;padding: 10px;color: blue;" @click="page = 0;list = [];getList();">刷新</div>
            <div v-for="(item) in list" :key="item._id" class="one-mp4">
                <div style="padding: 10px;">{{ item.name || item.date }}</div>
                <div class="img-div" @click="clickImg(item)">
                    <img :src="item.img" style="width: 100%;height: 100%;" alt=""/>
                </div>
                <div style="padding: 10px;">
                    <button @click="toNotLike(item)">不喜欢</button>
                </div>
            </div>
            <div style="text-align: center;padding: 10px;color: blue;" @click="getList">加载更多</div>
        </div>
        <div v-if="selectMp4._id">
            <div style="text-align: center;padding: 10px;color: blue;" @click="selectMp4 = {};">关闭</div>
            <div style="padding: 10px;">{{ selectMp4.name }}</div>
            <video controls="controls" :src="selectMp4.name ? selectMp4.url : ''"
                   style="width: 100%;height: 100%;"></video>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";

export default {
    name: "Mp4.vue",
    data: function () {
        return {
            page: 0,
            count: 0,
            list: [],
            selectMp4: {},
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.getList();
        }, 1);
    },
    methods: {
        toNotLike: function (item) {
            const self = this;
            Http.sendGet("/mp4/toNotLike?id=" + item._id, function (data) {
                if (data.error) {
                    return;
                }
                let index = self.list.findIndex(function (item2) {
                    return item2._id === item._id;
                });
                if (index !== -1) {
                    self.list.splice(index, 1);
                }
            });
        },
        clickImg: function (item) {
            this.selectMp4 = item;
        },
        getList: function () {
            const self = this;
            Http.sendGet("/mp4/pageShowList?page=" + ++self.page + "&devId=" + self.getDevId(), function (data) {
                if (data.error) {
                    return;
                }
                self.list = self.list.concat(data.list);
                self.count = data.count;
                document.title = data.count + "=" + self.page;
            });
        },
        getDevId: function () {
            let devId = localStorage.getItem('zwx-dev-id');
            if (!devId) {
                devId = Math.random().toString().slice(2);
                localStorage.setItem('zwx-dev-id', devId);
            }
            return devId;
        },
    }
}
</script>

<style scoped>
.one-mp4 {
    background-color: white;
    border-radius: 15px;
    margin-top: 5px;
}

.one-mp4 .img-div {
    height: 150px;
}
</style>