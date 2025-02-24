import "@testing-library/jest-dom";
import apiClient, { getServerUrl } from "@/utils/fetcher";
import { refreshedAccessToken } from "@/api/users";

jest.mock("../../api/users", () => ({
  refreshedAccessToken: jest.fn(),
}));

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
    it("getServerUrl return correct value in CI", () => {
      process.env.NEXT_PUBLIC_APP_ENV = "CI"
      expect(getServerUrl()).toBe("http://server:8000");
    });
    it("getServerUrl return correct value in testing enviroments", () => {
      process.env.NEXT_PUBLIC_APP_ENV = "ENV"
      expect(getServerUrl()).toBe("");
    });

    it('should refresh token and save access token to localstorage', async () => {
      refreshedAccessToken.mockReturnValue({
        status: 200,
        data: {
          access: 'newAccessToken',
        },
      });
  
      const err  = {
        status: 401,
        data: {
          detail: 'Given token not valid for any token type',
        },
      }
  
      // access token expired
      const response = await apiClient.interceptors.response.handlers[0]
      response.rejected({response:err,config:{headers:{}}})
  
      // the request should be made to refresh and save new access token
      await apiClient.interceptors.request.handlers[0]
      expect(mockLocalStorage.getItem('access')).toBe('newAccessToken');
    });
});
