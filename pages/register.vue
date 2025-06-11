<script lang="ts" setup>
import type { FormProps } from 'ant-design-vue'

definePageMeta({
  isPublic: true,
  layout: 'default',
})

const registerState = reactive<RegistrationInput>({
  username: '',
  password: '',
  displayName: '',
})

const handleFinish: FormProps['onFinish'] = async () => {
  const rawUser = await $fetch('/api/auth/register', {
    method: 'POST',
    body: registerState,
  })
  const user = ZSessionUser.parse(rawUser)
  navigateTo(getEntryPoint(user))
}

const handleFinishFailed: FormProps['onFinishFailed'] = (errors) => {
  console.error(errors)
}
</script>

<template>
  <a-form
    layout="vertical"
    :model="registerState"
    @finish="handleFinish"
    @finish-failed="handleFinishFailed"
  >
    <a-form-item>
      <a-input v-model:value="registerState.username" placeholder="Username">
        <template #prefix>
          <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="registerState.password" type="password" placeholder="Password">
        <template #prefix>
          <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="registerState.displayName" placeholder="Displayed Name">
        <template #prefix>
          <IdcardOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        :disabled="registerState.username === '' || registerState.password === ''"
        block
      >
        Register
      </a-button>
    </a-form-item>
  </a-form>
</template>
