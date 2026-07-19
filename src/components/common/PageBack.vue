<template>
    <button type="button" class="page-back" @click="goBack" :aria-label="label">
        <span class="page-back__icon">←</span>
        <span class="page-back__text">{{ label }}</span>
    </button>
</template>

<script>
export default {
    name: "PageBack",
    props: {
        label: {
            type: String,
            default: "主页"
        },
        to: {
            type: String,
            default: "/main"
        }
    },
    methods: {
        goBack() {
            if (this.$router) {
                this.$router.push({ path: this.to });
            } else {
                window.location.href = this.to;
            }
        }
    }
};
</script>

<style scoped>
.page-back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 44px;
    min-width: 44px;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fff;
    color: #1e3a8a;
    font-size: 15px;
    line-height: 1.2;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
}

.page-back:active {
    background: #f3f4f6;
}

.page-back__icon {
    font-size: 16px;
    line-height: 1;
}
</style>
