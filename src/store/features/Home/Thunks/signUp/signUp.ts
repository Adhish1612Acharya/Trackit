import { createAsyncThunk } from "@reduxjs/toolkit";
import { PayLoad } from "./signUpTypes";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebaseconfig";
import { doc, setDoc } from "firebase/firestore";

 const signUp = createAsyncThunk(
    "/signUp",
    async ({ value }: PayLoad, _thunkAPI) => {
      await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password
      ).then(async (userCredential) => {
        const user = userCredential.user;
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

  export default signUp;