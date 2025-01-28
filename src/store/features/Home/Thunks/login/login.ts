import { auth, db } from "@/firebaseconfig";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { PayLoad } from "./loginTypes";

 const login = createAsyncThunk(
    "/login",
    async ({ value }: PayLoad, _thunkAPI) => {
      const resp = await signInWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );
      const user = auth.currentUser;
      const docRef = doc(db, "users", `${user?.uid}`);
      await getDoc(docRef);
      return {
        uid: resp.user.uid,
        email: resp.user.email,
      };
    }
  );

  export default login;