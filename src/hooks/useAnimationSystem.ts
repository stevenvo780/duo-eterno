import { useState, useEffect, useRef, useCallback } from 'react';

export interface AnimationMetadata {
  name: string;
  frame_count: number;
  frame_size: [number, number];
  columns: number;
  rows: number;
  total_duration: number;
  loop: boolean;
  frames: Array<{ duration: number }>;
}

export interface AnimationFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
}

export interface LoadedAnimation {
  image: HTMLImageElement;
  metadata: AnimationMetadata;
  frames: AnimationFrame[];
}

export interface AnimationState {
  currentFrame: number;
  elapsedTime: number;
  isPlaying: boolean;
}

class AnimationManager {
  private static instance: AnimationManager;
  private loadedAnimations: Map<string, LoadedAnimation> = new Map();
  private loadingPromises: Map<string, Promise<LoadedAnimation>> = new Map();

  static getInstance(): AnimationManager {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  async loadAnimation(name: string, category: string): Promise<LoadedAnimation> {
    const key = `${category}/${name}`;

    if (this.loadedAnimations.has(key)) {
      return this.loadedAnimations.get(key)!;
    }

    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key)!;
    }

    const loadPromise = this.loadAnimationFiles(name, category);
    this.loadingPromises.set(key, loadPromise);

    try {
      const animation = await loadPromise;
      this.loadedAnimations.set(key, animation);
      this.loadingPromises.delete(key);
      return animation;
    } catch (error) {
      this.loadingPromises.delete(key);
      throw error;
    }
  }

  private async loadAnimationFiles(name: string, category: string): Promise<LoadedAnimation> {
    const basePath = `/assets/animated_entities/${category}/${name}`;

    const metadataResponse = await fetch(`${basePath}.json`);
    if (!metadataResponse.ok) {
      throw new Error(`Failed to load animation metadata: ${basePath}.json`);
    }
    const metadata: AnimationMetadata = await metadataResponse.json();

    const image = new Image();
    const imagePromise = new Promise<HTMLImageElement>((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load animation image: ${basePath}.png`));
      image.src = `${basePath}.png`;
    });

    await imagePromise;

    const frames = this.calculateFrames(metadata);

    return {
      image,
      metadata,
      frames
    };
  }

  private calculateFrames(metadata: AnimationMetadata): AnimationFrame[] {
    const frames: AnimationFrame[] = [];
    const [frameWidth, frameHeight] = metadata.frame_size;

    for (let i = 0; i < metadata.frame_count; i++) {
      const col = i % metadata.columns;
      const row = Math.floor(i / metadata.columns);

      frames.push({
        x: col * frameWidth,
        y: row * frameHeight,
        width: frameWidth,
        height: frameHeight,
        duration: metadata.frames[i]?.duration || 100
      });
    }

    return frames;
  }

  getAnimation(name: string, category: string): LoadedAnimation | null {
    const key = `${category}/${name}`;
    return this.loadedAnimations.get(key) || null;
  }

  preloadAnimations(animations: Array<{ name: string; category: string }>): Promise<void> {
    const promises = animations.map(async ({ name, category }) => {
      try {
        await this.loadAnimation(name, category);
      } catch (error) {
        console.warn(`Failed to preload animation ${category}/${name}:`, error);
      }
    });
    return Promise.all(promises).then(() => void 0);
  }
}

export const useAnimationSystem = () => {
  const manager = AnimationManager.getInstance();

  return {
    loadAnimation: manager.loadAnimation.bind(manager),
    getAnimation: manager.getAnimation.bind(manager),
    preloadAnimations: manager.preloadAnimations.bind(manager)
  };
};

export const useAnimation = (name: string, category: string, autoPlay: boolean = true) => {
  const [animation, setAnimation] = useState<LoadedAnimation | null>(null);
  const [state, setState] = useState<AnimationState>({
    currentFrame: 0,
    elapsedTime: 0,
    isPlaying: autoPlay
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lastUpdateRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const { loadAnimation } = useAnimationSystem();

  useEffect(() => {
    let mounted = true;

    loadAnimation(name, category)
      .then(loadedAnimation => {
        if (mounted) {
          setAnimation(loadedAnimation);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [name, category, loadAnimation]);

  const updateAnimation = useCallback(
    (timestamp: number) => {
      if (!animation || !state.isPlaying) return;

      const deltaTime = timestamp - lastUpdateRef.current;
      lastUpdateRef.current = timestamp;

      setState(prevState => {
        const newElapsedTime = prevState.elapsedTime + deltaTime;
        const currentFrame = prevState.currentFrame;
        const frameDuration = animation.frames[currentFrame]?.duration || 100;

        if (newElapsedTime >= frameDuration) {
          const nextFrame = (currentFrame + 1) % animation.frames.length;

          if (
            !animation.metadata.loop &&
            nextFrame === 0 &&
            currentFrame === animation.frames.length - 1
          ) {
            return {
              ...prevState,
              isPlaying: false
            };
          }

          return {
            ...prevState,
            currentFrame: nextFrame,
            elapsedTime: newElapsedTime - frameDuration
          };
        }

        return {
          ...prevState,
          elapsedTime: newElapsedTime
        };
      });

      if (state.isPlaying) {
        animationFrameRef.current = requestAnimationFrame(updateAnimation);
      }
    },
    [animation, state.isPlaying]
  );

  useEffect(() => {
    if (state.isPlaying && animation) {
      lastUpdateRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateAnimation);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlaying, animation, updateAnimation]);

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentFrame: 0,
      elapsedTime: 0
    }));
  }, []);

  const getCurrentFrame = useCallback(() => {
    if (!animation) return null;
    return animation.frames[state.currentFrame];
  }, [animation, state.currentFrame]);

  return {
    animation,
    state,
    loading,
    error,
    getCurrentFrame,
    play,
    pause,
    reset
  };
};
