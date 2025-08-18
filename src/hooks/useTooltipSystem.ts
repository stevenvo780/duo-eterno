import { useState, useCallback, useRef, useEffect } from 'react';

interface TooltipData {
  id: string;
  name: string;
  description: string;
  effects: string[];
  type: 'zone' | 'entity' | 'furniture';
  color: string;
}

interface TooltipState {
  data: TooltipData | null;
  x: number;
  y: number;
  visible: boolean;
}

interface HoverTarget {
  x: number;
  y: number;
  width: number;
  height: number;
  data: TooltipData;
}

const useTooltipSystem = () => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    data: null,
    x: 0,
    y: 0,
    visible: false
  });

  const [hoverTargets, setHoverTargets] = useState<HoverTarget[]>([]);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Registrar zonas que pueden mostrar tooltips
  const registerTooltipZone = useCallback((
    x: number,
    y: number,
    width: number,
    height: number,
    data: TooltipData
  ) => {
    setHoverTargets(prev => [
      ...prev.filter(target => target.data.id !== data.id),
      { x, y, width, height, data }
    ]);
  }, []);

  // Desregistrar zona
  const unregisterTooltipZone = useCallback((id: string) => {
    setHoverTargets(prev => prev.filter(target => target.data.id !== id));
  }, []);

  // Detectar hover sobre canvas
  const handleCanvasMouseMove = useCallback((
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Buscar si el mouse está sobre alguna zona registrada
    const hoveredTarget = hoverTargets.find(target =>
      mouseX >= target.x &&
      mouseX <= target.x + target.width &&
      mouseY >= target.y &&
      mouseY <= target.y + target.height
    );

    if (hoveredTarget) {
      // Cancelar timeout de ocultación
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      // Si ya está mostrando este tooltip, solo actualizar posición
      if (tooltip.visible && tooltip.data?.id === hoveredTarget.data.id) {
        setTooltip(prev => ({
          ...prev,
          x: event.clientX + 15,
          y: event.clientY - 10
        }));
        return;
      }

      // Configurar timeout para mostrar tooltip
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      hoverTimeoutRef.current = setTimeout(() => {
        setTooltip({
          data: hoveredTarget.data,
          x: event.clientX + 15,
          y: event.clientY - 10,
          visible: true
        });
      }, 300); // Delay de 300ms para evitar tooltips accidentales

    } else {
      // No hay hover, ocultar tooltip con delay
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }

      if (tooltip.visible) {
        hideTimeoutRef.current = setTimeout(() => {
          setTooltip(prev => ({ ...prev, visible: false }));
        }, 200); // Delay para permitir mover mouse al tooltip
      }
    }
  }, [hoverTargets, tooltip]);

  // Ocultar tooltip
  const hideTooltip = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Datos predefinidos para zonas comunes
  const getZoneTooltipData = useCallback((zoneType: string, x: number, y: number): TooltipData => {
    const zoneData = {
      bedroom: {
        name: 'Dormitorio Místico',
        description: 'Una habitación encantada donde las entidades descansan y regeneran energía vital.',
        effects: [
          'Restaura +2 energía por minuto',
          'Reduce estrés gradualmente',
          'Mejora el estado de ánimo',
          'Acelera la curación natural'
        ],
        color: '#7b68ee'
      },
      kitchen: {
        name: 'Cocina Encantada',
        description: 'Un espacio mágico donde se preparan pociones nutritivas y alimentos especiales.',
        effects: [
          'Genera recursos alimentarios',
          'Mejora la nutrición +15%',
          'Posibilidad de crear pociones',
          'Aumenta satisfacción social'
        ],
        color: '#32cd32'
      },
      living: {
        name: 'Sala Celestial',
        description: 'Un área social donde las entidades interactúan y fortalecen sus vínculos.',
        effects: [
          'Mejora relaciones sociales',
          'Reduce soledad y ansiedad',
          'Aumenta felicidad grupal',
          'Facilita nuevas amistades'
        ],
        color: '#4a90e2'
      },
      garden: {
        name: 'Jardín de Cristales',
        description: 'Un oasis natural lleno de plantas mágicas y cristales energéticos.',
        effects: [
          'Purifica el ambiente',
          'Genera energía mística',
          'Mejora la salud mental',
          'Atrae entidades especiales'
        ],
        color: '#50cd32'
      },
      bathroom: {
        name: 'Baño Purificador',
        description: 'Un santuario de limpieza y renovación espiritual.',
        effects: [
          'Limpia estados negativos',
          'Regenera salud lentamente',
          'Mejora autoestima',
          'Elimina maldiciones menores'
        ],
        color: '#00bfff'
      }
    };

    const data = zoneData[zoneType as keyof typeof zoneData] || {
      name: 'Zona Desconocida',
      description: 'Una región misteriosa con propiedades aún por descubrir.',
      effects: ['Efectos desconocidos'],
      color: '#666'
    };

    return {
      id: `zone_${zoneType}_${x}_${y}`,
      type: 'zone',
      ...data
    };
  }, []);

  // Registrar zonas automáticamente basado en el mapa
  const registerGameZones = useCallback(() => {
    // gameMap se podría usar en el futuro para zonas dinámicas
    const zones: HoverTarget[] = [];

    // Ejemplo de zonas predefinidas (esto se podría generar dinámicamente)
    const zoneDefinitions = [
      { type: 'bedroom', x: 50, y: 50, width: 150, height: 100 },
      { type: 'kitchen', x: 250, y: 50, width: 120, height: 80 },
      { type: 'living', x: 50, y: 200, width: 200, height: 120 },
      { type: 'garden', x: 300, y: 200, width: 180, height: 150 },
      { type: 'bathroom', x: 400, y: 50, width: 80, height: 60 }
    ];

    zoneDefinitions.forEach(zone => {
      const tooltipData = getZoneTooltipData(zone.type, zone.x, zone.y);
      zones.push({
        x: zone.x,
        y: zone.y,
        width: zone.width,
        height: zone.height,
        data: tooltipData
      });
    });

    setHoverTargets(zones);
  }, [getZoneTooltipData]);

  return {
    tooltip,
    registerTooltipZone,
    unregisterTooltipZone,
    handleCanvasMouseMove,
    hideTooltip,
    registerGameZones,
    hoverTargets
  };
};

export default useTooltipSystem;
