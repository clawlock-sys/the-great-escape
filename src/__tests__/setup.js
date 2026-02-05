import '@testing-library/jest-dom';

// Mock Howler for audio tests (audio files may not exist)
vi.mock('howler', () => ({
  Howl: vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    volume: vi.fn(),
    loop: vi.fn(),
    unload: vi.fn(),
  })),
}));
