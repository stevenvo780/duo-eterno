import { promises as fs } from 'fs';
import path from 'path';

async function analyzeLogs() {
  try {
    const currentLogPath = './logs/current_session.json';
    const data = await fs.readFile(currentLogPath, 'utf8');
    const logData = JSON.parse(data);
    const { logs } = logData;
    
    console.log(`📊 Analizando ${logs.length} logs...`);
    
    // Buscar muertes
    const deaths = logs.filter(log => 
      log.message.includes('murió') || 
      log.message.includes('muerte') ||
      log.message.includes('KILL_ENTITY')
    );
    
    console.log(`\n💀 MUERTES ENCONTRADAS: ${deaths.length}`);
    deaths.forEach((death, i) => {
      console.log(`${i+1}. [${new Date(death.timestamp).toLocaleTimeString()}] ${death.entityId || 'unknown'}: ${death.message}`);
      if (death.data) {
        console.log(`   Stats: ${JSON.stringify(death.data, null, 2)}`);
      }
    });
    
    // Buscar eventos críticos antes de las muertes
    console.log(`\n⚠️ EVENTOS CRÍTICOS:`);
    const criticalEvents = logs.filter(log => 
      log.level === 'WARNING' || 
      log.message.includes('críticas') ||
      log.message.includes('salud') ||
      log.message.includes('ANXIOUS') ||
      log.message.includes('SAD')
    );
    
    console.log(`Total eventos críticos: ${criticalEvents.length}`);
    criticalEvents.slice(-10).forEach((event, i) => {
      console.log(`${i+1}. [${new Date(event.timestamp).toLocaleTimeString()}] ${event.entityId || 'system'}: ${event.message}`);
    });
    
    // Analizar resonancia
    console.log(`\n💖 ANÁLISIS DE RESONANCIA:`);
    const resonanceEvents = logs.filter(log => log.message.includes('resonancia'));
    console.log(`Total cambios de resonancia: ${resonanceEvents.length}`);
    
    if (resonanceEvents.length > 0) {
      const lastResonance = resonanceEvents[resonanceEvents.length - 1];
      console.log(`Último evento de resonancia: ${lastResonance.message}`);
      if (lastResonance.data) {
        console.log(`Data: ${JSON.stringify(lastResonance.data, null, 2)}`);
      }
    }
    
    // Analizar proximidad
    console.log(`\n🤝 ANÁLISIS DE PROXIMIDAD:`);
    const proximityEvents = logs.filter(log => log.message.includes('proximidad'));
    console.log(`Total eventos de proximidad: ${proximityEvents.length}`);
    
    // Tiempo de sesión
    const sessionStart = logs[0]?.timestamp || Date.now();
    const sessionEnd = logs[logs.length - 1]?.timestamp || Date.now();
    const sessionDuration = (sessionEnd - sessionStart) / 1000;
    
    console.log(`\n⏱️ DURACIÓN DE SESIÓN: ${sessionDuration.toFixed(1)} segundos`);
    
    // Estadísticas de supervivencia
    console.log(`\n🏥 ANÁLISIS DE SALUD:`);
    const healthEvents = logs.filter(log => 
      log.message.includes('salud') || 
      log.message.includes('health')
    );
    console.log(`Eventos de salud: ${healthEvents.length}`);
    
    const lastHealthEvents = healthEvents.slice(-5);
    lastHealthEvents.forEach((event, i) => {
      console.log(`${i+1}. [${new Date(event.timestamp).toLocaleTimeString()}] ${event.entityId}: ${event.message}`);
    });
    
  } catch (error) {
    console.error('Error analizando logs:', error.message);
  }
}

analyzeLogs();
