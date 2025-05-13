import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CacheObjectStateMessage,
  CacheObjectStatus,
} from "interfaces/enums/CacheObjectStateEnums";
import { StatusObject } from "interfaces/general/statusObject";
import { getByParameters } from "../../services/ProductService";
import { guid } from "../../types/guid";

export interface ProductCacheObject extends StatusObject {
  id: guid;
  name: string;
  itemCode: string;
}

const initialState: {
  data: { [key: guid]: ProductCacheObject };
} = { data: {} };

let timer: any = null;

const performFetch = createAsyncThunk(
  "productCache/performFetch",
  async (_: any, thunk: any) => {
    const productCacheObjects: ProductCacheObject[] = Object.values(
      thunk.getState().productCache.data
    );
    let ids = productCacheObjects
      .filter((x) => x.status === CacheObjectStatus.PENDING)
      .map((x) => x.id);
    if (ids.length > 0) {
      thunk.dispatch(setProductsFetchingState(ids));
      await getByParameters(ids, 1, ids.length)
        .then(async (res) => {
          let result = res.data;
          if (result.length <= 0) {
            thunk.dispatch(setProductsNotFoundState(ids));
          }
          thunk.dispatch(addProducts(result));
        })
        .catch(async (res) => {
          if (res.status === 401) {
            thunk.dispatch(setProductsUnauthorizedState(ids));
          } else {
            thunk.dispatch(setProductsErrorState(ids));
          }
        });
    }
  }
);

export const queueIds = createAsyncThunk(
  "productCache/queueIds",
  async (ids: guid[], thunk: any) => {
    const productCacheState = thunk.getState().productCache;
    ids = ids.filter((x) => !productCacheState.data[x]);
    if (ids.length > 0) {
      ids.forEach((id) => thunk.dispatch(setProductPendingState(id)));
      timer && clearTimeout(timer);
      timer = setTimeout(async () => {
        thunk.dispatch(performFetch({}));
      }, 500);
    }
  }
);

export const productCacheSlice = createSlice({
  name: "productCache",
  initialState,
  reducers: {
    addProducts: (
      state,
      action: PayloadAction<{ id: guid; name: string; itemCode: string }[]>
    ) => {
      action.payload.forEach((product) => {
        state.data[product.id] = {
          id: product.id,
          name: product.name,
          itemCode: product.itemCode,
          status: CacheObjectStatus.SUCCESS,
        };
      });
    },
    setProductPendingState: (state, action: PayloadAction<guid>) => {
      state.data[action.payload] = {
        id: action.payload,
        name: CacheObjectStateMessage.LOADING,
        itemCode: CacheObjectStateMessage.LOADING,
        status: CacheObjectStatus.PENDING,
      };
    },
    setProductsFetchingState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.LOADING,
          itemCode: CacheObjectStateMessage.LOADING,
          status: CacheObjectStatus.FETCHING,
        };
      });
    },
    setProductsNotFoundState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.NOTFOUND,
          itemCode: CacheObjectStateMessage.NOTFOUND,
          status: CacheObjectStatus.NOTFOUND,
        };
      });
    },
    setProductsUnauthorizedState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.UNKNOWN,
          itemCode: CacheObjectStateMessage.UNKNOWN,
          status: CacheObjectStatus.ERROR,
        };
      });
    },
    setProductsErrorState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          name: CacheObjectStateMessage.ERROR,
          itemCode: CacheObjectStateMessage.ERROR,
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
  addProducts,
  setProductPendingState,
  setProductsFetchingState,
  setProductsNotFoundState,
  setProductsUnauthorizedState,
  setProductsErrorState,
} = productCacheSlice.actions;

export default productCacheSlice.reducer;
