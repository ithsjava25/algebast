import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import ExamSelectionView from "@/views/ExamSelectionView.vue";
import ExamView from "@/views/ExamView.vue";
import ExerciseView from "@/views/ExerciseView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/exams",
    name: "exams",
    component: ExamSelectionView,
  },
  {
    path: "/exams/:examId",
    name: "exam",
    component: ExamView,
    props: true,
  },
  {
    path: "/exercises",
    name: "exercises",
    component: ExerciseView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
