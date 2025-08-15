#!/usr/bin/env node
/**
 * Análisis offline detallado de una sesión completa
 * Genera reporte Markdown con insights profundos
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const LOGS_DIR = path.resolve('backend/logs');

async function loadSessionLogs(sessionFile) {
  const raw = await fs.readFile(path.join(LOGS_DIR, sessionFile), 'utf8');
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : data.logs || [];
}

function analyzeSession(logs) {
  if (logs.length === 0) return null;

  const analysis = {
    sessionInfo: {
      totalLogs: logs.length,
      duration: 0,
      startTime: Math.min(...logs.map(l => l.timestamp)),
      endTime: Math.max(...logs.map(l => l.timestamp))
    },
    entities: {},
    resonanceTimeline: [],
    activityDistribution: {},
    zoneUsage: {},
    criticalMoments: [],
    healthMetrics: {
      deaths: 0,
      criticalEvents: 0,
      recoveries: 0
    }
  };

  analysis.sessionInfo.duration = analysis.sessionInfo.endTime - analysis.sessionInfo.startTime;

  // Procesar cada log
  logs.forEach(log => {
    const { entityId, message, data, timestamp } = log;

    // Análisis por entidad
    if (entityId && !analysis.entities[entityId]) {
      analysis.entities[entityId] = {
        totalEvents: 0,
        activities: {},
        moods: {},
        avgStats: {},
        timeInZones: {}
      };
    }

    if (entityId) {
      analysis.entities[entityId].totalEvents++;
    }

    // Timeline de resonancia
    if (data?.resonance !== undefined) {
      analysis.resonanceTimeline.push({
        timestamp,
        resonance: data.resonance,
        relativeTime: timestamp - analysis.sessionInfo.startTime
      });
    }

    // Distribución de actividades
    if (message.includes('cambia actividad')) {
      const match = message.match(/(\w+) → (\w+)/);
      if (match) {
        const [, from, to] = match;
        analysis.activityDistribution[to] = (analysis.activityDistribution[to] || 0) + 1;
        if (entityId) {
          analysis.entities[entityId].activities[to] = (analysis.entities[entityId].activities[to] || 0) + 1;
        }
      }
    }

    // Uso de zonas
    if (message.includes('Zone effects')) {
      const zoneMatch = message.match(/zone: (\w+)/);
      if (zoneMatch) {
        const zone = zoneMatch[1];
        analysis.zoneUsage[zone] = (analysis.zoneUsage[zone] || 0) + 1;
        if (entityId) {
          analysis.entities[entityId].timeInZones[zone] = (analysis.entities[entityId].timeInZones[zone] || 0) + 1;
        }
      }
    }

    // Momentos críticos
    if (message.includes('murió') || message.includes('crítica') || log.level === 'error') {
      analysis.criticalMoments.push({
        timestamp,
        entityId,
        message,
        data,
        relativeTime: timestamp - analysis.sessionInfo.startTime
      });
      
      if (message.includes('murió')) analysis.healthMetrics.deaths++;
      if (message.includes('crítica')) analysis.healthMetrics.criticalEvents++;
    }

    // Stats promedio (simplificado)
    if (data?.stats && entityId) {
      const entity = analysis.entities[entityId];
      Object.entries(data.stats).forEach(([stat, value]) => {
        if (!entity.avgStats[stat]) entity.avgStats[stat] = [];
        entity.avgStats[stat].push(value);
      });
    }
  });

  // Calcular promedios finales
  Object.values(analysis.entities).forEach(entity => {
    Object.keys(entity.avgStats).forEach(stat => {
      const values = entity.avgStats[stat];
      entity.avgStats[stat] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        samples: values.length
      };
    });
  });

  return analysis;
}

function generateReport(analysis, sessionFile) {
  const { sessionInfo, entities, resonanceTimeline, activityDistribution, zoneUsage, criticalMoments, healthMetrics } = analysis;
  
  const durationMin = (sessionInfo.duration / 60000).toFixed(1);
  const startDate = new Date(sessionInfo.startTime).toLocaleString();
  
  let report = `# Análisis de Sesión: ${sessionFile}\n\n`;
  report += `**Generado:** ${new Date().toLocaleString()}\n`;
  report += `**Duración:** ${durationMin} minutos\n`;
  report += `**Inicio:** ${startDate}\n`;
  report += `**Total logs:** ${sessionInfo.totalLogs}\n\n`;

  // Resumen de salud
  report += `## 🏥 Resumen de Salud\n\n`;
  report += `- **Muertes:** ${healthMetrics.deaths} ${healthMetrics.deaths === 0 ? '✅' : '🚨'}\n`;
  report += `- **Eventos críticos:** ${healthMetrics.criticalEvents}\n`;
  report += `- **Tasa de eventos críticos:** ${(healthMetrics.criticalEvents / sessionInfo.totalLogs * 100).toFixed(1)}%\n\n`;

  // Resonancia
  if (resonanceTimeline.length > 0) {
    const avgResonance = resonanceTimeline.reduce((sum, r) => sum + r.resonance, 0) / resonanceTimeline.length;
    const minResonance = Math.min(...resonanceTimeline.map(r => r.resonance));
    const maxResonance = Math.max(...resonanceTimeline.map(r => r.resonance));
    
    report += `## 💖 Análisis de Resonancia\n\n`;
    report += `- **Promedio:** ${avgResonance.toFixed(1)}\n`;
    report += `- **Mínima:** ${minResonance.toFixed(1)}\n`;
    report += `- **Máxima:** ${maxResonance.toFixed(1)}\n`;
    report += `- **Muestras:** ${resonanceTimeline.length}\n\n`;
  }

  // Actividades
  report += `## 🎯 Distribución de Actividades\n\n`;
  Object.entries(activityDistribution)
    .sort((a, b) => b[1] - a[1])
    .forEach(([activity, count]) => {
      report += `- **${activity}:** ${count} cambios\n`;
    });
  report += '\n';

  // Zonas
  if (Object.keys(zoneUsage).length > 0) {
    report += `## 🗺️ Uso de Zonas\n\n`;
    Object.entries(zoneUsage)
      .sort((a, b) => b[1] - a[1])
      .forEach(([zone, count]) => {
        report += `- **${zone}:** ${count} efectos aplicados\n`;
      });
    report += '\n';
  }

  // Análisis por entidad
  report += `## 👥 Análisis por Entidad\n\n`;
  Object.entries(entities).forEach(([entityId, data]) => {
    const icon = entityId === 'circle' ? '●' : '■';
    report += `### ${icon} ${entityId}\n\n`;
    report += `- **Total eventos:** ${data.totalEvents}\n`;
    
    if (Object.keys(data.activities).length > 0) {
      report += `- **Actividades favoritas:**\n`;
      Object.entries(data.activities)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([activity, count]) => {
          report += `  - ${activity}: ${count}\n`;
        });
    }
    
    if (Object.keys(data.avgStats).length > 0) {
      report += `- **Stats promedio:**\n`;
      Object.entries(data.avgStats).forEach(([stat, metrics]) => {
        report += `  - ${stat}: ${metrics.avg.toFixed(1)} (${metrics.min.toFixed(1)}-${metrics.max.toFixed(1)})\n`;
      });
    }
    report += '\n';
  });

  // Momentos críticos
  if (criticalMoments.length > 0) {
    report += `## 🚨 Momentos Críticos\n\n`;
    criticalMoments.slice(0, 10).forEach((moment, i) => {
      const timeMin = (moment.relativeTime / 60000).toFixed(1);
      report += `${i + 1}. **${timeMin}min** - ${moment.entityId || 'Sistema'}: ${moment.message}\n`;
    });
    report += '\n';
  }

  return report;
}

// CLI
async function main() {
  const sessionFile = process.argv[2];
  
  if (!sessionFile) {
    console.log('Uso: node analyzeSession.js <archivo_de_logs.json>');
    console.log('\nArchivos disponibles:');
    const files = await fs.readdir(LOGS_DIR);
    files.filter(f => f.startsWith('logs_') && f.endsWith('.json'))
         .forEach(f => console.log(`  ${f}`));
    process.exit(1);
  }

  try {
    console.log(`📊 Analizando sesión: ${sessionFile}`);
    const logs = await loadSessionLogs(sessionFile);
    const analysis = analyzeSession(logs);
    
    if (!analysis) {
      console.log('❌ No se encontraron logs válidos');
      process.exit(1);
    }

    const report = generateReport(analysis, sessionFile);
    const reportFile = `analysis_${sessionFile.replace('.json', '.md')}`;
    
    await fs.writeFile(path.join(LOGS_DIR, reportFile), report);
    console.log(`✅ Reporte generado: logs/${reportFile}`);
    
    // Mostrar resumen en consola
    console.log('\n' + '='.repeat(60));
    console.log('RESUMEN RÁPIDO');
    console.log('='.repeat(60));
    console.log(`Duración: ${(analysis.sessionInfo.duration / 60000).toFixed(1)} min`);
    console.log(`Muertes: ${analysis.healthMetrics.deaths}`);
    console.log(`Eventos críticos: ${analysis.healthMetrics.criticalEvents}`);
    if (analysis.resonanceTimeline.length > 0) {
      const avg = analysis.resonanceTimeline.reduce((s, r) => s + r.resonance, 0) / analysis.resonanceTimeline.length;
      console.log(`Resonancia promedio: ${avg.toFixed(1)}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}