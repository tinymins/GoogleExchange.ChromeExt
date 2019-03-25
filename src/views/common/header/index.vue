<template>
  <header class="header">
    <el-menu :default-active="selected" class="nav" mode="horizontal" router>
      <el-menu-item
        v-for="(tab, index) of tabList" :key="index"
        :index="tab.route"
        :route="{ name: tab.route }"
      >
        <router-link :to="tab.route" style="text-decoration: none;">{{ tab.name }}</router-link>
      </el-menu-item>
    </el-menu>
  </header>
</template>

<script>
import { Menu, MenuItem } from 'element-ui';

export default {
  components: {
    [Menu.name]: Menu,
    [MenuItem.name]: MenuItem,
  },
  data() {
    const tabList = [
      { name: '首页', route: 'index' },
      { name: '我的', route: 'user' },
    ];
    return {
      tabList,
    };
  },
  computed: {
    selected: {
      set(name) {
        this.$router.push({ name });
      },
      get() {
        let active = this.$route.name;
        Object.values(this.$route.matched).forEach((obj) => {
          if (obj.meta.parent) {
            active = obj.meta.parent;
          }
        });
        return active;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/common/header/index.scss';
</style>
