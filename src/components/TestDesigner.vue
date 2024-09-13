<template>
    <div>
        <div>
            <button @click="toGold">Gold</button>
        </div>
        <div style="margin-top: 10px;">
            <button @click="testRoute">to hello</button>
        </div>
    </div>
</template>

<script>

export default {
    name: "TestDesigner",
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
        testRoute: function () {
            // this.$router.push({path: '/hello'})
            this.$http.get(import.meta.env.VITE_BASE_URL + "/testA").then((response) => {
                console.log(response.data)
            })
        }
    }
}
</script>

<style scoped>

</style>