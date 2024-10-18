<template>
    <div class="mp4" style="background-color: #ccc;padding: 5px; border-radius: 20px;">
        <div v-show="!selectMp4._id">
            <div style="display: flex;height: 40px;text-align: center;">
                <div style="flex: 1;border-right: 1px solid blue;"><input type="checkbox" v-model="isShowLike"/></div>
                <div style="flex: 1;line-height: 40px;background-color: #ccc;border-radius: 10px;"
                     @click="page = 0;list = [];getList();">刷新
                </div>
            </div>
            <div v-for="(item) in list" :key="item._id" class="one-mp4">
                <div style="padding: 10px;">{{ item.name || item.date }}</div>
                <div class="img-div" @click="clickImg(item)">
                    <img :src="item.img" style="width: 100%;height: 100%;" alt=""/>
                </div>
                <div style="padding: 10px;">
                    <button @click="updateLike(item,false,'noFresh')">不喜欢</button>
                </div>
            </div>
            <div style="text-align: center;padding: 10px;color: blue;" @click="getList">加载更多</div>
        </div>
        <div v-if="selectMp4._id">
            <div style="text-align: center;padding: 10px;color: blue;" @click="selectMp4 = {};">关闭</div>
            <div style="padding: 10px;">{{ selectMp4.name + "(" + selectMp4.path + ")" }}</div>
            <video controls webkit-playsinline playsinline style="width: 100%;height: 100%;">
                <source :src="selectMp4.name ? selectMp4.url : ''" type="video/mp4">
            </video>
            <div style="display: flex;text-align: center;">
                <div style="flex: 1;">
                    <button @click="updateLike(selectMp4, false)">不喜欢</button>
                </div>
                <div style="flex: 1;">
                    <button @click="updateLike(selectMp4,true)">收藏</button>
                </div>
            </div>
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
            isShowLike: false
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.getList();
        }, 1);
    },
    watch: {
        isShowLike: function () {
            this.page = 0;
            this.list = [];
            this.getList();
        }
    },
    methods: {
        updateLike: function (item, like, fresh) {
            const self = this;
            Http.sendGet("/mp4/updateLike?id=" + item._id + "&like=" + like, function (data) {
                if (data.code !== 200) {
                    return;
                }
                let index = self.list.findIndex(function (item2) {
                    return item2._id === item._id;
                });
                if (index !== -1) {
                    self.list.splice(index, 1);
                }
                self.selectMp4 = {};
                if (fresh !== "noFresh") {
                    if (self.list[index]) {
                        self.$nextTick(function () {
                            self.selectMp4 = self.list[index];
                        });
                    } else {
                        self.page = 0;
                        self.list = [];
                        self.getList();
                    }
                }
            });
        },
        clickImg: function (item) {
            this.selectMp4 = item;
        },
        getList: function () {
            const self = this;
            Http.sendGet("/mp4/pageShowList?page=" + ++self.page + "&showLike=" + self.isShowLike, function (data) {
                if (data.code !== 200) {
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

</style>