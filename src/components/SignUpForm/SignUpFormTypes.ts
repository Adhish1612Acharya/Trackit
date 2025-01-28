import { ValueObj } from "@/store/SharedTypes/sharedTypes";

export interface signUpFormProps {
  onSubmit: (value: ValueObj) => void;
  signUpLoad: boolean;
}
