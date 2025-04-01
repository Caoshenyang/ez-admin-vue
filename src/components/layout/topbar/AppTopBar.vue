<script lang="ts" setup>
import { useSettingStore } from '@/stores/modules/settingStore';
import { useUserStore } from '@/stores/modules/userStore';
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
      <div class="icon-btn" @click="settingStore.switchFolding">
        <SvgIcon :size="24" :name="settingStore.isCollapse ? 'system-menu-fold' : 'system-menu-unfold'"></SvgIcon>
      </div>
      <div class="icon-btn" @click="handleRefresh">
        <SvgIcon class="refresh-btn" :size="22" name="system-refresh"></SvgIcon>
      </div>
    </div>
    <div class="right">
      <div class="icon-btn" @click="toggle">
        <SvgIcon class="screen-bth" :size="22" :name="isFullscreen ? 'system-off-screen' : 'system-full-screen'">
        </SvgIcon>
      </div>
      <div class="icon-btn">
        <el-badge is-dot>
          <SvgIcon class="remind-btn" :size="22" name="system-remind"></SvgIcon>
        </el-badge>
      </div>
      <div class="icon-btn">
        <el-badge is-dot type="success">
          <SvgIcon class="message-bth" :size="22" name="system-message"></SvgIcon>
        </el-badge>
      </div>
      <div class="icon-btn">
        <SvgIcon class="international-btn" :size="22" name="system-international"></SvgIcon>
      </div>
      <div class="icon-btn">
        <SvgIcon class="setting-btn" :size="22" name="system-setting"></SvgIcon>
      </div>
      <div class="icon-btn" @click="settingStore.switchNight">
        <SvgIcon :size="22" :name="settingStore.isNight ? 'system-moon' : 'system-sun'"></SvgIcon>
      </div>
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
  border-radius: 3px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #e5e7eb;

    .refresh-btn {
      animation: rotate180 0.6s forwards;
    }

    .screen-bth {
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
