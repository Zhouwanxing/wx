<template>
    <div style="text-align: center;" class="new-gold">
        <div style="display: flex;height: 40px;margin-top: 5px;">
            <div style="width: 50%;line-height: 40px;border-radius: 10px;" @click="showZdf = !showZdf;"
                 :style="{'background-color': showZdf ? '#BDF2C9':'#ccc'}">
                周大福
            </div>
            <div style="width: 50%;line-height: 40px;border-radius: 10px;" @click="showZss = !showZss;"
                 :style="{'background-color': showZss ? '#87CEEB':'#ccc'}">
                周生生
            </div>
        </div>
        <div style="margin-top: 10px;">
            <div v-for="(item,index) in list" :key="index"
                 style="display: flex;border-bottom: 1px solid #ccc;padding:5px 0;"
                 :style="{height: showZdf && showZss ? '50px' : '25px'}">
                <div style="width: 150px;"
                     :style="{'line-height': showZdf && showZss ? '50px':'25px' }">{{ item._id }}
                </div>
                <div style="width: 100%;">
                    <div v-if="showZdf" class="zdf-div" :style="{width: (item.zdf - min) / (max - min) * 100 + '%'}"
                         style="">{{ item.zdf }}
                    </div>
                    <div v-if="showZss" class="zss-div" :style="{width: (item.zss - min) / (max - min) * 100 + '%'}"
                         style="">{{ item.zss }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";

export default {
    name: "NewGold",
    data() {
        return {
            list: [],
            min: 0,
            max: 0,
            showZdf: true,
            showZss: true
        };
    },
    mounted() {
        this.initPage();
    },
    methods: {
        initPage() {
            const self = this;
            Http.sendGet("/gold/allGold", function (data) {
                if (data.error || data.code !== 200) {
                    return;
                }
                let {list = []} = data.data || {};
                self.min = list.reduce((pre, item) => {
                    if (item.zdf > item.zss) {
                        return Math.min(item.zss, pre);
                    } else {
                        return Math.min(item.zdf, pre);
                    }
                }, 10000);
                self.max = list.reduce((pre, item) => {
                    if (item.zdf > item.zss) {
                        return Math.max(item.zdf, pre);
                    } else {
                        return Math.max(item.zss, pre);
                    }
                }, 0);
                self.list = list;
            });
        }
    },
}
</script>
<style scoped>
.zdf-div {
    background-color: #BDF2C9;
    border-radius: 0 5px 5px 0;
}

.zss-div {
    background-color: #87CEEB;
    border-radius: 0 5px 5px 0;
}
</style>