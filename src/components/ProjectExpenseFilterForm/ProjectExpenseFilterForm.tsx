import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import SelectInput from "../SelectInput/SelectInput";
import { constructionRolesFilterSearch } from "@/filterData/contructionRolesData";
import { paymentTypesFilterSearch } from "@/filterData/paymentFilters";
import { useAppSelector } from "@/store/store";
import { projectExpenseFilterSearchScheme } from "@/validations/forms/FilterSearchForm";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import CalenderBtn from "../CalenderBtn/CalenderBtn";
import { filterFormProps } from "./ProjectExpenseFilterFormTypes";
import projectDetailsApplyFilter from "@/store/features/ProjectDetails/Thunks/projectDetailsApplyFilter/projectDetailsApplyFilter";
import useLocalStorage from "@/hooks/useLocalStorage/useLocalStorage";
import { setFilteredInitialState, setProjectDetailsOpenFilterDrawer } from "@/store/features/ProjectDetails/ProjectDetailsSlice";

const ProjectExpenseFilterForm: FC<filterFormProps> = ({
  dispatch,
  projectId,
  filterInitialValue,
}) => {
  const { setItem } = useLocalStorage();
  const form = useForm<z.infer<typeof projectExpenseFilterSearchScheme>>({
    resolver: zodResolver(projectExpenseFilterSearchScheme),
    defaultValues: {
      date:
        (filterInitialValue[0] !== "" && new Date(filterInitialValue[0])) ||
        undefined,
      paidToId: filterInitialValue[1] || "-1",
      paymentModeId: filterInitialValue[2] || "-1",
    },
  });

  const resetFilter = () => {
    setItem("projectPageFilter", ["", "-1", "-1"]);
    dispatch(setFilteredInitialState(["", "-1", "-1"]));
    dispatch(setProjectDetailsOpenFilterDrawer(false));
   dispatch(projectDetailsApplyFilter({ filterValue: { date: "", paidToId: "-1", paymentModeId: "-1" }, projectId }));
  
  };

  const onSubmit = (
    filterData: z.infer<typeof projectExpenseFilterSearchScheme>
  ) => {
    setItem("projectPageFilter", [
      (filterData.date && String(filterData.date)) || "",
      filterData.paidToId,
      filterData.paymentModeId,
    ]);

    const data: {
      paidToId: string;
      paymentModeId: string;
      date: any;
    } = {
      paidToId: filterData.paidToId,
      paymentModeId: filterData.paymentModeId,
      date: filterData.date,
    };

    const filterArray = [data.date || "", data.paidToId, data.paymentModeId];
   dispatch(setFilteredInitialState(filterArray));


  
    dispatch(projectDetailsApplyFilter({ filterValue: data, projectId }));
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem style={{ flex: 1, marginLeft: "20px" }}>
              <FormLabel className="mr-2">Choose Date</FormLabel>
              <FormControl>
                <CalenderBtn field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paidToId"
          render={({ field }) => (
            <FormItem style={{ flex: 1, marginLeft: "20px" }}>
              <FormLabel>Paid To</FormLabel>
              <FormControl>
                <SelectInput
                  field={field}
                  options={constructionRolesFilterSearch}
                  project={false}
                  title="Paid To"
                  {...field}
                  filterSelect={true}
                  form={form}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentModeId"
          render={({ field }) => (
            <FormItem style={{ flex: 1, marginLeft: "20px" }}>
              <FormLabel>Payment Type</FormLabel>
              <FormControl>
                <SelectInput
                  field={field}
                  options={paymentTypesFilterSearch}
                  project={false}
                  title="Payment Type"
                  {...field}
                  filterSelect={false}
                  form={form}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {useAppSelector((state) => state.addDailyExpense.addFilterBtnLoad) ? (
          <Button className="w-full mx-1" disabled>
            <Loader2 className="animate-spin" />
            Applying filter
          </Button>
        ) : (
          <div className="flex justify-center">
            <Button
              color="primary"
              type="button"
              onClick={() => resetFilter()}
              className="w-1/2 mx-1"
            >
              Clear
            </Button>
            <Button color="primary" type="submit" className="w-1/2 mx-1">
              Apply
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default ProjectExpenseFilterForm;
