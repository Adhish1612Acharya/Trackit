import { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { projectOptionsType } from "@/store/features/DailyExpense";

type optionObj = {
  id: number;
  name: string;
};

// Your original props type
type selectInputProps = {
  options: optionObj[] | projectOptionsType[];
  title: string;
  project: boolean;
  field: ControllerRenderProps<any, string>;
  form: UseFormReturn<any>;
  setMiscelleneousInput?: (value: boolean) => void;
  filterSelect?: boolean;
};

// Forward ref in the SelectInput component
const SelectInput = forwardRef<HTMLDivElement, selectInputProps>(
  (props, ref) => {
    const { options, title, field, setMiscelleneousInput, form, filterSelect } =
      props;

    return (
      <div ref={ref}>
        <Select
          name={title}
          value={form.getValues(field.name)}
          onValueChange={(value) => {
            field.onChange(value); // Update the form field value
            if (!filterSelect) {
              if (value === "51" && field.name === "paidTo") {
                form.setValue("miscellaneousPaidToName", "");
                form.setValue("miscellaneousPaidToRole", "");
              } else if (value !== "51" && field.name === "paidTo") {
                form.setValue("miscellaneousPaidToName", "null");
                form.setValue("miscellaneousPaidToRole", "null");
              }
            }

            if (setMiscelleneousInput) {
              setMiscelleneousInput(value === "51"); // Toggle input if value is 51
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={`Select ${title}`} />
          </SelectTrigger>
          <SelectContent
            style={{
             overflowY:"scroll",
              zIndex: 1301, // Higher than Material-UI's Dialog z-index (1300)
            }}
            
            side={"top"}
            
          >
            <SelectGroup >
              <SelectLabel>{title}</SelectLabel>
              {options.map((option) => {
                return (
                  <SelectItem key={option.id} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }
);

// Specify the display name for debugging purposes
SelectInput.displayName = "SelectInput";

export default SelectInput;
