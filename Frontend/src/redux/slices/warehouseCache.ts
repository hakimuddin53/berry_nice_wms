import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CacheObjectStateMessage,
  CacheObjectStatus,
} from "interfaces/enums/CacheObjectStateEnums";
import { StatusObject } from "interfaces/general/statusObject";
import { getByParameters } from "../../services/WarehouseService";
import { guid } from "../../types/guid";

export interface WarehouseCacheObject extends StatusObject {
  id: guid;
  name: string;
}

const initialState: {
  data: { [key: guid]: WarehouseCacheObject };
} = { data: {} };

let timer: any = null;

const performFetch = createAsyncThunk(
  "warehouseCache/performFetch",
  async (_: any, thunk: any) => {
    const warehouseCacheObjects: WarehouseCacheObject[] = Object.values(
      thunk.getState().warehouseCache.data
    );
    let ids = warehouseCacheObjects
      .filter((x) => x.status === CacheObjectStatus.PENDING)
      .map((x) => x.id);
    if (ids.length > 0) {
      thunk.dispatch(setWarehousesFetchingState(ids));
      await getByParameters(ids, 1, ids.length)
        .then(async (res) => {
          let result = res.data;
          if (result.length <= 0) {
            thunk.dispatch(setWarehousesNotFoundState(ids));
          }
          thunk.dispatch(addWarehouses(result));
        })
        .catch(async (res) => {
          if (res.status === 401) {
            thunk.dispatch(setWarehousesUnauthorizedState(ids));
          } else {
            thunk.dispatch(setWarehousesErrorState(ids));
          }
        });
    }
  }
);

export const queueIds = createAsyncThunk(
  "warehouseCache/queueIds",
  async (ids: guid[], thunk: any) => {
    const warehouseCacheState = thunk.getState().warehouseCache;
    ids = ids.filter((x) => !warehouseCacheState.data[x]);
    if (ids.length > 0) {
      ids.forEach((id) => thunk.dispatch(setWarehousePendingState(id)));
      timer && clearTimeout(timer);
      timer = setTimeout(async () => {
        thunk.dispatch(performFetch({}));
      }, 500);
    }
  }
);

export const warehouseCacheSlice = createSlice({
  name: "warehouseCache",
  initialState,
  reducers: {
    addWarehouses: (
      state,
      action: PayloadAction<{ id: guid; name: string }[]>
    ) => {
      action.payload.forEach((warehouse) => {
        state.data[warehouse.id] = {
          id: warehouse.id,
          name: warehouse.name,
          status: CacheObjectStatus.SUCCESS,
        };
      });
    },
    setWarehousePendingState: (state, action: PayloadAction<guid>) => {
      state.data[action.payload] = {
        id: action.payload,
        name: CacheObjectStateMessage.LOADING,
        status: CacheObjectStatus.PENDING,
      };
    },
    setWarehousesFetchingState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.LOADING,
          status: CacheObjectStatus.FETCHING,
        };
      });
    },
    setWarehousesNotFoundState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.NOTFOUND,
          status: CacheObjectStatus.NOTFOUND,
        };
      });
    },
    setWarehousesUnauthorizedState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.UNKNOWN,
          status: CacheObjectStatus.ERROR,
        };
      });
    },
    setWarehousesErrorState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.ERROR,
          status: CacheObjectStatus.ERROR,
        };
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(performFetch.pending, (state, action) => {});
    builder.addCase(performFetch.fulfilled, (state, action) => {});
  },
});

export const {
  addWarehouses,
  setWarehousePendingState,
  setWarehousesFetchingState,
  setWarehousesNotFoundState,
  setWarehousesUnauthorizedState,
  setWarehousesErrorState,
} = warehouseCacheSlice.actions;

export default warehouseCacheSlice.reducer;
