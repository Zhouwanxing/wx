<template>
    <div v-if="visible" class="alert-box">
        <div>
            {{ message }}
        </div>
        <div>
            <button @click="close">关闭</button>
        </div>
    </div>
</template>

<script>
export default {
    props: ['visible', 'message'],
    methods: {
        close() {
            this.$emit('close');
        }
    }
}
</script>

<style>
.alert-box {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px;
    background-color: white;
    border: 1px solid #ccc;
    z-index: 1000;
    border-radius: 10px;
}
</style>