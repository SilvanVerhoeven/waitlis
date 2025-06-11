<script setup lang="ts">
import type { InputRef } from 'ant-design-vue/es/vc-input/inputProps'

type Mode = 'view' | 'edit'

const { queue } = defineProps<{ queue: Queue }>()
const mode = ref<Mode>('view')
const isCallingNext = ref<string | null>()
const titleInputRef = ref<InputRef | null>(null)

const queueStore = useQueueStore()

const saveName = async (newName: string) => {
  mode.value = 'view'
  await queueStore.renameQueue(queue, newName)
}

const handleTitleChange = (event: Event) => {
  const name = (event.currentTarget as HTMLInputElement).value
  queueStore.persistNameInStore(queue, name)
}

const handleTitleKeydown = (event: KeyboardEvent) => {
  const name = (event.currentTarget as HTMLInputElement).value
  if (event.key === 'Enter') {
    saveName(name)
  }
  else if (event.key === 'Escape') {
    mode.value = 'view'
  }
}

const handleSetAsNext = async (registration: Registration) => {
  // setIsCallingNext(registration.id)
  // await setAsNext(registration)
  // router.refresh()
  // setIsCallingNext(undefined)
}

onMounted(() => {
  if (!queue.name) mode.value = 'edit'
})

// autofocus only works on first mount
// programmatically set focus for later edits
watch(mode, async (newMode) => {
  if (newMode === 'edit') {
    await nextTick()
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  }
})
</script>

<template>
  <a-card
    class="queue"
    style="width: 400px"
  >
    <template #title>
      <a-row :gutter="4" align="middle" style="font-size: inherit;">
        <a-col flex="1" style="font-size: inherit;">
          <div
            v-if="mode === 'view'"
            class="queue-title"
            style="cursor: pointer; height: 100%"
            :style="{ color: !queue.name ? 'lightgray' : 'inherit' }"
            @click="mode = 'edit'"
          >
            {{ queue.name || 'Unbenannt' }}
          </div>
          <a-input
            v-if="mode === 'edit'"
            ref="titleInputRef"
            placeholder="Titel"
            :default-value="queue.name ?? undefined"
            @keydown="handleTitleKeydown"
            @blur="mode = 'view'"
            @change="handleTitleChange"
          />
        </a-col>
        <a-col flex="0">
          <a-dropdown trigger="click">
            <template #overlay>
              <a-menu>
                <a-menu-item key="0" @click="mode = 'edit'">
                  <EditOutlined />
                  Umbenennen
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="1" danger @click="queueStore.deleteQueue(queue)">
                  <DeleteOutlined />
                  Löschen
                </a-menu-item>
              </a-menu>
            </template>
            <a-button type="text">
              <MoreOutlined />
            </a-button>
          </a-dropdown>
        </a-col>
      </a-row>
    </template>
    <template #actions>
      <a-list
        style="max-height: calc(95vh - 250px); overflow-y: auto"
        size="small"
        :locale="{ emptyText: 'Keine Redebeiträge angemeldet' }"
        :data-source="queue.registrations"
      >
        <template #renderItem="{ item: member }">
          <a-list-item>
            <a-list-item-meta
              :description="`ID: ${member.memberId}`"
            >
              <template #title>
                <span>Anonyme Person</span>
                <a-badge v-if="member.firstInPhase" color="gray" style="margin-left: 5px" count="Neu" />
              </template>
              <a-tag v-if="member.status === RegistrationStatus.ACTIVE" color="green">
                Aufgerufen
              </a-tag>
              <a-tag v-if="member.status === RegistrationStatus.NEXT" color="yellow">
                Als Nächstes
              </a-tag>
              <a-button
                v-if="member.status === RegistrationStatus.QUEUED"
                :loading="isCallingNext === member.memberId"
                color="primary"
                variant="text"
                @click="handleSetAsNext(member)"
              >
                Als Nächstes
              </a-button>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </template>
  </a-card>
</template>

<style lang="css">
*:has(div.queue-title) {
  overflow: visible !important;
}

div.queue-title {
  padding: 4px 0 4px 10px;
  margin: -4px 0 -4px -10px;
  border-radius: 6px;
  transition: all 0.2s ease-out;
}

div.queue-title:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
