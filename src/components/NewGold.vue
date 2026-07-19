<template>
    <div class="new-gold">
        <div class="toolbar">
            <PageBack/>
            <button type="button" class="tab" @click="showZdf = !showZdf;"
                    :style="{'background-color': showZdf ? '#BDF2C9':'#ccc'}">
                周大福
            </button>
            <button type="button" class="tab" @click="showZss = !showZss;"
                    :style="{'background-color': showZss ? '#87CEEB':'#ccc'}">
                周生生
            </button>
        </div>
        <div class="list-wrap">
            <div v-for="(item,index) in list" :key="index" class="row"
                 :style="{minHeight: showZdf && showZss ? '56px' : '44px'}">
                <div class="date" :style="{'line-height': showZdf && showZss ? '56px':'44px' }">{{ item._id }}</div>
                <div class="bars">
                    <div v-if="showZdf" class="zdf-div" :style="{width: (item.zdf - min) / (max - min) * 100 + '%'}">{{ item.zdf }}</div>
                    <div v-if="showZss" class="zss-div" :style="{width: (item.zss - min) / (max - min) * 100 + '%'}">{{ item.zss }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Http from "../js/Http.js";
import PageBack from "./common/PageBack.vue";

export default {
    name: "NewGold",
    components: { PageBack },
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
                if (data.code !== 200) {
                    return;
                }
                let list = data.data || [];
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
.new-gold {
    height: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding-top: env(safe-area-inset-top, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    flex-shrink: 0;
}

.tab {
    flex: 1;
    min-height: 44px;
    border-radius: 10px;
}

.list-wrap {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 8px 12px;
}

.row {
    display: flex;
    border-bottom: 1px solid #ccc;
    padding: 4px 0;
    align-items: center;
}

.date {
    width: 120px;
    flex-shrink: 0;
    font-size: 13px;
}

.bars {
    flex: 1;
    min-width: 0;
}

.zdf-div {
    background-color: #BDF2C9;
    border-radius: 0 5px 5px 0;
    min-height: 22px;
    line-height: 22px;
}

.zss-div {
    background-color: #87CEEB;
    border-radius: 0 5px 5px 0;
    min-height: 22px;
    line-height: 22px;
}
</style>