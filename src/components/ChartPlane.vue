<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, useTemplateRef, watch } from 'vue';
import { drawPlane, type DrawPlaneOptions, type DrawPoint } from './drawPlane';

const props = defineProps<{
  points: DrawPoint[];
  opts?: DrawPlaneOptions;
}>();

const container = useTemplateRef<HTMLDivElement | null>('container');

function updateChart(newPoints: DrawPoint[]) {
  if (!container.value) return;
  console.log('ChartPlane points updated:', newPoints);
  drawPlane(container.value, newPoints, props.opts ?? {});
}

onMounted(() => {
  updateChart(props.points);
});

onUpdated(() => {
  updateChart(props.points);
});
</script>