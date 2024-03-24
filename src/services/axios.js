import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import store from "../store/index.js";
import authSlice from "../store/slices/auth.js";

const axiosService = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosService.interceptors.request.use(async (config) => {
  const { token } = store.getState().auth;

  if (token !== null) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

axiosService.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (err) => {
    return Promise.reject(err);
  }
);

const refreshAuthLogic = async (failedRequest) => {
  const { refreshToken } = store.getState().auth;

  if (refreshToken !== null) {
    return axios
      .post(
        "/auth/refresh/",
        {
          refresh: refreshToken,
        },
        {
          baseURL: import.meta.env.VITE_APP_API_URL,
        }
      )
      .then((resp) => {
        const { access, refresh } = resp.data;
        failedRequest.response.config.headers.Authorization =
          "Bearer " + access;

        store.dispatch(
          authSlice.actions.setAuthTokens({
            token: access,
            refreshToken: refresh,
          })
        );
      })
      .catch((err) => {
        store.dispatch(authSlice.actions.logout());
      });
  } else {
    store.dispatch(authSlice.actions.logout());
  }
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export default axiosService;
