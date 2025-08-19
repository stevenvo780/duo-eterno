/**
 * 🗺️ HOOK DE NAVEGACIÓN DEL MAPA
 * 
 * Maneja controles WASD, mouse drag, zoom y navegación del mapa
 */

import { useState, useEffect, useRef, useCallback } from 'react';

export interface NavigationState {
  panX: number;
  panY: number;
  zoom: number;
  isDragging: boolean;
}

export interface NavigationControls {
  state: NavigationState;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleWheel: (e: React.WheelEvent) => void;
  resetView: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  moveToPosition: (x: number, y: number) => void;
}

interface UseMapNavigationProps {
  initialX?: number;
  initialY?: number;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  mapWidth?: number;
  mapHeight?: number;
  panSpeed?: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

export const useMapNavigation = ({
  initialX = 0,
  initialY = 0,
  initialZoom = 1,
  minZoom = 0.3,
  maxZoom = 3,
  mapWidth = 2000,
  mapHeight = 1500,
  panSpeed = 5,
  canvasWidth = 800,
  canvasHeight = 600
}: UseMapNavigationProps = {}): NavigationControls => {
  
  const [state, setState] = useState<NavigationState>({
    panX: initialX,
    panY: initialY,
    zoom: initialZoom,
    isDragging: false
  });

  const lastMousePos = useRef({ x: 0, y: 0 });
  const keysPressed = useRef(new Set<string>());

  // Controles de teclado WASD
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      keysPressed.current.add(key);
      e.preventDefault();
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    keysPressed.current.delete(key);
  }, []);

  // Aplicar movimiento basado en teclas presionadas
  const applyKeyboardMovement = useCallback(() => {
    setState(prev => {
      const moveDistance = panSpeed / prev.zoom; // Movimiento ajustado por zoom
      let newX = prev.panX;
      let newY = prev.panY;

      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) {
        newX -= moveDistance;
      }
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) {
        newX += moveDistance;
      }
      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) {
        newY -= moveDistance;
      }
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) {
        newY += moveDistance;
      }

      // Limitar panning dentro de los límites del mapa
      newX = Math.max(0, Math.min(mapWidth - canvasWidth / prev.zoom, newX));
      newY = Math.max(0, Math.min(mapHeight - canvasHeight / prev.zoom, newY));

      return {
        ...prev,
        panX: newX,
        panY: newY
      };
    });
  }, [panSpeed, mapWidth, mapHeight]);

  // Configurar listeners de teclado
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const intervalId = setInterval(() => {
      if (keysPressed.current.size > 0) {
        applyKeyboardMovement();
      }
    }, 16); // ~60fps

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(intervalId);
    };
  }, [handleKeyDown, handleKeyUp, applyKeyboardMovement]);

  // Controles de mouse para drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setState(prev => ({ ...prev, isDragging: true }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!state.isDragging) return;

    const deltaX = (e.clientX - lastMousePos.current.x) / state.zoom;
    const deltaY = (e.clientY - lastMousePos.current.y) / state.zoom;

    setState(prev => {
      let newX = prev.panX - deltaX;
      let newY = prev.panY - deltaY;

      // Limitar panning dentro de los límites del mapa
      newX = Math.max(0, Math.min(mapWidth - canvasWidth / prev.zoom, newX));
      newY = Math.max(0, Math.min(mapHeight - canvasHeight / prev.zoom, newY));

      return {
        ...prev,
        panX: newX,
        panY: newY
      };
    });

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [state.isDragging, state.zoom, mapWidth, mapHeight]);

  const handleMouseUp = useCallback((_e: React.MouseEvent) => {
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  // Control de zoom con rueda del mouse
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    
    setState(prev => {
      const newZoom = Math.max(minZoom, Math.min(maxZoom, prev.zoom * zoomFactor));
      
      // Ajustar pan para mantener el centro aproximadamente en el mismo lugar
      const centerX = prev.panX + (canvasWidth / prev.zoom) / 2;
      const centerY = prev.panY + (canvasHeight / prev.zoom) / 2;
      
      let newX = centerX - (canvasWidth / newZoom) / 2;
      let newY = centerY - (canvasHeight / newZoom) / 2;
      
      // Limitar panning
      newX = Math.max(0, Math.min(mapWidth - canvasWidth / newZoom, newX));
      newY = Math.max(0, Math.min(mapHeight - canvasHeight / newZoom, newY));
      
      return {
        ...prev,
        zoom: newZoom,
        panX: newX,
        panY: newY
      };
    });
  }, [minZoom, maxZoom, mapWidth, mapHeight]);

  // Funciones de utilidad
  const resetView = useCallback(() => {
    setState({
      panX: initialX,
      panY: initialY,
      zoom: initialZoom,
      isDragging: false
    });
  }, [initialX, initialY, initialZoom]);

  const zoomIn = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoom: Math.min(maxZoom, prev.zoom * 1.2)
    }));
  }, [maxZoom]);

  const zoomOut = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoom: Math.max(minZoom, prev.zoom * 0.8)
    }));
  }, [minZoom]);

  const moveToPosition = useCallback((x: number, y: number) => {
    setState(prev => ({
      ...prev,
      panX: x - (canvasWidth / prev.zoom) / 2,
      panY: y - (canvasHeight / prev.zoom) / 2
    }));
  }, [canvasWidth, canvasHeight]);

  return {
    state,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    resetView,
    zoomIn,
    zoomOut,
    moveToPosition
  };
};
