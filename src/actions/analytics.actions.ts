"use server";

import { AnalyticsService } from "@/services/analytics.service";

export async function getDashboardMetrics() {
  return AnalyticsService.getDashboardMetrics();
}

export async function getSalesChartData() {
  return AnalyticsService.getSalesChartData();
}

