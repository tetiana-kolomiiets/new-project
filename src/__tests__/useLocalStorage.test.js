import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '../src/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  const TEST_KEY = 'test-key';
  const INITIAL_VALUE = 'initial';
  const NEW_VALUE = 'new-value';

  let localStorageMock;
  let consoleErrorSpy;

  beforeEach(() => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    // Temporarily replace window.localStorage with our mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true, // Allow redefinition
    });

    // Suppress console.error output and spy on it for assertions
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restores console.error and window.localStorage
  });

  // Test case 1: Initial value when localStorage is empty
  test('should return initialValue if no item is in localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(result.current[0]).toBe(INITIAL_VALUE);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(TEST_KEY);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  // Test case 2: Initial value when item exists in localStorage
  test('should return the parsed value from localStorage if an item exists', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(NEW_VALUE));

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(result.current[0]).toBe(NEW_VALUE);
    expect(localStorageMock.getItem).toHaveBeenCalledWith(TEST_KEY);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  // Test case 3: Setting a new value
  test('should update the stored value and localStorage when setValue is called', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(result.current[0]).toBe(INITIAL_VALUE);

    act(() => {
      result.current[1](NEW_VALUE);
    });

    expect(result.current[0]).toBe(NEW_VALUE);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(TEST_KEY, JSON.stringify(NEW_VALUE));
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  // Test case 4: Setting a new value using a function
  test('should update the stored value and localStorage when setValue is called with a function', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(10)); // Initial value from storage
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, 0));

    expect(result.current[0]).toBe(10);

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(TEST_KEY, JSON.stringify(15));
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  // Test case 5: Error handling for getItem during initialization
  test('should use initialValue and log error if getItem fails during initialization', () => {
    const error = new Error('Failed to read from storage');
    localStorageMock.getItem.mockImplementation(() => { throw error; });

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(result.current[0]).toBe(INITIAL_VALUE);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error reading from localStorage:', error);
  });

  // Test case 6: Error handling for setItem
  test('should log error if setItem fails', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const error = new Error('Failed to write to storage');
    localStorageMock.setItem.mockImplementation(() => { throw error; });

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    act(() => {
      result.current[1](NEW_VALUE);
    });

    // The state should still update locally even if localStorage write fails
    expect(result.current[0]).toBe(NEW_VALUE);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving to localStorage:', error);
  });

  // Test case 7: Storage event updates the hook's state
  test('should update the stored value when a storage event for the key occurs', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(result.current[0]).toBe(INITIAL_VALUE);

    const newValueFromOtherTab = 'external-update';
    const storageEvent = new StorageEvent('storage', {
      key: TEST_KEY,
      newValue: JSON.stringify(newValueFromOtherTab),
      oldValue: JSON.stringify(INITIAL_VALUE),
      url: 'http://localhost',
      storageArea: window.localStorage,
    });

    act(() => {
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe(newValueFromOtherTab);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  // Test case 8: Storage event for a different key should not update the hook's state
  test('should not update the stored value when a storage event for a different key occurs', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(result.current[0]).toBe(INITIAL_VALUE);

    const storageEvent = new StorageEvent('storage', {
      key: 'another-key',
      newValue: JSON.stringify('some-other-value'),
      oldValue: JSON.stringify('old-other-value'),
      url: 'http://localhost',
      storageArea: window.localStorage,
    });

    act(() => {
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe(INITIAL_VALUE);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  // Test case 9: Storage event with invalid JSON in newValue
  test('should log error if storage event newValue is invalid JSON', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(result.current[0]).toBe(INITIAL_VALUE);

    const storageEvent = new StorageEvent('storage', {
      key: TEST_KEY,
      newValue: '{invalid json',
      oldValue: JSON.stringify(INITIAL_VALUE),
      url: 'http://localhost',
      storageArea: window.localStorage,
    });

    act(() => {
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe(INITIAL_VALUE);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error parsing storage event:', expect.any(Error));
  });

  // Test case 10: Cleanup of event listener on unmount
  test('should remove event listener on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    localStorageMock.getItem.mockReturnValue(null);

    const { unmount } = renderHook(() => useLocalStorage(TEST_KEY, INITIAL_VALUE));

    expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

    unmount();

    // Ensure removeEventListener was called with the same handler function
    const addedHandler = addEventListenerSpy.mock.calls[0][1];
    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', addedHandler);
  });
});