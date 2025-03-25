<template>
  <div class="flex h-screen">
    <div class="w-1/2 flex flex-col ">
      <!-- 背景图片 -->
      <div class=" absolute -z-10 h-full w-1/2">
        <img src="@/assets/images/login_bg.png" alt="login" class=" w-full h-full" />
      </div>
      <!-- logo -->
      <p class="flex-none text-white text-2xl font-bold ml-10 mt-5">EZ-ADMIN</p>
    </div>
    <div class="w-1/2 flex justify-center items-center">
      <div class="w-[500px] px-[20px] flex flex-col">
        <!-- title -->
        <h3 class=" font-bold text-3xl py-[10px]">欢迎回来</h3>
        <p class=" text-[14px] text-gray-400 py-[10px]">输入您的用户名和密码登录</p>
        <div class="w-full">
          <!-- 登录表单 -->
          <el-form class="w-full" ref="form" :inline="false" size="large">
            <el-form-item label="" class="w-full ">
              <el-input type="text" class="h-[50px] "></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input class="h-[50px]"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input></el-input>
            </el-form-item>
          </el-form>
          <el-button class=" w-full" type="primary" size="large">登录</el-button>

        </div>



      </div>



    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="css" scoped>
:deep(.el-input__wrapper) {
  @apply rounded-[10px];
  /* border-radius: 10px; */
}
</style>
