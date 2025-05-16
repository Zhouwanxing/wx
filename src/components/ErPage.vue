<template>
    <div class="er-page">
        <div class="header">
            二手房
        </div>
        <div class="content scrollable-table" style="background-color: white;">
            <div v-for="(item,index) in list" :key="index" @click="clickOne(item)"
                 style="background-color: #ddd;border-radius: 5px;margin: 5px;padding: 5px;">
                <div :style="item.linkUrl ? 'color:blue;' : ''">{{ item.info }}</div>
                <div>{{ item.priceStr }}{{ item.from }}</div>
                <div>楼栋:{{ areaPlace(item.area) }}</div>
                <div v-if="(item.histories || []).length > 0" style="margin-top: 10px;color:red;">
                    <div v-for="(one,oneIndex) in item.histories" :key="'a'+oneIndex">
                        <span>{{ one.time }}</span>
                        <span style="margin-left: 20px;">{{ one.price }}</span>
                    </div>
                </div>
                <div>
                    <button @click="updateLike(item, 'delete')">没了</button>
                    <button @click="updateLike(item, 'notLike')" style="margin-left: 20px;">不喜欢</button>
                </div>
            </div>
        </div>
        <div class="footer">

        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";

export default {
    name: "ErPage",
    data: function () {
        return {
            list: []
        }
    },
    mounted() {
        const self = this;
        setTimeout(function () {
            self.findAll();
        });
    },
    watch: {},
    computed: {},
    methods: {
        clickOne: function (item) {
            if (item.linkUrl) {
                window.open(item.linkUrl);
            }
        },
        findAll: function () {
            const self = this;
            Http.sendPost("/tangyue/getAJK", {}, function (res) {
                self.list = res.data || [];
            });
        },
        updateLike: function (item, type) {
            const self = this;
            Http.sendPost("/tangyue/updateErSF", {id: item._id, type: type}, function (res) {
                let index = self.list.findIndex(function (item2) {
                    return item2._id === item._id;
                });
                if (index !== -1) {
                    self.list.splice(index, 1);
                }
            });
        },
        areaPlace: function (area) {
            let map = {
                85: ["A8"],
                89: ["A8"],
                91: ["A15", "A16"],
                112: ["A7"],
                113: ["A15", "A7", "A16"],
                114: ["A12"],
                117: ["A8", "A13", "A7", "A14", "A11"],
                118: ["A12", "A13", "A7", "A6"],
                119: ["A13", "A14", "A11"],
                120: ["A12", "A13", "A7", "A11"],
                121: ["A7", "A6"],
                122: ["A10"],
                123: ["A10"],
                141: ["A10"],
                194: ["A9"],
                159: ["A9"],
            };
            let count = -1;
            while (count++ < 10) {
                if (map.hasOwnProperty(parseInt(area) + count)) {
                    return map[parseInt(area) + count].join(",");
                }
            }
            return "";
        }
    },
    filters: {}
}
</script>

<style scoped>
.er-page .header, .footer {
    text-align: center;
    font-size: 20px;
    left: 0;
    right: 0;
    border-bottom: 1px solid white;
}

.er-page .header {
    position: fixed;
    top: 0;
    height: 50px;
    line-height: 50px;
}

.er-page .footer {
    position: fixed;
    bottom: 0;
    height: 60px;
    padding-top: 5px;
    border-top: 1px solid black;
}

.er-page .content {
    position: absolute;
    top: 50px;
    bottom: 60px;
    left: 0;
    right: 0;
    overflow-y: auto;
}
</style>
