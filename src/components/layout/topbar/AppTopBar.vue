<script lang="ts" setup>
import { useSettingStore } from '@/stores/modules/settingStore'
import { useUserStore } from '@/stores/modules/userStore'
import { useFullscreen } from '@vueuse/core'

// 全屏 isFullscreen - 是否全屏 toggle - 切换
const { isFullscreen, toggle } = useFullscreen()

const settingStore = useSettingStore()
const userStore = useUserStore()

// 刷新
const handleRefresh = () => {
  location.reload()
}
</script>
<template>
  <div class="app-top-bar">
    <div class="left">
      <el-icon class="icon-btn" @click="settingStore.switchFolding">
        <i-ep-expand v-if="settingStore.isCollapse" />
        <i-ep-fold v-else />
      </el-icon>
      <el-icon class="icon-btn" @click="handleRefresh">
        <i-ant-design-sync-outlined class="refresh-btn" />
      </el-icon>
    </div>
    <div class="right">
      <el-icon class="icon-btn" @click="toggle" :size="isFullscreen ? 28 : 22">
        <i-ant-design-fullscreen-exit-outlined class="off-screen-bth" v-if="isFullscreen" />
        <i-icon-park-full-screen class="full-screen-btn" v-else />
      </el-icon>
      <el-icon class="icon-btn">
        <el-badge is-dot>
          <i-ep-bell class="remind-btn" />
        </el-badge>
      </el-icon>
      <el-icon class="icon-btn">
        <el-badge is-dot type="success">
          <i-ep-chat-dot-square class="remind-btn" />
        </el-badge>
      </el-icon>
      <el-icon class="icon-btn">
        <i-icon-park-international class="international-btn" />
      </el-icon>
      <el-icon class="icon-btn">
        <i-ep-setting class="setting-btn" />
      </el-icon>
      <el-icon class="icon-btn" @click="settingStore.switchNight">
        <i-icon-park-outline-moon v-if="settingStore.isNight" />
        <i-icon-park-sun v-else />
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
