import { ValueObj } from "@/store/SharedTypes/sharedTypes";


export interface LoginFormProps {
  onSubmit: (value: ValueObj) => void;
  loginLoad: boolean;
}
