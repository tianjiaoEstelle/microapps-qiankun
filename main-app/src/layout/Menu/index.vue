<template>
  <el-scrollbar>
    <el-menu
      class="layout-menu system-scrollbar"
      background-color="var(--system-menu-background)"
      text-color="var(--system-menu-text-color)"
      active-text-color="var(--system-primary-color)"
      :default-active="activeMenu"
      :class="isCollapse? 'collapse': ''"
      :collapse="isCollapse"
      :collapse-transition="false"
      :unique-opened="expandOneMenu"
    >
      <menu-item v-for="(menu, key) in allRoutes" :key="key" :menu="menu" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MenuItem from './MenuItem.vue'

export default defineComponent({
  components: {
    MenuItem,
  },
  setup() {
    const store = useStore()
    const isCollapse = computed(() => store.state.app.isCollapse)
    const expandOneMenu = computed(() => store.state.app.expandOneMenu)
    const allRoutes = computed(() => store.state.app.menuList)
    const route = useRoute()

    const activeMenu = computed(() => {
      const { meta } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      const path = window.location.pathname
      return path
    })

    return {
      isCollapse,
      expandOneMenu,
      allRoutes,
      activeMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
  .el-scrollbar {
    background-color: var(--system-menu-background);
  }
  .layout-menu {
    width: 100%;
    &.collapse {
      margin-left: 0px;
    }
    :deep() {
      font-family: Arial, sans-serif;
      font-weight: 400 !important;
      border-right: none;
      .el-menu-item i, .el-menu-item-group__title, .el-sub-menu__title i {
        color: var(--system-menu-text-color);
      }
      .el-menu-item, .el-sub-menu__title{
        &.is-active {
          background-color: var(--system-primary-color) !important;
          color: var(--system-primary-text-color) !important;
          i {
            color: var(--system-primary-text-color) !important;
          }
          &:hover {
            background-color: var(--system-primary-color) !important;
            color: var(--system-primary-text-color) !important;
          }
        }
        &:hover {
          background-color: var(--system-menu-hover-background) !important;
        }
      }
      .el-sub-menu {
        &.is-active {
          >.el-sub-menu__title, >.el-sub-menu__title i {
            color: var(--system-menu-submenu-active-color) !important;
          }
        }
        .el-menu-item {
          background-color: var(--system-menu-children-background) !important;
          &.is-active {
            background-color: var(--system-primary-color) !important;
            color: var(--system-primary-text-color) !important;
            &:hover {
              background-color: var(--system-primary-color) !important;
              color: var(--system-primary-text-color) !important;
            }
          }
          &:hover {
            background-color: var(--system-menu-hover-background) !important;
          }
        }
        .el-sub-menu {
          .el-sub-menu__title {
            background-color: var(--system-menu-children-background) !important;
            &:hover {
              background-color: var(--system-menu-hover-background) !important;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
.el-menu--vertical {
  .el-menu-item, .el-sub-menu__title {
    &.is-active {
      background-color: var(--system-primary-color) !important;
      color: var(--system-primary-text-color) !important;
      i {
        color: var(--system-primary-text-color) !important;
      }
      &:hover {
        background-color: var(--system-primary-color) !important;
        color: var(--system-primary-text-color) !important;
      }
    }
    &:hover {
      background-color: var(--system-menu-hover-background) !important;
    }
  }
}
</style>
