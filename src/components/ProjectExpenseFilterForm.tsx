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
import SelectInput from "./AddExpenseDrawer/SelectInput";
import { constructionRolesFilterSearch } from "@/filterData/contructionRolesData";
import { paymentTypesFilterSearch } from "@/filterData/paymentFilters";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@/store/store";
import { projectExpenseFilterSearchScheme } from "@/validations/forms/FilterSearchForm";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import CalenderBtn from "./AddExpenseDrawer/CalenderBtn";
import { projectDetailsApplyFilter } from "@/store/features/ProjectDetails";

interface filterFormProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectId: string;
}

const ProjectExpenseFilterForm: FC<filterFormProps> = ({
  dispatch,
  projectId,
}) => {
  const form = useForm<z.infer<typeof projectExpenseFilterSearchScheme>>({
    resolver: zodResolver(projectExpenseFilterSearchScheme),
    defaultValues: {
      paidToId: "52",
      paymentModeId: "51",
      date: undefined,
    },
  });

  const onSubmit = (
    filterData: z.infer<typeof projectExpenseFilterSearchScheme>
  ) => {
    // let formattedDate: string = "";

    // // Format the date into "DD-MM-YYYY"
    // if (filterData.date !== undefined) {
    //   formattedDate = (filterData.date as Date)
    //     .toLocaleDateString("en-GB", {
    //       day: "2-digit",
    //       month: "2-digit",
    //       year: "numeric",
    //     })
    //     .split("/")
    //     .join("-");
    // }

    const data: {
      paidToId: string;
      paymentModeId: string;
      date: any;
    } = {
      paidToId: filterData.paidToId,
      paymentModeId: filterData.paymentModeId,
      date: filterData.date,
    };

    dispatch(projectDetailsApplyFilter({ filterValue: data, projectId }));
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
          name="date"
          render={({ field }) => (
            <FormItem style={{ flex: 1, marginLeft: "20px" }}>
              <FormLabel>Project Type</FormLabel>
              <FormControl>
                <CalenderBtn field={field} />
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
            Add Expense
          </Button>
        )}
      </form>
    </Form>
  );
};

export default ProjectExpenseFilterForm;
