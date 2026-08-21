<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
onMounted(() => appStore.initTheme())
</script>

<template>
  <router-view />
</template>
