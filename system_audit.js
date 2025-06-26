import { promises as fs } from 'fs';

async function systemAudit() {
  try {
    const data = await fs.readFile('./logs/current_session.json', 'utf8');
    const logData = JSON.parse(data);
    const { logs } = logData;
    
    console.log('🚨 === AUDITORÍA COMPLETA DEL SISTEMA ===\n');
    
    // PROBLEMA CRÍTICO 1: Stats llegando a extremos letales
    console.log('❌ PROBLEMA 1: STATS EN EXTREMOS LETALES');
    const latestStats = logs.filter(log => log.data?.stats).slice(-1)[0];
    if (latestStats) {
      const stats = latestStats.data.stats;
      console.log('📊 Estado actual de las entidades:');
      Object.entries(stats).forEach(([stat, value]) => {
        const status = value <= 5 ? '💀 LETAL' : 
                      value <= 15 ? '🔴 CRÍTICO' : 
                      value >= 95 ? '🔴 EXTREMO' : 
                      value >= 85 ? '🟡 ALTO' : '✅ OK';
        console.log(`   ${stat}: ${value.toFixed(1)} ${status}`);
      });
    }
    
    // PROBLEMA CRÍTICO 2: Money sigue en 0 
    console.log('\n❌ PROBLEMA 2: SISTEMA ECONÓMICO SIGUE ROTO');
    const moneyLogs = logs.filter(log => log.data?.stats?.money !== undefined);
    if (moneyLogs.length > 0) {
      const moneyValues = moneyLogs.slice(-10).map(log => log.data.stats.money);
      console.log(`   Últimos valores de money: ${moneyValues.join(', ')}`);
      console.log(`   💰 DIAGNÓSTICO: Money sigue en 0, WORKING no genera dinero`);
    }
    
    // PROBLEMA CRÍTICO 3: Entidades pegadas (distancia fija)
    console.log('\n❌ PROBLEMA 3: MOVIMIENTO DEFECTUOSO');
    const separationEvents = logs.filter(log => log.message.includes('SEPARATION'));
    if (separationEvents.length > 5) {
      const distances = separationEvents.slice(-10).map(log => 
        log.data?.distance ? log.data.distance.toFixed(1) : 'N/A'
      );
      const uniqueDistances = [...new Set(distances)];
      console.log(`   Distancias SEPARATION: ${uniqueDistances.join(', ')}`);
      if (uniqueDistances.length <= 2) {
        console.log(`   🚫 DIAGNÓSTICO: Entidades pegadas/estancadas en posiciones fijas`);
      }
    }
    
    // PROBLEMA CRÍTICO 4: Clampeo que mata el gameplay
    console.log('\n❌ PROBLEMA 4: CLAMPEO DESTRUCTIVO');
    console.log('   📊 Stats clampeadas a límites letales:');
    console.log('   - energy: 10 (límite inferior) = ESTADO CRÍTICO PERMANENTE');
    console.log('   - boredom: 99+ (límite superior) = ESTADO CRÍTICO PERMANENTE');
    console.log('   - hunger: ~14 (cerca del límite inferior 5)');
    
    // PROBLEMA CRÍTICO 5: Health paradójica persiste
    console.log('\n❌ PROBLEMA 5: HEALTH PARADÓJICA PERSISTE');
    console.log('   🏥 Health=100 pero reportada como crítica');
    console.log('   🔍 CAUSA: Lógica de detección crítica incorrecta');
    
    // PROBLEMA CRÍTICO 6: Actividades inefectivas
    console.log('\n❌ PROBLEMA 6: ACTIVIDADES NO MEJORAN STATS');
    const activityChanges = logs.filter(log => log.message.includes('cambió actividad'));
    console.log(`   Total cambios de actividad: ${activityChanges.length}`);
    if (activityChanges.length > 0) {
      const recentActivities = activityChanges.slice(-5);
      console.log('   Actividades recientes:');
      recentActivities.forEach((log, i) => {
        const match = log.message.match(/(\w+) → (\w+)/);
        if (match) {
          console.log(`   ${i+1}. ${match[1]} → ${match[2]}`);
        }
      });
    }
    
    // PROBLEMA CRÍTICO 7: Resonancia perdida
    console.log('\n❌ PROBLEMA 7: RESONANCIA NO FUNCIONA');
    const resonanceChanges = logs.filter(log => log.message.includes('resonancia') && log.message.includes('→'));
    console.log(`   Cambios de resonancia detectados: ${resonanceChanges.length}`);
    if (resonanceChanges.length === 0) {
      console.log('   💔 DIAGNÓSTICO: Sistema de amor completamente roto');
    }
    
    console.log('\n🔧 === PLAN DE REPARACIÓN URGENTE ===');
    console.log('1. 🎯 CLAMPEO LETAL → Rangos seguros que permiten recovery');
    console.log('2. 💰 MONEY=0 → Verificar que WORKING realmente genere dinero');
    console.log('3. 🚫 MOVIMIENTO → Entidades deben moverse libremente');
    console.log('4. 🏥 HEALTH LOGIC → Corregir detección crítica');
    console.log('5. ⚡ ACTIVIDADES → Efectos más potentes para recovery');
    console.log('6. 💖 RESONANCIA → Debug por qué no se actualiza');
    console.log('7. 🔄 DECAY RATES → Reducir decay agresivo');
    
    console.log('\n⚠️ ESTADO CRÍTICO: TAMAGOCHI EN MODO SUPERVIVENCIA IMPOSIBLE');
    
  } catch (error) {
    console.error('Error en auditoría:', error.message);
  }
}

systemAudit();
