import { saveUserToLocalStorage } from '@/utils/storage'

const mockLocalStorage = (() => {
    let store = {};
    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value.toString();
      },
      removeItem(key) {
        delete store[key];
      },
      clear() {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

describe('test storage', () => {

  it('should save user data to localStorage', () => {
    const userData = {
      access: 'access-token',
      refresh: 'refresh-token',
      user: {
        username: 'testuser',
        id: '12345',
        admin: false
      },
    };

    saveUserToLocalStorage(userData);
    expect(mockLocalStorage.getItem('access')).toBe('access-token');
    expect(mockLocalStorage.getItem('refresh')).toBe('refresh-token');
    expect(mockLocalStorage.getItem('username')).toBe('testuser');
    expect(mockLocalStorage.getItem('userId')).toBe('12345');
    expect(mockLocalStorage.getItem('admin')).toBe("false");
  });
});
