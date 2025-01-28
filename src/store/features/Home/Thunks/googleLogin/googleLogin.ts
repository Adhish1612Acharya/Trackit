import { db, signInWithGooglePopPup } from "@/firebaseconfig";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const googleLogin = createAsyncThunk(
    "/auth/google",
    async (_value, _thunkAPI) => {
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
    }
  );