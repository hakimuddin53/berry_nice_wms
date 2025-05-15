import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CacheObjectStateMessage,
  CacheObjectStatus,
} from "interfaces/enums/CacheObjectStateEnums";
import { StatusObject } from "interfaces/general/statusObject";
import { getByParameters } from "../../services/LocationService";
import { guid } from "../../types/guid";

export interface LocationCacheObject extends StatusObject {
  id: guid;
  name: string;
}

const initialState: {
  data: { [key: guid]: LocationCacheObject };
} = { data: {} };

let timer: any = null;

const performFetch = createAsyncThunk(
  "locationCache/performFetch",
  async (_: any, thunk: any) => {
    const locationCacheObjects: LocationCacheObject[] = Object.values(
      thunk.getState().locationCache.data
    );
    let ids = locationCacheObjects
      .filter((x) => x.status === CacheObjectStatus.PENDING)
      .map((x) => x.id);
    if (ids.length > 0) {
      thunk.dispatch(setLocationsFetchingState(ids));
      console.log("Fetching locations for ids: ", ids);
      await getByParameters(ids, 1, ids.length)
        .then(async (res) => {
          let result = res.data;
          if (result.length <= 0) {
            thunk.dispatch(setLocationsNotFoundState(ids));
          }
          thunk.dispatch(addLocations(result));
        })
        .catch(async (res) => {
          if (res.status === 401) {
            thunk.dispatch(setLocationsUnauthorizedState(ids));
          } else {
            thunk.dispatch(setLocationsErrorState(ids));
          }
        });
    }
  }
);

export const queueIds = createAsyncThunk(
  "locationCache/queueIds",
  async (ids: guid[], thunk: any) => {
    const locationCacheState = thunk.getState().locationCache;
    ids = ids.filter((x) => !locationCacheState.data[x]);
    if (ids.length > 0) {
      ids.forEach((id) => thunk.dispatch(setLocationPendingState(id)));
      timer && clearTimeout(timer);
      timer = setTimeout(async () => {
        thunk.dispatch(performFetch({}));
      }, 500);
    }
  }
);

export const locationCacheSlice = createSlice({
  name: "locationCache",
  initialState,
  reducers: {
    addLocations: (
      state,
      action: PayloadAction<{ id: guid; name: string }[]>
    ) => {
      action.payload.forEach((location) => {
        state.data[location.id] = {
          id: location.id,
          name: location.name,
          status: CacheObjectStatus.SUCCESS,
        };
      });
    },
    setLocationPendingState: (state, action: PayloadAction<guid>) => {
      state.data[action.payload] = {
        id: action.payload,
        name: CacheObjectStateMessage.LOADING,
        status: CacheObjectStatus.PENDING,
      };
    },
    setLocationsFetchingState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.LOADING,
          status: CacheObjectStatus.FETCHING,
        };
      });
    },
    setLocationsNotFoundState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.NOTFOUND,
          status: CacheObjectStatus.NOTFOUND,
        };
      });
    },
    setLocationsUnauthorizedState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.UNKNOWN,
          status: CacheObjectStatus.ERROR,
        };
      });
    },
    setLocationsErrorState: (state, action: PayloadAction<guid[]>) => {
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
    builder.addCase(performFetch.pending, (state, action) => {
      // Handle pending state if needed
    });
    builder.addCase(performFetch.fulfilled, (state, action) => {
      // Handle fulfilled state if needed
    });
  },
});

export const {
  addLocations,
  setLocationPendingState,
  setLocationsFetchingState,
  setLocationsNotFoundState,
  setLocationsUnauthorizedState,
  setLocationsErrorState,
} = locationCacheSlice.actions;

export default locationCacheSlice.reducer;
