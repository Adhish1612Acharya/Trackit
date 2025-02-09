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
import filterSearchScheme from "@/validations/forms/FilterSearchForm";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { filterFormProps } from "./FilterFormTypes";
import applyFilter from "@/store/features/DailyExpense/Thunks/applyFilter/applyFilter";
import useLocalStorage from "@/hooks/useLocalStorage/useLocalStorage";
import {
  setFilteredInitialState,
  setOpenFilterDrawer,
} from "@/store/features/DailyExpense/DailyExpenseSlice";

const FilterForm: FC<filterFormProps> = ({
  dispatch,
  projectOptions,
  filterInitialValue,
}) => {
  const { setItem } = useLocalStorage();

  const form = useForm<z.infer<typeof filterSearchScheme>>({
    resolver: zodResolver(filterSearchScheme),
    defaultValues: {
      paidToId: filterInitialValue[0] || "-1",
      paymentModeId: filterInitialValue[1] || "-1",
      projectId: filterInitialValue[2] || "-1",
    },
  });

  const resetFilter = () => {
    setItem("dailyExpensePageFilter", ["-1", "-1", "-1"]);
    dispatch(setFilteredInitialState(["-1", "-1", "-1"]));
    dispatch(setOpenFilterDrawer(false));
    dispatch(
      applyFilter({ paidToId: "-1", paymentModeId: "-1", projectId: "-1" })
    );
  };

  const onSubmit = (filterData: z.infer<typeof filterSearchScheme>) => {
    setItem("dailyExpensePageFilter", [
      filterData.paidToId,
      filterData.paymentModeId,
      filterData.projectId,
    ]);
    const filterArray = [
      filterData.paidToId,
      filterData.paymentModeId,
      filterData.projectId,
    ];
    dispatch(setFilteredInitialState(filterArray));

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

export default FilterForm;
