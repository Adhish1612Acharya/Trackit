import { auth, db, signInWithGooglePopPup } from "@/firebaseconfig";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { RootState } from "@/store/store";
import { Action } from "@radix-ui/react-alert-dialog";

interface initialStateType {
  loginLoad: boolean;
  loggedIn: boolean;
  roleIsOwner: boolean | undefined;
  googleLoginLoad: boolean;
}

interface payLoad {
  value: valueObj;
}

interface payLoad2 {
  value: signUpValueObj;
}

export interface valueObj {
  email: string;
  password: string;
}

export interface signUpValueObj {
  username: string;
  email: string;
  contactNo: number;
  password: string;
}

const initialState: initialStateType = {
  loginLoad: false,
  loggedIn: false,
  roleIsOwner: undefined,
  googleLoginLoad: false,
};

export const signUp = createAsyncThunk(
  "/signUp",
  async ({ value }: payLoad2, thunkAPI) => {
    await createUserWithEmailAndPassword(
      auth,
      value.email,
      value.password
    ).then(async (userCredential) => {
      const user = userCredential.user;
      const state = thunkAPI.getState() as RootState;
      const docRef = doc(db, "users", user.uid);

      await setDoc(docRef, {
        username: value.username,
        email: user.email,
        contactNo: value.contactNo,
        projects: [],
        filters: {
          paidTo: [],
          project: [], //{id:"cccdscsc",name:"Road"}
        },
      });
    });

    return {
      registered: true,
    };
  }
);

export const login = createAsyncThunk(
  "/login",
  async ({ value }: payLoad, thunkAPI) => {
    const resp = await signInWithEmailAndPassword(
      auth,
      value.email,
      value.password
    );
    const user = auth.currentUser;
    const state = thunkAPI.getState() as RootState;
    const docRef = doc(db, "users", `${user?.uid}`);
    const docSnap = await getDoc(docRef);
    return {
      uid: resp.user.uid,
      email: resp.user.email,
    };
  }
);

export const googleLogin = createAsyncThunk(
  "/auth/google",
  async (_value, thunkAPI) => {
    try {
      await signInWithGooglePopPup().then(async (data) => {
        const docRef = doc(db, "users", `${data.user.uid}`);

        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          const user = data.user;
          await setDoc(docRef, {
            username: user.displayName,
            email: user.email,
            contactNo: "",
            role: "users",
            projects: [],
            filters: [],
          });
        }
        return {
          uid: data.user.uid,
        };
      });
    } catch (err) {
      console.log("Error : ", err);
    }
    const state = thunkAPI.getState() as RootState;
  }
);

export const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setIsOwner: (state, action: PayloadAction<boolean>) => {
      state.roleIsOwner = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login

    builder.addCase(login.pending, (state, _action) => {
      state.loginLoad = true;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.loginLoad = false;
      state.loggedIn = true;
      toast.success("Success Login");
    });

    builder.addCase(login.rejected, (state, _action) => {
      state.loginLoad = false;
      toast.error("Either username or password is not correct ");
    });

    //SignUp

    builder.addCase(signUp.pending, (state, _action) => {
      state.loginLoad = true;
    });

    builder.addCase(signUp.fulfilled, (state, _action) => {
      state.loginLoad = false;
      state.loggedIn = true;
      toast.success("Logged In successfully");
    });

    builder.addCase(signUp.rejected, (state, _action) => {
      state.loginLoad = false;
      state.loggedIn = false;
      toast.error("Some error occurred please try again");
    });

    builder.addCase(googleLogin.pending, (state, _action) => {
      state.googleLoginLoad = true;
    });

    builder.addCase(googleLogin.fulfilled, (state, _action) => {
      state.googleLoginLoad = false;
      toast.success("Success Login");
      state.loggedIn = true;
    });

    builder.addCase(googleLogin.rejected, (state, action) => {
      state.googleLoginLoad = false;
      console.log("error : ", action.payload);
      toast.error("Either username or email is not correct");
    });
  },
});

export default LoginSlice.reducer;
export const { setIsOwner } = LoginSlice.actions;