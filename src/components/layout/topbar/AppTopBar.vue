<script lang="ts" setup>
import { useSettingStore } from '@/stores/modules/settingStore'
import { useUserStore } from '@/stores/modules/userStore'
import { useFullscreen } from '@vueuse/core'

// 全屏 isFullscreen - 是否全屏 toggle - 切换
const { isFullscreen, toggle } = useFullscreen()

const settingStore = useSettingStore()
const userStore = useUserStore()
</script>
<template>
  <div class="app-top-bar">
    <div class="left">
      <el-icon class="icon-btn" @click="settingStore.switchFolding">
        <EZSvgIcon :icon="settingStore.isCollapse ? 'ep-expand' : 'ep-fold'" />
      </el-icon>
      <AppBreadcrumb />
    </div>
    <div class="right">
      <el-icon class="icon-btn" @click="toggle" :size="isFullscreen ? 28 : 22">
        <EZSvgIcon
          :icon="isFullscreen ? 'ant-design:fullscreen-exit-outlined' : 'icon-park:full-screen'"
          :class="isFullscreen ? 'off-screen-bth' : 'full-screen-btn'"
        />
      </el-icon>
      <el-icon class="icon-btn">
        <el-badge is-dot>
          <EZSvgIcon icon="ep-bell" class="remind-btn" />
        </el-badge>
      </el-icon>
      <el-icon class="icon-btn">
        <el-badge is-dot type="success">
          <EZSvgIcon icon="ep-chat-dot-square" class="remind-btn" />
        </el-badge>
      </el-icon>
      <el-icon class="icon-btn">
        <EZSvgIcon icon="icon-park:international" class="international-btn" />
      </el-icon>
      <el-icon class="icon-btn">
        <EZSvgIcon icon="ep-setting" class="setting-btn" />
      </el-icon>
      <el-icon class="icon-btn" @click="settingStore.switchNight">
        <EZSvgIcon :icon="settingStore.isNight ? 'icon-park-outline:moon' : 'icon-park:sun'" />
      </el-icon>
      <div class="avatar">
        <el-avatar class="avatar" :src="userStore.avatar" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/animation.scss';

.app-top-bar {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left,
.right {
  display: flex;
  align-items: center;
  height: 100%;
}

.avatar {
  margin: 0 10px;
}

.icon-btn {
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  padding: 6px;
  font-size: 22px;
  border-radius: 3px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb;

    .refresh-btn {
      animation: rotate180 0.6s forwards;
    }

    .off-screen-bth {
      animation: shrink 0.6s forwards;
    }

    .full-screen-btn {
      animation: expand 0.6s forwards;
    }

    .remind-btn {
      animation: shake 0.6s forwards;
    }

    .message-bth {
      animation: shake 0.6s forwards;
    }

    .international-btn {
      animation: moveUp 0.6s forwards;
    }

    .setting-btn {
      animation: rotate180 0.6s forwards;
    }
  }
}
</style>
