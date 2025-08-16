import { describe, it, expect, vi } from 'vitest';
import { logRenderCompat } from '../optimizedDynamicsLogger';

describe('render logger avoids undefined suffix', () => {
  it('does not print undefined when no data', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logRenderCompat('Canvas rendered');
    const args = spy.mock.calls[0]?.[0] as string;
    expect(args.includes('undefined')).toBe(false);
    spy.mockRestore();
  });
});
