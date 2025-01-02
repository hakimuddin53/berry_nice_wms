import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CacheObjectStateMessage,
  CacheObjectStatus,
} from "interfaces/enums/CacheObjectStateEnums";
import { StatusObject } from "interfaces/general/statusObject";
import { getByParameters as getUsersByParameters } from "../../services/UserService";
import { guid } from "../../types/guid";

export interface UserCacheObject extends StatusObject {
  id: guid;
  userName: string;
}

const initialState: {
  data: { [key: guid]: UserCacheObject };
} = { data: {} };

let timer: any = null;

const performFetch = createAsyncThunk(
  "userCache/performFetch",
  async (_: any, thunk: any) => {
    const userCacheObjects: UserCacheObject[] = Object.values(
      thunk.getState().userCache.data
    );
    let ids = userCacheObjects
      .filter((x) => x.status === CacheObjectStatus.PENDING)
      .map((x) => x.id);
    if (ids.length > 0) {
      thunk.dispatch(setUsersFetchingState(ids));
      await getUsersByParameters(ids, 1, ids.length)
        .then(async (res) => {
          let result = res.data;
          if (result.length <= 0) {
            thunk.dispatch(setUsersNotFoundState(ids));
          }
          thunk.dispatch(addUsers(result));
        })
        .catch(async (res) => {
          if (res.status === 401) {
            thunk.dispatch(setUsersUnauthorizedState(ids));
          } else {
            thunk.dispatch(setUsersErrorState(ids));
          }
        });
    }
  }
);

export const queueIds = createAsyncThunk(
  "userCache/queueIds",
  async (ids: guid[], thunk: any) => {
    const userCacheState = thunk.getState().userCache;
    ids = ids.filter((x) => !userCacheState.data[x]);
    if (ids.length > 0) {
      ids.forEach((id) => thunk.dispatch(setUserPendingState(id)));
      timer && clearTimeout(timer);
      timer = setTimeout(async () => {
        thunk.dispatch(performFetch({}));
      }, 500);
    }
  }
);

// A mock function to mimic making an async request for data
export function fetchUsers(ids: guid[]) {
  return new Promise<{ data: any }>((resolve) => {
    const users: any = [];
    ids.forEach(
      (x) =>
        (users[x] = {
          id: x,
          userName: "Random User " + Math.floor(Math.random() * 100),
        })
    );
    const usersArray = ids.map((x) => ({
      id: x,
      userName: "Random User " + Math.floor(Math.random() * 100),
    }));
    setTimeout(() => resolve({ data: usersArray }), 500);
  });
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getUsersAsync = createAsyncThunk(
  "userCache/getUsers",
  async (ids: guid[], thunk: any) => {
    const userCacheState = thunk.getState().userCache;
    ids = ids.filter((x) => !userCacheState[x]);
    if (ids.length > 0) {
      ids.forEach((id) => thunk.dispatch(setUserPendingState(id)));
      const response = await fetchUsers(ids);
      return response.data;
    }
  }
);

export const userCacheSlice = createSlice({
  name: "userCache",
  initialState,
  reducers: {
    addUsers: (
      state,
      action: PayloadAction<{ id: guid; forename: string; surname: string }[]>
    ) => {
      action.payload.forEach((user) => {
        state.data[user.id] = {
          id: user.id,
          userName: user.forename + " " + user.surname,
          status: CacheObjectStatus.SUCCESS,
        };
      });
    },
    setUserPendingState: (state, action: PayloadAction<guid>) => {
      state.data[action.payload] = {
        id: action.payload,
        userName: CacheObjectStateMessage.LOADING,
        status: CacheObjectStatus.PENDING,
      };
    },
    setUsersFetchingState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          userName: CacheObjectStateMessage.LOADING,
          status: CacheObjectStatus.FETCHING,
        };
      });
    },
    setUsersNotFoundState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          userName: CacheObjectStateMessage.NOTFOUND,
          status: CacheObjectStatus.NOTFOUND,
        };
      });
    },
    setUsersUnauthorizedState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          userName: CacheObjectStateMessage.UNKNOWN,
          status: CacheObjectStatus.ERROR,
        };
      });
    },
    setUsersErrorState: (state, action: PayloadAction<guid[]>) => {
      action.payload.forEach((id) => {
        state.data[id] = {
          id,
          userName: CacheObjectStateMessage.ERROR,
          status: CacheObjectStatus.ERROR,
        };
      });
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getUsersAsync.pending, (state, action) => {
        //state.status = "loading";
      })
      .addCase(getUsersAsync.fulfilled, (state, action) => {
        action.payload.forEach((user: UserCacheObject) => {
          state.data[user.id] = user;
        });
      });
  },
});

export const {
  addUsers,
  setUserPendingState,
  setUsersFetchingState,
  setUsersNotFoundState,
  setUsersUnauthorizedState,
  setUsersErrorState,
} = userCacheSlice.actions;

export default userCacheSlice.reducer;
