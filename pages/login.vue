<script lang="ts" setup>
import type { NuxtError } from '#app'
import type { FormProps } from 'ant-design-vue'

definePageMeta({
  isPublic: true,
  layout: 'default',
})

const loginState = reactive<LoginInput>({
  username: '',
  password: '',
})

const isLoading = ref(false)

const handleFinish: FormProps['onFinish'] = async () => {
  isLoading.value = true

  try {
    const rawUser = await $fetch('/api/auth/login', {
      method: 'POST',
      body: loginState,
    })
    const user = ZSessionUser.parse(rawUser)
    navigateTo(getEntryPoint(user))
  }
  catch (error) {
    isLoading.value = false
    if ((error as NuxtError).statusCode !== 401) throw error
    message.error('Nutzername oder Passwort falsch')
  }
}

const handleFinishFailed: FormProps['onFinishFailed'] = (errors) => {
  console.error(errors)
}
</script>

<template>
  <a-form
    layout="vertical"
    :model="loginState"
    @finish="handleFinish"
    @finish-failed="handleFinishFailed"
  >
    <a-form-item>
      <a-input v-model:value="loginState.username" placeholder="Username" autofocus>
        <template #prefix>
          <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="loginState.password" type="password" placeholder="Password">
        <template #prefix>
          <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        :loading="isLoading"
        :disabled="loginState.username === '' || loginState.password === ''"
        block
      >
        Login
      </a-button>
    </a-form-item>
  </a-form>
</template>
