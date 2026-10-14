import { createRouter, createWebHistory } from "vue-router";

import ExamView from "@/views/ExamView.vue";
import TestView from "@/views/TestView.vue";

const routes = [
  {
    path: "/",
    name: "exams",
    component: ExamView,
  },
  {
    path: "/test",
    name: "test",
    component: TestView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
