<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

defineOptions({ name: 'EChart' })

const props = defineProps<{ options: EChartsOption }>()

const el = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

const renderChart = () => {
  if (chart) chart.setOption(props.options, true)
}

const handleResize = () => chart?.resize()

onMounted(() => {
  if (!el.value) return
  chart = echarts.init(el.value)
  renderChart()
  window.addEventListener('resize', handleResize)
})

watch(() => props.options, renderChart, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div ref="el" class="echart-container" />
</template>

<style scoped>
.echart-container {
  width: 100%;
  height: 320px;
}
</style>
