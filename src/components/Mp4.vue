<template>
    <div class="mp4" style="background-color: #ccc;padding: 5px;">
        <div v-for="(item,index) in list" :key="item._id" class="one-mp4">
            <div style="padding: 10px;">{{ item.name }}</div>
            <div class="img-div" @click="clickImg(item)">
                <img :src="item.img" style="width: 100%;height: 100%;" alt=""/>
            </div>
            <div style="padding: 10px;">
                按钮
            </div>
        </div>
        <div style="text-align: center;padding: 10px;color: blue;" @click="getList">加载更多</div>
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
            list: []
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.getList();
        }, 1);
    },
    methods: {
        clickImg: function (item) {
            console.log(item);
        },
        getList: function () {
            const self = this;
            Http.sendGet("/mp4/pageShowList?page=" + ++self.page, function (data) {
                if (data.error) {
                    return;
                }
                self.list = self.list.concat(data.list);
                self.count = data.count;
                document.title = data.count + "=" + self.page;
            });
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
    height: 100px;
}
</style>