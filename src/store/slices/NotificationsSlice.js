import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

export const selectNotifications = (state) => state.notifications.notifications;

export const selectUnreadNotificationsCount = (state) => {
    return state.notifications?.notifications?.filter(
      (notification) => !notification.is_read
    ).length || 0;
  };

export default notificationsSlice;
