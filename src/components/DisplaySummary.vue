<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProjectStore } from '@/stores/ProjectStore'

const store = useProjectStore()

const totals = computed(() => store.summmarizeProjects)

const summaryItems = computed(() => [
  { status: 'Not Started', color: 'grey', total: totals.value[1] },
  { status: 'In Progress', color: '#FFA500', total: totals.value[2] },
  { status: 'Complete', color: '#008000', total: totals.value[3] }
])

const hoveredStatus = ref<string | null>(null)

const size = 260
const cx = size / 2
const cy = size / 2
const outerRadius = 110
const innerRadius = 62

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  }
}

function describeDonutSlice(
  centerX: number,
  centerY: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number
) {
  const startOuter = polarToCartesian(centerX, centerY, rOuter, endAngle)
  const endOuter = polarToCartesian(centerX, centerY, rOuter, startAngle)
  const startInner = polarToCartesian(centerX, centerY, rInner, endAngle)
  const endInner = polarToCartesian(centerX, centerY, rInner, startAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    'Z'
  ].join(' ')
}

const segments = computed(() => {
  const total = totals.value[0] || 0
  if (total === 0) return []

  let currentAngle = 0

  return summaryItems.value.map(item => {
    const sliceAngle = ((item.total ?? 0) / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + sliceAngle
    currentAngle = endAngle

    return {
      ...item,
      path: describeDonutSlice(cx, cy, outerRadius, innerRadius, startAngle, endAngle)
    }
  })
})

const activeItem = computed(() =>
  summaryItems.value.find(item => item.status === hoveredStatus.value) ?? null
)
</script>

<template>
  <div class="project-summary">
    <h2 style="padding-left: 30px">Summary</h2>

    <div class="summary-layout">
      <div class="chart-wrap">
        <svg
          :width="size"
          :height="size"
          viewBox="0 0 260 260"
          class="donut-chart"
        >
          <g v-if="segments.length">
            <path
              v-for="segment in segments"
              :key="segment.status"
              :d="segment.path"
              :style="{
                fill: segment.color,
                transform: hoveredStatus === segment.status ? 'scale(1.04)' : 'scale(1)',
                transformOrigin: 'center',
                filter: hoveredStatus === segment.status
                  ? `drop-shadow(0 0 12px ${segment.color})`
                  : 'none',
                transition: 'transform 0.2s ease, filter 0.2s ease'
              }"
              @mouseenter="hoveredStatus = segment.status"
              @mouseleave="hoveredStatus = null"
            />
          </g>

          <circle
            :cx="cx"
            :cy="cy"
            :r="innerRadius"
            fill="white"
          />

          <text
            :x="cx"
            :y="cy - 6"
            text-anchor="middle"
            class="center-total"
          >
            {{ totals[0] }}
          </text>

          <text
            :x="cx"
            :y="cy + 18"
            text-anchor="middle"
            class="center-label"
          >
            Total
          </text>
        </svg>

        <div v-if="activeItem" class="hover-label">
          {{ activeItem.status }}
        </div>
      </div>

      <div class="legend">
        <div v-for="item in summaryItems" :key="item.status" class="legend-item">
          <span class="dot" :style="{ backgroundColor: item.color }"></span>
          <p style="font-size: x-large;">{{ item.status }} - {{ item.total }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-layout {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.chart-wrap {
  position: relative;
  width: 260px;
  height: 260px;
}

.donut-chart {
  overflow: visible;
}

.center-total {
  font-size: 28px;
  font-weight: bold;
  fill: #222;
}

.center-label {
  font-size: 14px;
  fill: #666;
}

.hover-label {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 0.9rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  pointer-events: none;
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