import { ProjectOptionsType } from "@/store/SharedTypes/sharedTypes";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

export interface  optionObj {
    id: number;
    name: string;
  };
  
 export interface  selectInputProps  {
    options: optionObj[] | ProjectOptionsType[];
    title: string;
    project: boolean;
    field: ControllerRenderProps<any, string>;
    form: UseFormReturn<any>;
    setMiscelleneousInput?: (value: boolean) => void;
    filterSelect?: boolean;
    disabled?:boolean;
  };