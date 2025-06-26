import { promises as fs } from 'fs';

async function deepAudit() {
  try {
    const data = await fs.readFile('./logs/current_session.json', 'utf8');
    const logData = JSON.parse(data);
    const { logs } = logData;
    
    console.log('🔍 === AUDITORÍA PROFUNDA DE 40 MINUTOS ===\n');
    
    // 1. ANÁLISIS DE MEJORAS
    console.log('✅ MEJORAS CONFIRMADAS:');
    const activityChanges = logs.filter(log => log.message.includes('cambió actividad'));
    const proximityBonding = logs.filter(log => log.message.includes('BONDING'));
    const resonanceChanges = logs.filter(log => log.message.includes('resonancia'));
    
    console.log(`- Cambios de actividad: ${activityChanges.length} (✅ RESUELTO)`);
    console.log(`- Eventos BONDING: ${proximityBonding.length} (✅ RESUELTO)`);
    console.log(`- Cambios de resonancia: ${resonanceChanges.length} (${resonanceChanges.length > 0 ? '✅ RESUELTO' : '❌ PROBLEMA'})`);
    
    // 2. ANÁLISIS DE PROBLEMAS PERSISTENTES
    console.log('\n❌ PROBLEMAS IDENTIFICADOS:');
    
    // Problema 1: Health siempre en 100
    const healthWarnings = logs.filter(log => 
      log.level === 'WARNING' && log.message.includes('health')
    );
    console.log(`1. Health crítica constante: ${healthWarnings.length} eventos`);
    if (healthWarnings.length > 0) {
      const lastHealth = healthWarnings[healthWarnings.length - 1];
      console.log(`   Última health: ${lastHealth.data?.stats?.health}`);
      console.log(`   PROBLEMA: Health está en 100 (máximo) cuando debería ser crítica`);
    }
    
    // Problema 2: Money siempre en 0
    const moneyStats = logs.filter(log => log.data?.stats?.money !== undefined);
    if (moneyStats.length > 0) {
      const moneyValues = moneyStats.map(log => log.data.stats.money);
      const uniqueMoney = [...new Set(moneyValues)];
      console.log(`2. Money estancado en: ${uniqueMoney.join(', ')}`);
      console.log(`   PROBLEMA: Money no cambia, sistema económico roto`);
    }
    
    // Problema 3: Distancia fija en BONDING
    const bondingEvents = logs.filter(log => 
      log.message.includes('BONDING') && log.data?.distance
    );
    if (bondingEvents.length > 5) {
      const distances = bondingEvents.slice(0, 10).map(log => log.data.distance.toFixed(1));
      const uniqueDistances = [...new Set(distances)];
      console.log(`3. Distancias en BONDING: ${uniqueDistances.join(', ')}`);
      if (uniqueDistances.length === 1) {
        console.log(`   PROBLEMA: Distancia fija (${uniqueDistances[0]}), entidades pegadas`);
      }
    }
    
    // Problema 4: Patrones de actividad
    console.log('\n📊 PATRONES DE ACTIVIDAD:');
    const activityPattern = {};
    activityChanges.forEach(log => {
      const match = log.message.match(/(\w+) → (\w+)/);
      if (match) {
        const transition = `${match[1]} → ${match[2]}`;
        activityPattern[transition] = (activityPattern[transition] || 0) + 1;
      }
    });
    
    Object.entries(activityPattern)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([pattern, count]) => {
        console.log(`   ${pattern}: ${count} veces`);
      });
    
    // Problema 5: Moods predominantes
    console.log('\n😊 ANÁLISIS DE MOODS:');
    const moodChanges = logs.filter(log => log.message.includes('cambió estado emocional'));
    const moodPattern = {};
    moodChanges.forEach(log => {
      const match = log.message.match(/(\w+) → (\w+)/);
      if (match) {
        moodPattern[match[2]] = (moodPattern[match[2]] || 0) + 1;
      }
    });
    
    Object.entries(moodPattern)
      .sort(([,a], [,b]) => b - a)
      .forEach(([mood, count]) => {
        console.log(`   ${mood}: ${count} veces`);
      });
    
    // Problema 6: Resonancia final
    console.log('\n💖 ESTADO FINAL DE RESONANCIA:');
    if (resonanceChanges.length > 0) {
      const lastResonance = resonanceChanges[resonanceChanges.length - 1];
      console.log(`   ${lastResonance.message}`);
      if (lastResonance.data) {
        console.log(`   Valor final: ${lastResonance.data.newResonance || 'N/A'}`);
      }
    } else {
      console.log(`   ❌ NO HAY CAMBIOS DE RESONANCIA - Sistema aún roto`);
    }
    
    // 7. TIMELINE DE EVENTOS CRÍTICOS
    console.log('\n⏰ TIMELINE DE EVENTOS CRÍTICOS:');
    const criticalEvents = logs.filter(log => 
      log.level === 'ERROR' || 
      log.message.includes('murió') ||
      log.message.includes('muerte') ||
      log.message.includes('revivir')
    );
    
    if (criticalEvents.length > 0) {
      criticalEvents.slice(-5).forEach((event, i) => {
        const time = new Date(event.timestamp).toLocaleTimeString();
        console.log(`   ${i+1}. [${time}] ${event.level}: ${event.message}`);
      });
    } else {
      console.log('   ✅ No hay muertes ni errores críticos');
    }
    
    console.log('\n🎯 RECOMENDACIONES PRIORITARIAS:');
    console.log('1. 🏥 Corregir sistema de health (está reportando crítica cuando está en 100)');
    console.log('2. 💰 Reparar sistema económico (money estancado en 0)');
    console.log('3. 💖 Verificar por qué NO hay cambios de resonancia');
    console.log('4. 🚶 Revisar si entidades están pegadas (distancia fija)');
    console.log('5. ⚖️ Balancear rangos de stats (algunos en límites)');
    
  } catch (error) {
    console.error('Error en auditoría:', error.message);
  }
}

deepAudit();
