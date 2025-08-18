import { useAnimation } from '../hooks/useAnimationSystem';
import type { Entity } from '../types';

export const getEntityAnimationName = (entity: Entity): string => {
  const { id, state, stats } = entity;
  

  let animationMood = 'happy';
  if (state === 'dead' || state === 'DEAD' || entity.isDead) {
    animationMood = 'dying';
  } else if (state === 'LOW_RESONANCE' || state === 'fading' || state === 'FADING') {
    animationMood = 'sad';
  } else if (stats.hunger < 30 || stats.loneliness > 70) {
    animationMood = 'sad';
  } else if (state === 'alive' || stats.happiness > 70) {
    animationMood = 'happy';
  }


  return `entidad_${id}_${animationMood}_anim`;
};

export const renderAnimatedEntity = (
  ctx: CanvasRenderingContext2D,
  entity: Entity,
  animationHook: {
    animation: { image: HTMLImageElement } | null;
    getCurrentFrame: () => { x: number; y: number; width: number; height: number } | null;
  },
  scale: number = 1
): void => {
  if (!animationHook.animation || !animationHook.getCurrentFrame) {

    renderFallbackEntity(ctx, entity, scale);
    return;
  }

  const frame = animationHook.getCurrentFrame();
  if (!frame) {
    renderFallbackEntity(ctx, entity, scale);
    return;
  }

  const { position } = entity;
  const renderWidth = frame.width * scale;
  const renderHeight = frame.height * scale;


  const renderX = position.x - renderWidth / 2;
  const renderY = position.y - renderHeight / 2;

  ctx.save();
  

  if (entity.isDead || entity.state === 'dead' || entity.state === 'DEAD') {
    ctx.globalAlpha = 0.5;
  }


  ctx.drawImage(
    animationHook.animation.image,
    frame.x, frame.y, frame.width, frame.height,
    renderX, renderY, renderWidth, renderHeight
  );

  ctx.restore();
};

const renderFallbackEntity = (
  ctx: CanvasRenderingContext2D,
  entity: Entity,
  scale: number
): void => {
  const { position, id, state, colorHue, stats } = entity;
  const size = 24 * scale;

  ctx.save();


  let color = `hsl(${colorHue || 200}, 70%, 50%)`;
  if (state === 'dead' || state === 'DEAD' || entity.isDead) {
    color = '#64748b';
    ctx.globalAlpha = 0.3;
  } else if (state === 'LOW_RESONANCE' || stats.hunger < 30 || stats.loneliness > 70) {
    color = `hsl(${colorHue || 200}, 70%, 30%)`;
  }

  ctx.fillStyle = color;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  if (id === 'circle') {
    ctx.beginPath();
    ctx.arc(position.x, position.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(
      position.x - size / 2,
      position.y - size / 2,
      size,
      size
    );
    ctx.strokeRect(
      position.x - size / 2,
      position.y - size / 2,
      size,
      size
    );
  }

  ctx.restore();
};


export const useEntityAnimation = (entity: Entity) => {
  const animationName = getEntityAnimationName(entity);
  const animationData = useAnimation(animationName, 'entities', true);

  return {
    ...animationData,
    render: (ctx: CanvasRenderingContext2D, scale: number = 1) => {
      renderAnimatedEntity(ctx, entity, animationData, scale);
    }
  };
};
