<script setup>
import {
  CheckCircle2,
  Flame,
  Zap,
  Trophy,
  Award,
  Calculator,
  Scale,
  Brain,
  BarChart2,
  Timer,
  Moon,
  Lock,
  GraduationCap,
} from "lucide-vue-next";

defineProps({
  badges: {
    type: Array,
    required: true,
  },
});


const iconMap = {
  first_step: CheckCircle2,
  getting_started: Flame,
  question_machine: Zap,
  exam_veteran: Trophy,
  marathon_runner: Award,
  mathematician: Calculator,
  comparer: Scale,
  reasoner: Brain,
  analyst: BarChart2,
  speedrunner: Timer,
  night_owl: Moon,
  polymath: GraduationCap,
};

function getBadgeIcon(id) {
  return iconMap[id] || Award;
}
</script>

<template>
  <article class="badges-card card">
    

    <div v-if="badges.length === 0" class="no-badges">
      <p>Laddar pokaler...</p>
    </div>

    <div v-else class="badges-grid">
      <div
        v-for="badge in badges"
        :key="badge.id"
        class="badge-item"
        :class="{ unlocked: badge.unlocked, locked: !badge.unlocked }"
        :aria-label="`${badge.title}: ${badge.description} (${badge.unlocked ? 'Upplåst' : 'Låst'})`"

      >
        <div class="badge-icon-wrapper">
          <component :is="getBadgeIcon(badge.id)" class="badge-icon" />
          <Lock v-if="!badge.unlocked" class="lock-overlay" />
        </div>
        <div class="badge-info">
          <h4>{{ badge.title }}</h4>
          <p>{{ badge.description }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.badges-card {
  padding: 24px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-secondary);
}

.badges-card h3 {
  margin: 0 0 20px;
  font-size: 18px;
  color: var(--text-primary);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  transition: all 0.2s ease;
}

/* Upplåsta pokaler */
.badge-item.unlocked {
  background: var(--badge-gold-bg);
  border-color: var(--badge-gold-border);
  box-shadow: 0 4px 12px var(--badge-gold-shadow);
}

.badge-item.unlocked .badge-icon {
  color: var(--badge-gold-text);
}

/* Keep text readable on the original light gold surface in both themes. */
.badge-item.unlocked .badge-info h4 {
  color: #2c3e50;
}

.badge-item.unlocked .badge-info p {
  color: #59666a;
}

/* Låsta pokaler */
.badge-item.locked {
  opacity: 0.5;
  filter: grayscale(1);
}

.badge-item.locked .badge-icon {
  color: var(--text-secondary);
}

.badge-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
}

.badge-icon {
  width: 28px;
  height: 28px;
}

.lock-overlay {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  color: var(--error-text);
  background: var(--bg-secondary);
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.badge-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: var(--text-primary);
}

.badge-info p {
  margin: 0;
  font-size: 11px;
  color: var(--text-secondary);
  line-height: 1.3;
}

.no-badges {
  color: var(--text-secondary);
  font-size: 14px;
}
</style>