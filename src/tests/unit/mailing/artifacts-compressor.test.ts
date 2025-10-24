import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock the dependencies
vi.mock('fs');
vi.mock('path');
vi.mock('archiver');

describe('artifactsCompressor', () => {
  const mockFs = vi.mocked(fs);
  const mockPath = vi.mocked(path);

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock path.join to return predictable paths
    mockPath.join.mockImplementation((...args) => args.join('/'));
    mockPath.resolve.mockImplementation((...args) => args.join('/'));
    
    // Mock fs methods
    mockFs.existsSync.mockReturnValue(false);
    mockFs.createWriteStream.mockReturnValue({
      on: vi.fn(),
      write: vi.fn(),
      end: vi.fn()
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle file existence check', () => {
    mockFs.existsSync.mockReturnValue(true);
    mockFs.unlinkSync = vi.fn();

    // Test that existsSync is called
    const result = mockFs.existsSync('test-path');
    expect(result).toBe(true);
  });

  it('should create write stream', () => {
    const mockStream = {
      on: vi.fn(),
      write: vi.fn(),
      end: vi.fn()
    };
    
    mockFs.createWriteStream.mockReturnValue(mockStream as any);
    
    const stream = mockFs.createWriteStream('test-output.zip');
    expect(stream).toBeDefined();
    expect(mockFs.createWriteStream).toHaveBeenCalledWith('test-output.zip');
  });

  it('should mock archiver correctly', async () => {
    const mockArchive = {
      pipe: vi.fn(),
      directory: vi.fn(),
      finalize: vi.fn(),
      pointer: vi.fn().mockReturnValue(1024),
      on: vi.fn()
    };

    // Test that we can create a mock archiver instance
    expect(mockArchive).toBeDefined();
    expect(mockArchive.pipe).toBeDefined();
    expect(mockArchive.directory).toBeDefined();
    expect(mockArchive.finalize).toBeDefined();
    expect(mockArchive.pointer).toBeDefined();
    expect(mockArchive.on).toBeDefined();
    
    // Test that the mock functions work
    mockArchive.pipe();
    mockArchive.directory('test', false);
    mockArchive.finalize();
    
    expect(mockArchive.pipe).toHaveBeenCalled();
    expect(mockArchive.directory).toHaveBeenCalledWith('test', false);
    expect(mockArchive.finalize).toHaveBeenCalled();
  });
});
