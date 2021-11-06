<template>
  <div id="agency-main" class="agency-main">
    <!-- 使用keep-alive时，组件里需要同时命名一个name,并在cachedviews里存在才能生效 -->
    <keep-alive :exclude="excludeRouter">
      <router-view :key="fullPath" />
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      excludeRouter: []
    }
  },
  computed: {
    fullPath: function () {
      return this.$route.fullPath
    }
  }
}
</script>

