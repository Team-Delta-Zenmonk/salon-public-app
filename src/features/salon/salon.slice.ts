import { createSlice } from "@reduxjs/toolkit";
import { listSalonsAction } from "./list-salons/list-salons.action";
import type { Salon } from "./salon.type";

export type SalonState = {
  data: Salon[];
  total: number;
  page: number;
  limit: number;
};

const initialState: SalonState = {
  data: [],
  total: 0,
  page: 1,
  limit: 10,
};

export const salonSlice = createSlice({
  name: "salon",
  initialState,
  reducers: {
    resetSalon(state) {
      state.data = [];
      state.total = 0;
      state.page = 1;
      state.limit = 10;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listSalonsAction.fulfilled, (state, { payload }) => {
      const { data, total, page, limit } = payload;
      const resolvedPage = Number(page ?? 1);
      if (resolvedPage === 1) state.data = data;
      else state.data = [...state.data, ...data];
      state.total = Number(total ?? 0);
      state.page = resolvedPage;
      state.limit = Number(limit ?? state.limit);
    });
  },
});

export const { resetSalon } = salonSlice.actions;
export default salonSlice.reducer;
