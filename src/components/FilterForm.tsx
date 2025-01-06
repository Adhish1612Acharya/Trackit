import { zodResolver } from "@hookform/resolvers/zod";
import  { FC } from "react";
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
import SelectInput from "./AddExpenseDrawer/SelectInput";
import {
  constructionRolesFilterSearch,
} from "@/filterData/contructionRolesData";
import {
  paymentTypesFilterSearch,
} from "@/filterData/paymentFilters";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@/store/store";
import { applyFilter, projectOptionsType } from "@/store/features/DailyExpense";
import filterSearchScheme from "@/validations/forms/FilterSearchForm";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface filterFormProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectOptions: projectOptionsType[];
}

const FilterForm: FC<filterFormProps> = ({ dispatch, projectOptions }) => {
  const form = useForm<z.infer<typeof filterSearchScheme>>({
    resolver: zodResolver(filterSearchScheme),
    defaultValues: {
      paidToId: "52",
      paymentModeId: "51",
      projectId: "-1",
    },
  });

  const onSubmit = (filterData: z.infer<typeof filterSearchScheme>) => {
    dispatch(applyFilter(filterData));
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem style={{ flex: 1, marginLeft: "20px" }}>
              <FormLabel>Project Type</FormLabel>
              <FormControl>
                <SelectInput
                  field={field}
                  options={projectOptions}
                  project={true}
                  title="Project"
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
          <Button
            color="primary"
            type="submit"
            // disabled={useAppSelector(
            //   (state) => state.addDailyExpense.addExpenseBtnLoad
            // )}
            className="w-full mx-1"
          >
            Apply
          </Button>
        )}
      </form>
    </Form>
  );
};

export default FilterForm;
