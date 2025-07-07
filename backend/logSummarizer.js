#!/usr/bin/env node
/**
 * Enhanced Log Summarizer
 * -----------------------
 * Crea resúmenes ricos a partir de los JSON de logs almacenados en /logs.
 * Incluye métricas agregadas, top entidades y min/max de resonancia.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const LOG_DIR = path.resolve('logs');
const DEFAULT_WINDOW_MIN = 10;

const isArray = Array.isArray;

export const loadLogs = async () => {
  const files = await fs.readdir(LOG_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  const all = [];
  for (const file of jsonFiles) {
    try {
      const raw = await fs.readFile(path.join(LOG_DIR, file), 'utf8');
      const data = JSON.parse(raw);
      if (isArray(data)) {
        all.push(...data);
      } else if (isArray(data.logs)) {
        all.push(...data.logs);
      }
    } catch {}
  }
  return all;
};

export const summarizeLogs = (logs, windowMinutes = DEFAULT_WINDOW_MIN) => {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const recent = logs.filter(l => now - l.timestamp <= windowMs);

  const summary = {
    generatedAt: now,
    windowMinutes,
    totalEvents: recent.length,
    bySystem: {},
    byLevel: {},
    topEntities: {},
    deaths: 0,
    criticalEvents: 0,
    resonanceEvents: 0,
    activityChanges: 0,
    zoneEffects: 0,
    averageResonance: null,
    minResonance: null,
    maxResonance: null,
    timeSpan: { start: null, end: null }
  };

  let resonanceSum = 0;
  let resonanceCount = 0;

  for (const log of recent) {
    // system & level counts
    if (log.system) summary.bySystem[log.system] = (summary.bySystem[log.system] || 0) + 1;
    if (log.level) summary.byLevel[log.level] = (summary.byLevel[log.level] || 0) + 1;

    // timeframe
    if (!summary.timeSpan.start || log.timestamp < summary.timeSpan.start) summary.timeSpan.start = log.timestamp;
    if (!summary.timeSpan.end || log.timestamp > summary.timeSpan.end) summary.timeSpan.end = log.timestamp;

    // entity counts
    if (log.entityId) summary.topEntities[log.entityId] = (summary.topEntities[log.entityId] || 0) + 1;

    const msg = log.message || '';

    // category detections
    if (msg.includes('murió') || msg.includes('Entidad murió')) summary.deaths++;
    if (msg.toLowerCase().includes('crítica')) summary.criticalEvents++;
    if (msg.includes('resonancia')) summary.resonanceEvents++;
    if (msg.includes('cambia actividad')) summary.activityChanges++;
    if (msg.includes('Zone effects')) summary.zoneEffects++;

    // resonance stats
    if (log.data?.resonance !== undefined) {
      const r = log.data.resonance;
      resonanceSum += r;
      resonanceCount++;
      summary.minResonance = summary.minResonance === null ? r : Math.min(summary.minResonance, r);
      summary.maxResonance = summary.maxResonance === null ? r : Math.max(summary.maxResonance, r);
    }
  }

  if (resonanceCount) summary.averageResonance = parseFloat((resonanceSum / resonanceCount).toFixed(2));

  // sort objects for readability
  summary.bySystem = Object.fromEntries(Object.entries(summary.bySystem).sort((a,b)=>b[1]-a[1]));
  summary.byLevel = Object.fromEntries(Object.entries(summary.byLevel).sort((a,b)=>b[1]-a[1]));
  summary.topEntities = Object.fromEntries(Object.entries(summary.topEntities).sort((a,b)=>b[1]-a[1]).slice(0,5));

  return summary;
};

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const minutes = parseInt(process.argv[2] || '', 10) || DEFAULT_WINDOW_MIN;
  const logs = await loadLogs();
  const summary = summarizeLogs(logs, minutes);
  const outName = `summary_${Date.now()}.json`;
  await fs.writeFile(path.join(LOG_DIR, outName), JSON.stringify(summary, null, 2));
  console.log(`✅ Resumen generado: logs/${outName}`);
}
