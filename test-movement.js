// Test script para verificar movimiento
console.log('🧪 Iniciando test de movimiento...');

// Esperar a que la página cargue
setTimeout(() => {
  console.log('🔍 Verificando estado del juego...');
  
  // Verificar si hay entidades en el DOM
  const canvas = document.querySelector('canvas');
  if (canvas) {
    console.log('✅ Canvas encontrado');
  } else {
    console.log('❌ Canvas no encontrado');
  }
  
  // Simular clicks en los botones de debug
  const debugButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent.includes('Debug Info')
  );
  
  if (debugButton) {
    console.log('✅ Botón de debug encontrado');
    debugButton.click();
  } else {
    console.log('❌ Botón de debug no encontrado');
  }
  
  // Probar el botón de forzar movimiento
  const moveButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent.includes('Forzar Movimiento')
  );
  
  if (moveButton) {
    console.log('✅ Botón de movimiento encontrado');
    setTimeout(() => {
      moveButton.click();
      console.log('🎯 Movimiento forzado ejecutado');
    }, 2000);
  } else {
    console.log('❌ Botón de movimiento no encontrado');
  }
  
}, 3000);
