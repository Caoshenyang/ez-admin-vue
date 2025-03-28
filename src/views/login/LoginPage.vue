<script lang="ts" setup>
import router from '@/router';
import { useUserStore } from '@/stores/modules/userStore';
import type { FormInstance, FormRules } from 'element-plus';
import { ref } from 'vue';


// 登录表单数据
const userLoginForm = ref({
  username: 'admin',
  password: 'admin123456'
})

// 登录表单ref
const loginFormRef = ref<FormInstance>()
// 加载动画
const loading = ref(false)
// 获取用户信息缓存仓库
const userStore = useUserStore()

// 表单验证规则
const rules = ref<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

// 登录
const handleLogin = async () => {
  // 表单验证
  const valid = await loginFormRef.value?.validate()
  // 校验不成功直接 return
  if (!valid) {
    return false
  }
  // 校验成功进行后续操作
  // 1.加载 loading
  loading.value = true
  // 2.登录请求 获取token
  userStore
    .login(userLoginForm.value)
    .then(() => {
      // 跳转
      router.push('/')
    })
    .catch(() => {
      // 验证失败，重新加载验证码
    })
    .finally(() => {
      // 验证结束，隐藏loading
      loading.value = false
    })
}

</script>

<template>
  <el-row class="login-container">
    <el-col :span="14" class="left-body">
      <el-text class="title">EZ-ADMIN</el-text>
      <el-text class="subtitle">相信自己我能行， 老天不会辜负你所付出的努力！</el-text>
    </el-col>
    <el-col :span="10" class="right-body">
      <el-text class="loign-title">欢迎登录</el-text>
      <div class="login-text">
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>
      <el-form class="login-form" ref="loginFormRef" :rules="rules" :model="userLoginForm" size="large">
        <el-form-item prop="username">
          <el-input v-model="userLoginForm.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="userLoginForm.password" placeholder="请输入密码" show-password>
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-button" color="#3b82f6" @click="handleLogin" :loading="loading"> 登 录 </el-button>
        </el-form-item>
        <el-link type="primary">忘记密码</el-link>
      </el-form>
    </el-col>
  </el-row>

</template>

<style lang="scss" scoped>
.left-body {
  background-image: url('../../assets/images/login_bg.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
  width: 100%;
  position: relative;

  .title {
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 20px;
    font-weight: bold;
    color: white;
  }

  .subtitle {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    color: white;
    white-space: nowrap;
  }
}

.right-body {
  height: 100vh;
  display: flex;
  padding: 0 60px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  .loign-title {
    font-size: 30px;
    font-weight: bold;
    color: #000;

  }

  .login-text {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    color: #d1d5db;

    .line {
      height: 1px;
      width: 64px;
      background-color: #d1d5db;
    }
  }

  .login-form {
    width: 300px;
  }

  .login-button {
    width: 300px;
    background-color: #3b82f6;
    color: white;
  }
}
</style>
