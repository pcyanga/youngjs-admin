<script setup lang="ts">
import { computed } from 'vue'
import { iconList } from '@/utils/icons'

defineOptions({ name: 'IconPicker' })

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const selectedIcon = computed(() => {
  const found = iconList.find((item) => item.name === props.modelValue)
  return found ? found.icon : undefined
})

const handleSelect = (name: string) => {
  emit('update:modelValue', name)
}
</script>

<template>
  <div class="icon-picker">
    <el-popover placement="bottom-start" :width="320" trigger="click">
      <template #reference>
        <el-input :model-value="modelValue" placeholder="请选择图标" readonly>
          <template #prefix>
            <el-icon v-if="selectedIcon"><component :is="selectedIcon" /></el-icon>
          </template>
        </el-input>
      </template>

      <div class="icon-grid">
        <div
          v-for="item in iconList"
          :key="item.name"
          class="icon-cell"
          :class="{ active: item.name === modelValue }"
          :title="item.name"
          @click="handleSelect(item.name)"
        >
          <el-icon :size="20"><component :is="item.icon" /></el-icon>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  max-height: 240px;
  overflow-y: auto;

  .icon-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border-radius: 6px;
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: all 0.2s;

    &:hover {
      background-color: var(--el-fill-color-light);
      color: var(--el-color-primary);
    }

    &.active {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
      box-shadow: 0 0 0 1px var(--el-color-primary) inset;
    }
  }
}
</style>
