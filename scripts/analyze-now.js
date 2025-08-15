#!/usr/bin/env node
/**
 * Análisis puntual del estado actual del juego
 * Hace una consulta al servidor y muestra el estado actual
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const API_URL = 'http://localhost:3002/api/logs/summary?window=10';

async function fetchSummary() {
  try {
    const { stdout } = await execAsync(`curl -s "${API_URL}"`);
    return JSON.parse(stdout);
  } catch (error) {
    throw new Error(`Error consultando API: ${error.message}`);
  }
}

function analyzeSummary(summary) {
  const analysis = {
    timestamp: new Date().toLocaleTimeString(),
    status: 'UNKNOWN',
    alerts: [],
    insights: [],
    recommendations: []
  };

  // Determinar estado general
  if (summary.totalEvents === 0) {
    analysis.status = 'NO_DATA';
    analysis.insights.push('No hay eventos recientes - el juego podría no estar activo');
    return analysis;
  }

  // Análisis de salud
  if (summary.deaths > 0) {
    analysis.status = 'CRITICAL';
    analysis.alerts.push(`🚨 ${summary.deaths} muerte(s) detectada(s)`);
    analysis.recommendations.push('Revisar balance de decaimiento de stats');
  }

  // Análisis de resonancia
  if (summary.averageResonance !== null) {
    if (summary.averageResonance < 30) {
      analysis.status = 'CRITICAL';
      analysis.alerts.push(`💔 Resonancia crítica: ${summary.averageResonance.toFixed(1)}`);
      analysis.recommendations.push('Aumentar interacciones NOURISH del jugador');
    } else if (summary.averageResonance < 50) {
      analysis.status = 'WARNING';
      analysis.alerts.push(`💛 Resonancia baja: ${summary.averageResonance.toFixed(1)}`);
    } else if (summary.averageResonance > 80) {
      analysis.status = 'EXCELLENT';
      analysis.insights.push(`💚 Resonancia excelente: ${summary.averageResonance.toFixed(1)}`);
    } else {
      analysis.status = 'GOOD';
      analysis.insights.push(`💙 Resonancia estable: ${summary.averageResonance.toFixed(1)}`);
    }
  }

  // Análisis de actividad
  const criticalRate = summary.totalEvents > 0 ? summary.criticalEvents / summary.totalEvents : 0;
  if (criticalRate > 0.3) {
    analysis.alerts.push(`⚠️ Alto ratio de eventos críticos: ${(criticalRate * 100).toFixed(1)}%`);
    analysis.recommendations.push('Revisar umbrales de stats críticas');
  }

  // Análisis de sistemas
  const topSystem = Object.entries(summary.bySystem)[0];
  if (topSystem) {
    const [system, count] = topSystem;
    analysis.insights.push(`🔧 Sistema más activo: ${system} (${count} eventos)`);
    
    if (system === 'autopoiesis' && count > summary.totalEvents * 0.6) {
      analysis.insights.push('Alto procesamiento de autopoiesis - sistema funcionando');
    }
  }

  // Análisis de zonas
  if (summary.zoneEffects === 0 && summary.totalEvents > 50) {
    analysis.alerts.push('🗺️ Sin efectos de zona - entidades no usan el mapa');
    analysis.recommendations.push('Revisar algoritmo de pathfinding hacia zonas');
  }

  // Análisis de cambios de actividad
  if (summary.activityChanges === 0 && summary.totalEvents > 30) {
    analysis.alerts.push('🎯 Sin cambios de actividad - IA podría estar bloqueada');
    analysis.recommendations.push('Revisar motor de decisiones de IA');
  }

  return analysis;
}

function printAnalysis(summary, analysis) {
  console.log('═'.repeat(70));
  console.log(`🎮 ANÁLISIS DÚOETERNO - ${analysis.timestamp}`);
  console.log('═'.repeat(70));
  
  // Estado general
  const statusIcon = {
    'EXCELLENT': '🟢',
    'GOOD': '🔵', 
    'WARNING': '🟡',
    'CRITICAL': '🔴',
    'NO_DATA': '⚫',
    'UNKNOWN': '⚪'
  }[analysis.status];
  
  console.log(`\nEstado: ${statusIcon} ${analysis.status}`);
  
  // Métricas rápidas
  console.log(`\n📊 MÉTRICAS (últimos 10 min)`);
  console.log(`   Eventos: ${summary.totalEvents}`);
  console.log(`   Muertes: ${summary.deaths}`);
  console.log(`   Críticos: ${summary.criticalEvents}`);
  console.log(`   Resonancia: ${summary.averageResonance?.toFixed(1) || 'N/A'}`);
  console.log(`   Cambios actividad: ${summary.activityChanges}`);
  console.log(`   Efectos zona: ${summary.zoneEffects}`);

  // Alertas
  if (analysis.alerts.length > 0) {
    console.log(`\n🚨 ALERTAS`);
    analysis.alerts.forEach(alert => console.log(`   ${alert}`));
  }

  // Insights
  if (analysis.insights.length > 0) {
    console.log(`\n💡 INSIGHTS`);
    analysis.insights.forEach(insight => console.log(`   ${insight}`));
  }

  // Recomendaciones
  if (analysis.recommendations.length > 0) {
    console.log(`\n🔧 RECOMENDACIONES`);
    analysis.recommendations.forEach(rec => console.log(`   ${rec}`));
  }

  console.log('\n' + '═'.repeat(70));
}

async function main() {
  try {
    console.log('🔍 Consultando estado del juego...');
    const summary = await fetchSummary();
    const analysis = analyzeSummary(summary);
    printAnalysis(summary, analysis);
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que el servidor esté ejecutándose:');
    console.log('   npm run server');
  }
}

main();