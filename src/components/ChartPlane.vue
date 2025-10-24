<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { useTemplateRef, watch } from 'vue';
import { drawPlane, type DrawPlaneOptions, type DrawPoint } from './drawPlane';

const props = defineProps<{
  points: DrawPoint[];
  opts?: DrawPlaneOptions;
}>();

const container = useTemplateRef<HTMLDivElement | null>('container');

watch(() => props.points, (newPoints) => {
  if (!container.value) return;
  // render chart with new data
  drawPlane(container.value, newPoints, props.opts ?? {});
}, { immediate: true });
</script>