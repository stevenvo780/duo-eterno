import { promises as fs } from 'fs';

async function detailedAnalysis() {
  try {
    const data = await fs.readFile('./logs/current_session.json', 'utf8');
    const logData = JSON.parse(data);
    const { logs } = logData;
    
    console.log(`📊 Análisis detallado de ${logs.length} logs...`);
    
    // Buscar logs específicos de resonancia y sistema
    console.log('\n🔍 DEBUGGING RESONANCIA:');
    const proximityLogs = logs.filter(log => 
      log.message.includes('proximidad') || 
      log.message.includes('resonance') ||
      log.message.includes('Nutriendo vínculo') ||
      log.message.includes('BONDING') ||
      log.category === 'LOVE'
    );
    
    console.log(`Eventos relacionados con proximidad/resonancia: ${proximityLogs.length}`);
    proximityLogs.slice(0, 10).forEach((log, i) => {
      console.log(`${i+1}. [${new Date(log.timestamp).toLocaleTimeString()}] ${log.category}: ${log.message}`);
      if (log.data) {
        console.log(`   Data: ${JSON.stringify(log.data).substring(0, 100)}...`);
      }
    });
    
    // Analizar el sistema de autopoiesis
    console.log('\n⚙️ DEBUGGING AUTOPOIESIS:');
    const autopoiesisLogs = logs.filter(log => 
      log.message.includes('autopoiesis') ||
      log.message.includes('loop') ||
      log.category === 'SYSTEM'
    );
    console.log(`Eventos de autopoiesis: ${autopoiesisLogs.length}`);
    
    // Buscar primeros momentos del juego
    console.log('\n⏰ PRIMEROS 30 SEGUNDOS:');
    const firstMoments = logs.filter(log => 
      log.timestamp <= (logs[0].timestamp + 30000)
    );
    
    const firstStats = firstMoments.filter(log => 
      log.message.includes('críticas') || log.message.includes('salud')
    );
    
    console.log(`Eventos críticos en primeros 30s: ${firstStats.length}`);
    firstStats.slice(0, 5).forEach((log, i) => {
      console.log(`${i+1}. [${new Date(log.timestamp).toLocaleTimeString()}] ${log.entityId}: ${log.message}`);
    });
    
    // Analizar cambios de actividad
    console.log('\n🤖 CAMBIOS DE ACTIVIDAD:');
    const activityChanges = logs.filter(log => 
      log.message.includes('cambió actividad') ||
      log.message.includes('cambia actividad')
    );
    console.log(`Total cambios de actividad: ${activityChanges.length}`);
    activityChanges.slice(0, 10).forEach((log, i) => {
      console.log(`${i+1}. [${new Date(log.timestamp).toLocaleTimeString()}] ${log.entityId}: ${log.message}`);
    });
    
    // Buscar errores específicos
    console.log('\n❌ ERRORES Y WARNINGS:');
    const errors = logs.filter(log => log.level === 'ERROR' || log.level === 'WARNING');
    console.log(`Total errores/warnings: ${errors.length}`);
    errors.slice(-5).forEach((log, i) => {
      console.log(`${i+1}. [${new Date(log.timestamp).toLocaleTimeString()}] ${log.level}: ${log.message}`);
      if (log.data) {
        console.log(`   Data: ${JSON.stringify(log.data, null, 2)}`);
      }
    });
    
    // Analizar estado final
    console.log('\n📈 SNAPSHOTS DEL ESTADO:');
    const snapshots = logs.filter(log => 
      log.message.includes('snapshot') || 
      log.message.includes('estado')
    );
    console.log(`Snapshots encontrados: ${snapshots.length}`);
    
    if (snapshots.length > 0) {
      const lastSnapshot = snapshots[snapshots.length - 1];
      console.log(`Último snapshot: ${lastSnapshot.message}`);
      if (lastSnapshot.data) {
        console.log(`Data: ${JSON.stringify(lastSnapshot.data, null, 2)}`);
      }
    }
    
  } catch (error) {
    console.error('Error en análisis detallado:', error.message);
  }
}

detailedAnalysis();