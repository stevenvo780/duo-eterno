#!/usr/bin/env node
/**
 * Dashboard en tiempo real para monitorear Dúo Eterno
 * Consulta /api/logs/summary cada 30s y muestra tabla ASCII
 */

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3002/api/logs/summary?window=10';
const REFRESH_INTERVAL = 30000; // 30 segundos

function formatTable(summary) {
  const { 
    totalEvents, deaths, criticalEvents, resonanceEvents, activityChanges, zoneEffects,
    averageResonance, minResonance, maxResonance, bySystem, byLevel, topEntities 
  } = summary;

  console.clear();
  console.log('═'.repeat(80));
  console.log('🎮 DÚO ETERNO - ANÁLISIS EN TIEMPO REAL');
  console.log('═'.repeat(80));
  
  // Métricas principales
  console.log('\n📊 MÉTRICAS GENERALES (últimos 10 min)');
  console.log('─'.repeat(50));
  console.log(`Total eventos:      ${totalEvents.toString().padStart(6)}`);
  console.log(`Muertes:           ${deaths.toString().padStart(6)} ${deaths > 0 ? '🚨' : '✅'}`);
  console.log(`Eventos críticos:  ${criticalEvents.toString().padStart(6)} ${criticalEvents > 5 ? '⚠️' : '✅'}`);
  console.log(`Cambios actividad:  ${activityChanges.toString().padStart(6)}`);
  console.log(`Efectos de zona:    ${zoneEffects.toString().padStart(6)}`);
  console.log(`Eventos resonancia: ${resonanceEvents.toString().padStart(6)}`);

  // Resonancia
  console.log('\n💖 RESONANCIA');
  console.log('─'.repeat(30));
  if (averageResonance !== null) {
    const status = averageResonance > 70 ? '💚' : averageResonance > 40 ? '💛' : '💔';
    console.log(`Promedio: ${averageResonance.toFixed(1).padStart(6)} ${status}`);
    console.log(`Mínima:   ${minResonance.toFixed(1).padStart(6)}`);
    console.log(`Máxima:   ${maxResonance.toFixed(1).padStart(6)}`);
  } else {
    console.log('Sin datos de resonancia');
  }

  // Top sistemas
  console.log('\n🔧 SISTEMAS MÁS ACTIVOS');
  console.log('─'.repeat(30));
  Object.entries(bySystem).slice(0, 5).forEach(([system, count]) => {
    console.log(`${system.padEnd(15)} ${count.toString().padStart(5)}`);
  });

  // Niveles de log
  console.log('\n📝 NIVELES DE LOG');
  console.log('─'.repeat(25));
  Object.entries(byLevel).forEach(([level, count]) => {
    const icon = level === 'error' ? '🔴' : level === 'warn' ? '🟡' : '🟢';
    console.log(`${level.padEnd(8)} ${count.toString().padStart(5)} ${icon}`);
  });

  // Top entidades
  if (Object.keys(topEntities).length > 0) {
    console.log('\n👥 ENTIDADES MÁS ACTIVAS');
    console.log('─'.repeat(30));
    Object.entries(topEntities).forEach(([entity, count]) => {
      const icon = entity === 'circle' ? '●' : '■';
      console.log(`${entity.padEnd(10)} ${count.toString().padStart(5)} ${icon}`);
    });
  }

  console.log('\n' + '═'.repeat(80));
  console.log(`Última actualización: ${new Date().toLocaleTimeString()}`);
}

async function fetchAndDisplay() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const summary = await response.json();
    formatTable(summary);
  } catch (error) {
    console.clear();
    console.log('❌ Error conectando al servidor:');
    console.log(`   ${error.message}`);
    console.log('\n💡 Asegúrate de que el servidor esté ejecutándose:');
    console.log('   npm run server');
  }
}

// Ejecutar inmediatamente y luego cada 30s
console.log('🚀 Iniciando dashboard...');
fetchAndDisplay();
setInterval(fetchAndDisplay, REFRESH_INTERVAL);

// Manejar Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Dashboard detenido');
  process.exit(0);
});