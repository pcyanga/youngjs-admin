<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EChartsOption } from 'echarts'
import { Bell, Odometer, ShoppingCart, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { formatTime } from '@/utils'
import EChart from '@/components/EChart/index.vue'

defineOptions({ name: 'Dashboard' })

const userStore = useUserStore()
const now = ref(new Date())

const greeting = computed(() => {
  const hour = now.value.getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const stats = [
  { label: '今日访问量', value: '12,486', icon: Odometer, color: '#409eff' },
  { label: '本周新增用户', value: '1,352', icon: User, color: '#67c23a' },
  { label: '订单总数', value: '56,920', icon: ShoppingCart, color: '#e6a23c' },
  { label: '待处理事项', value: '18', icon: Bell, color: '#f56c6c' },
]

const barOptions: EChartsOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 20, top: 30, bottom: 30 },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: { lineStyle: { color: '#909399' } },
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
  series: [
    {
      name: '访问量',
      type: 'bar',
      barMaxWidth: 28,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#79bbff' },
          ],
        },
      },
      data: [820, 932, 901, 934, 1290, 1330, 1320, 1402, 1260, 1180, 1420, 1560],
    },
  ],
}

const lineOptions: EChartsOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['移动端', 'PC 端'], top: 0 },
  grid: { left: 40, right: 20, top: 40, bottom: 30 },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
  series: [
    {
      name: '移动端',
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.15 },
      data: [320, 402, 301, 434, 390, 530, 410],
    },
    {
      name: 'PC 端',
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.15 },
      data: [220, 282, 291, 334, 390, 330, 320],
    },
  ],
}
</script>

<template>
  <div class="dashboard">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card" shadow="never">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2>{{ greeting }}，{{ userStore.nickname }}，欢迎回来！</h2>
          <p>今日是 {{ formatTime(now, 'YYYY-MM-DD') }}，祝你拥有愉快的一天。</p>
        </div>
        <div class="welcome-avatar">
          <el-avatar :size="64">{{ userStore.nickname.charAt(0).toUpperCase() }}</el-avatar>
        </div>
      </div>
    </el-card>

    <!-- 数据统计 -->
    <div class="stat-grid">
      <el-card v-for="item in stats" :key="item.label" class="stat-card" shadow="hover">
        <div class="stat-icon" :style="{ backgroundColor: item.color + '1a', color: item.color }">
          <el-icon :size="26"><component :is="item.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
      </el-card>
    </div>

    <!-- 图表 -->
    <div class="chart-grid">
      <el-card shadow="never" header="年度访问趋势">
        <EChart :options="barOptions" />
      </el-card>
      <el-card shadow="never" header="本周终端访问">
        <EChart :options="lineOptions" />
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.welcome-card {
  background: linear-gradient(120deg, var(--el-color-primary-light-8), var(--el-color-primary-light-9));

  :deep(.el-card__body) {
    padding: 24px;
  }

  .welcome-content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .welcome-text h2 {
      margin: 0 0 8px;
      font-size: 20px;
      color: var(--el-text-color-primary);
    }

    .welcome-text p {
      margin: 0;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }

    .welcome-avatar :deep(.el-avatar) {
      font-size: 24px;
      background-color: var(--el-color-primary);
      color: #fff;
    }
  }
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  .stat-card {
    :deep(.el-card__body) {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      flex-shrink: 0;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .stat-label {
      margin-top: 4px;
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
  }
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 16px;
}
</style>
