import type { IconType } from 'ant-design-vue/es/notification'

export const openNotificationWithIcon = (type: IconType, message: string, description?: string) => {
  notification[type]({
    duration: 0,
    message,
    description,
  })
}
