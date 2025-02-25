import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const signin = createAsyncThunk(
  "auth/signin",
  async ({ formValues, navigate, toast, setUserEmailId }) => {
    try {
      const response = await api.signIn(formValues);
      if(response){
        navigate(`/home`);
        toast.success("Successfully logged in");
        return response.data;
      }
    } catch (err) {
      if(err?.response?.status === 404){
        setUserEmailId(formValues.email);
        toast.error("Verification process is pending, Please check registered email for otp");
      } else if (err.response.status !== 200 && err.response.status !== 201) {
        toast.error(err.response.data.message);
        navigate(`/`);
      }else{
        return err.response.data.message;
      }
    }
  }
);

export const signup = createAsyncThunk(
  "auth/sign-up",
  async ({ formValues, toast, setUserEmailId }) => {
    try {
      const response = await api.signUp(formValues);
      if (!response) {
        toast.error("Failed to register");
      } else {
        setUserEmailId(response?.data?.user?.email)
      }
    } catch (err) {
      if (err.response.status !== 200 && err.response.status !== 201) {
        toast.error(err.response.data.message);
      }
    }
  }
);

export const verifyUser = createAsyncThunk(
  "auth/verify-user",
  async ({ data, navigate, toast, setUserEmailIdValue }) => {
    try {
      const response = await api.verifyUserOtp(data);
      if (!response) {
        toast.error("Failed to Authenticate");
      } else if(response?.status === 404) {
        toast.success("Invalid OTP");
      }else {
        toast.success("User verified successfully");
        navigate('/signin-page');
      }
    } catch (err) {
      if (err.response.status !== 200 && err.response.status !== 201) {
        toast.error(err.response.data.message);
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: "",
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state, action) => {
      localStorage.clear();
      state.user = null;
    },
  },
  extraReducers: {
    [signin.pending]: (state, action) => {
      state.loading = true;
    },
    [signin.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      if (state.user?.message === "Successfully login") {
        localStorage.setItem("user", JSON.stringify({ ...action.payload }));
      }
    },
    [signin.rejected]: (state, action) => {
      state.loading = false;
      state.error = action?.payload?.message;
    },
  },
});

export const { setUser, setLogout } = authSlice.actions;

export default authSlice.reducer;
