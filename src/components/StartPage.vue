<template>
    <div class="start-page">
        <div style="margin-top: 20px;text-align: center; ">
            <button @click="toGold">Gold</button>
        </div>
    </div>
</template>

<script>

export default {
    name: "StartPage",
    components: {},
    data() {
        return {}
    },
    mounted() {

    },
    methods: {
        toGold: function () {
            this.$router.push({path: '/gold'})
        },
    }
}
</script>
<style scoped>
.start-page button {
    width: 150px;
    background-image: linear-gradient(45deg, #f06d06, #f0c040);
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    transition: background-image 0.2s ease-in-out;
    border-radius: 15px;
}

.start-page button:hover {
    background-image: linear-gradient(45deg, #f08c06, #f0d040);
}
</style>