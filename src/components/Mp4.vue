<template>
    <div class="mp4" style="background-color: #ccc;padding: 5px;">
        <div v-for="(item,index) in list" :key="item._id" class="one-mp4">
            <div style="margin-left: 5px;">{{ item.name }}</div>
            <div class="img-div" @click="clickImg(item)">
                <img :src="item.img" style="width: 100%;height: 100%;" alt=""/>
            </div>
            <div>
                按钮
            </div>
        </div>
        <div style="text-align: center;padding: 10px;color: blue;">加载更多</div>
    </div>
</template>

<script>
export default {
    name: "Mp4.vue",
    data: function () {
        return {
            count: 0,
            list: [{
                "_id": "202404/6630cbdbe2519513f3e84cd2",
                "name": "name",
                "path": "path",
                "url": "url",
                "date": "2024-09-30",
                "img": "https://a1-online-gerenxinxi.oss-cn-beijing.aliyuncs.com/systemBackgroundImage/10.8%20A6_201910081633118.jpg"
            }, {
                "_id": "202404/6630cbdbe2519513f3e84cd2111",
                "name": "name",
                "path": "path",
                "url": "url",
                "date": "2024-09-30",
                "img": "https://a1-online-gerenxinxi.oss-cn-beijing.aliyuncs.com/systemBackgroundImage/10.8%20A6_201910081633118.jpg"
            }, {
                "_id": "202404/6630cbdbe2519513f3e84cd21112",
                "name": "name",
                "path": "path",
                "url": "url",
                "date": "2024-09-30",
                "img": "https://a1-online-gerenxinxi.oss-cn-beijing.aliyuncs.com/systemBackgroundImage/10.8%20A6_201910081633118.jpg"
            }, {
                "_id": "202404/6630cbdbe2519513f3e84cd213",
                "name": "name",
                "path": "path",
                "url": "url",
                "date": "2024-09-30",
                "img": "https://a1-online-gerenxinxi.oss-cn-beijing.aliyuncs.com/systemBackgroundImage/10.8%20A6_201910081633118.jpg"
            }, {
                "_id": "202404/6630cbdbe2519513f3e84cd214",
                "name": "name",
                "path": "path",
                "url": "url",
                "date": "2024-09-30",
                "img": "https://a1-online-gerenxinxi.oss-cn-beijing.aliyuncs.com/systemBackgroundImage/10.8%20A6_201910081633118.jpg"
            }]
        }
    },
    mounted() {

    },
    methods: {
        clickImg: function (item) {
            console.log(item);
        }
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