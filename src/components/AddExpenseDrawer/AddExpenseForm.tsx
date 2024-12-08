import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FC } from "react";
import addExpenseFormSchema from "@/validations/forms/AddExpenseForm";
import SelectInput from "./SelectInput";
import CalenderBtn from "./CalenderBtn";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@/store/store";
import {
  addDailyExpense,
  projectOptionsType,
  setMiscellaneousInput,
  setOpenAddExpenseDrawer,
  setOpenAddProjectDrawer,
} from "@/store/features/DailyExpense";
import constructionRoles from "@/filterData/contructionRolesData";
import paymentTypes from "@/filterData/paymentFilters";
import { ChevronRight, Loader2 } from "lucide-react";
import { Box } from "@mui/material";

interface addExpenseFormProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectOptions: projectOptionsType[];
  // submit: boolean;
}

const AddExpenseForm: FC<addExpenseFormProps> = ({
  dispatch,
  projectOptions,
  // submit,
}) => {
  const form = useForm<z.infer<typeof addExpenseFormSchema>>({
    resolver: zodResolver(addExpenseFormSchema),
    defaultValues: {
      date: new Date(),
      amount: "0",
      reason: "",
      paidTo: undefined,
      paymentMode: undefined,
      project: undefined,
      miscellaneousPaidToName: "null",
      miscellaneousPaidToRole: "null",
    },
  });

  const onSubmit = async (formData: z.infer<typeof addExpenseFormSchema>) => {
    await dispatch(addDailyExpense(formData));
    form.reset();
    form.setValue("miscellaneousPaidToName", "null");
    form.setValue("miscellaneousPaidToRole", "null");
    form.setValue("paidTo", ""); // or set to undefined
    form.setValue("paymentMode", ""); // or set to undefined
    form.setValue("project", "");
    dispatch(setMiscellaneousInput(false));
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Row for Date and Amount */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",

              alignItems: "end",
            }}
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem style={{ flex: 1, marginLeft: "1rem" }}>
                  {" "}
                  {/* Flex to share space */}
                  <div className="flex flex-col justify-end space-y-2">
                    <FormLabel className="mr-3">Date</FormLabel>
                    <CalenderBtn field={field} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem style={{ flex: 1, marginRight: "1rem" }}>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Reason Field (Full Width) */}
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="mx-2">
                <FormLabel>Reason</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter The reason for payment"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Miscellaneous Fields */}
          {useAppSelector(
            (state) => state.addDailyExpense.miscellaneousInput
          ) && (
            <Box
              sx={{
                display: { xs: "flex", sm: "flex", md: "none" },
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <FormField
                control={form.control}
                name="miscellaneousPaidToName"
                render={({ field }) => (
                  <FormItem style={{ flex: 1, marginLeft: "1rem" }}>
                    <FormLabel>Miscellaneous Paid To Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="miscellaneousPaidToRole"
                render={({ field }) => (
                  <FormItem style={{ flex: 1, marginRight: "1rem" }}>
                    <FormLabel>Miscellaneous Paid To Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Box>
          )}

          {/* Row for Paid To and Payment Mode */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <FormField
              control={form.control}
              name="paidTo"
              render={({ field }) => (
                <FormItem style={{ flex: 1, marginLeft: "20px" }}>
                  <FormLabel>Paid To</FormLabel>
                  <FormControl>
                    <SelectInput
                      field={field}
                      options={constructionRoles}
                      project={false}
                      title="Paid To"
                      {...field}
                      setMiscelleneousInput={(value) =>
                        dispatch(setMiscellaneousInput(value))
                      }
                      form={form}
                      // submit={submit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMode"
              render={({ field }) => (
                <FormItem style={{ flex: 1 }}>
                  <FormLabel>Payment Mode</FormLabel>
                  <FormControl>
                    <SelectInput
                      field={field}
                      options={paymentTypes}
                      project={false}
                      title="Payment Mode"
                      {...field}
                      // submit={submit}
                      form={form}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Miscellaneous Fields */}
          {useAppSelector(
            (state) => state.addDailyExpense.miscellaneousInput
          ) && (
            <Box
              sx={{
                display: { xs: "none", sm: "none", md: "flex" },
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {" "}
              <FormField
                control={form.control}
                name="miscellaneousPaidToName"
                render={({ field }) => (
                  <FormItem style={{ flex: 1, marginLeft: "1rem" }}>
                    <FormLabel>Miscellaneous Paid To Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="miscellaneousPaidToRole"
                render={({ field }) => (
                  <FormItem style={{ flex: 1, marginRight: "1rem" }}>
                    <FormLabel>Miscellaneous Paid To Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Box>
          )}

          {/* Project Selector with Add Project Button */}
          <div className="flex w-full items-end   h-max">
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem style={{ flex: 1, marginLeft: "1rem" }}>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <SelectInput
                      field={field}
                      options={projectOptions}
                      project={true}
                      title="Project"
                      {...field}
                      form={form}
                      // submit={submit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => dispatch(setOpenAddProjectDrawer(true))}
              style={{
                marginRight: "84%",
                marginLeft: "1rem",
              }}
            >
              <ChevronRight />
            </Button>
          </div>

          <div className="flex w-full items-end">
            {useAppSelector(
              (state) => state.addDailyExpense.addExpenseBtnLoad
            ) ? (
              <Button disabled className="w-1/2 mx-1">
                <Loader2 className="animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button color="primary" type="submit" className="w-1/2 mx-1">
                Add Expense
              </Button>
            )}
            {/* Submit Button */}

            <Button
              color="primary"
              type="button"
              onClick={() => dispatch(setOpenAddExpenseDrawer(false))}
              style={{ marginTop: 8 }}
              className="w-1/2 mx-1"
            >
              Close
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddExpenseForm;
