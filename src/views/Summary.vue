<template>
  <div id="Summary"></div>
</template>
<script>
export default {
  data() {
    return {
      month: '2020-06'
    }
  },
  created() {
    this.month = this.$route.query.month
    console.log(this.month)
  },
  methods: {}
}
</script>
<style scoped></style>
