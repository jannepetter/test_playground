import "@testing-library/jest-dom";
import apiClient from "@/utils/fetcher";
import { expect } from "@playwright/test";

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
    
describe("Fetcher test", () => {
    it("sets the headers", async () => {
        window.localStorage.setItem("access", "testaccess")
        window.localStorage.setItem("refresh", "testrefresh")

        const request = apiClient.interceptors.request.handlers[0].fulfilled({
            data:"some data",
            headers:{}
        })
        expect(request.headers.Authorization).toBe("Bearer testaccess")
    });
});
