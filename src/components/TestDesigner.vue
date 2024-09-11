<template>
    <div>
        12311111111111111
        <button @click="testRoute">to hello</button>
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