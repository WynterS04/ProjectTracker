<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore';

const store = useProjectStore()

const totals = computed(() => store.summmarizeProjects)

const totalProjects = computed(() => totals.value[0])

const  summaryItems = computed(() => [
    { status: 'Not Started', color: 'grey', total: totals.value[1]},
    { status: 'In Progress', color: 'orange', total: totals.value[2]},
    { status: 'Completed', color: 'green', total: totals.value[3]}
])

const chartStyle = computed(() => {
  const total = totalProjects.value
  if (total === 0) {
    return {
      background: 'conic-gradient(#ddd 0% 100%)'
    }
  }

  const notStarted = summaryItems.value[0].total
  const inProgress = summaryItems.value[1].total
  const completed = summaryItems.value[2].total

  const nsPct = (notStarted / total) * 100
  const ipPct = (inProgress / total) * 100
  const compPct = (completed / total) * 100

  return {
    background: `conic-gradient(
      ${summaryItems.value[0].color} 0% ${nsPct}%,
      ${summaryItems.value[1].color} ${nsPct}% ${nsPct + ipPct}%,
      ${summaryItems.value[2].color} ${nsPct + ipPct}% 100%
    )`
  }
})
</script>

<template>
  <div class="project-summary">
    <h2 style="padding-left:30px ;">Summary</h2>

    <div class="chart-row">
      <div class="donut-chart" :style="chartStyle">
        <div class="donut-hole">
          <div class="total-number">{{ totalProjects }}</div>
          <div class="total-label">Total</div>
        </div>
      </div>

      <div class="legend">
        <div v-for="item in summaryItems" :key="item.status" class="legend-item">
          <span class="dot" :style="{ backgroundColor: item.color }"></span>
          <p>{{ item.status }} - {{ item.total }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-left: 30px;
}

.donut-chart {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  position: relative;
  display: grid;
  place-items: center;
}

.donut-hole {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.total-number {
  font-size: 2rem;
  font-weight: bold;
}

.total-label {
  font-size: 0.9rem;
  color: #666;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
</style>