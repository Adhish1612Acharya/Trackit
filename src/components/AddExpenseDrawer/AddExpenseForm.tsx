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
  expenseType,
  getUserDailyExpense,
  projectOptionsType,
  setMiscellaneousInput,
  setOpenAddExpenseDrawer,
  setOpenAddProjectDrawer,
} from "@/store/features/DailyExpense";
import constructionRoles from "@/filterData/contructionRolesData";
import paymentTypes from "@/filterData/paymentFilters";

import { Box } from "@mui/material";
import {
  editedFormValueType,
  editExpenseDetails,
  setEditDrawerOpen,
  setEditExpenseMiscellaneousInput,
  setEditFuncLoad,
} from "@/store/features/EditDeleteExpense";
import { getUserProjectExpense } from "@/store/features/ProjectDetails";
import { Loader2, Plus } from "lucide-react";

interface addExpenseFormProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectOptions: projectOptionsType[];
  editForm?: boolean;
  expense?: expenseType;
  editExpenseCurrentProject?: { id: string; name: string };
}

const AddExpenseForm: FC<addExpenseFormProps> = ({
  dispatch,
  projectOptions,
  editForm,
  expense,
  editExpenseCurrentProject,
}) => {
  const form = useForm<z.infer<typeof addExpenseFormSchema>>({
    resolver: zodResolver(addExpenseFormSchema),
    defaultValues: {
      date: editForm ? convertDateFormat(String(expense?.date)) : new Date(),
      amount: editForm ? String(expense?.amount) : "0",
      reason: editForm ? expense?.reason : "",
      paidTo: editForm ? expense?.paidToId : undefined,
      paymentMode: editForm ? expense?.paymentModeId : undefined,
      project: editForm ? editExpenseCurrentProject?.id : undefined,
      miscellaneousPaidToName: editForm
        ? expense?.miscellaneuosPaidToName
        : "null",
      miscellaneousPaidToRole: editForm
        ? expense?.miscellaneousPaidToRole
        : "null",
    },
  });

  function convertDateFormat(dateStr: string): Date {
    const [day, month, year] = dateStr.split("-");

    const date = new Date(`${year}-${month}-${day}`); // Format for Date object

    return date;
  }

  const onSubmit = async (formData: z.infer<typeof addExpenseFormSchema>) => {
    if (editForm) { 
      const editedFormData: editedFormValueType = {
        date: formData.date,
        amount: Number(formData.amount),
        reason: formData.reason,
        projectId: formData.project,
        paidToId: formData.paidTo,
        paymentModeId: formData.paymentMode,
        miscellaneousPaidToRole: formData.miscellaneousPaidToRole
          ? formData.miscellaneousPaidToRole
          : "null",
        miscellaneuosPaidToId: editForm ? expense?expense.miscellaneuosPaidToId : "":"",
        miscellaneuosPaidToName: formData.miscellaneousPaidToName
          ? formData.miscellaneousPaidToName
          : "null",
      };

      await dispatch(editExpenseDetails({ editFormValue: editedFormData }));
      if(window.location.href==="/u/daily-expense"){
        await dispatch(getUserDailyExpense());
      }else if (window.location.pathname.startsWith("/u/projects/")) {
        await dispatch(getUserProjectExpense(expense?expense.projectId:""));
      }
     
      dispatch(
        setEditDrawerOpen({ id: "", open: false, dailyExpenseOrNot: false })
      );
      dispatch(setEditFuncLoad(false));
      form.reset();
      form.setValue("miscellaneousPaidToName", "null");
      form.setValue("miscellaneousPaidToRole", "null");
      form.setValue("paidTo", ""); // or set to undefined
      form.setValue("paymentMode", ""); // or set to undefined
      form.setValue("project", "");
      dispatch(setEditExpenseMiscellaneousInput(false));
    } else {
      await dispatch(addDailyExpense(formData));
      form.reset();
      form.setValue("miscellaneousPaidToName", "null");
      form.setValue("miscellaneousPaidToRole", "null");
      form.setValue("paidTo", ""); // or set to undefined
      form.setValue("paymentMode", ""); // or set to undefined
      form.setValue("project", "");
      dispatch(setMiscellaneousInput(false));
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={editForm?"p-2":""}>
          {/* Row for Date and Amount */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              flexDirection: `${editForm ? "column" : "row"}`,
              alignItems: `${editForm ? "space-around" : "end"}`,
            }}
            className="my-2"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem
                  style={{
                    flex: 1,
                    marginLeft: `${editForm ? "" : "1rem"}`,
                    maxWidth: "100%",
                
                  }}

                  className={editForm ? "my-2 mx-2" : ""}
                >
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
                <FormItem
                  style={{ flex: 1, marginRight: "1rem", maxWidth: "100%" }}
                  className={editForm ? "my-2 mx-2" : ""}
                >
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
              <FormItem
                className="mx-2 my-2"
                // className={editForm ? "my-2 mx-2" : ""}
                style={{ maxWidth: "100%" }}
              >
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
          {editForm
            ? useAppSelector(
                (state) => state.editDeleteExpense.miscellaneuosInput
              ) && (
                <Box
                  sx={{
                    display: { xs: "flex", sm: "flex", md: "none" },
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                  className={editForm ? "my-2 mx-2" : ""}
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
              )
            : useAppSelector(
                (state) => state.addDailyExpense.miscellaneousInput
              ) && (
                <Box
                  sx={{
                    display: { xs: "flex", sm: "flex", md: "none", my: "1rem" },
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                  // className={editForm ? "my-2 mx-2" : ""}
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
              justifyContent: "start"
            }}
            className={editForm ? "mx-2 my-2" : ""}
          >
            <FormField
              control={form.control}
              name="paidTo"
              render={({ field }) => (
                <FormItem
                  style={{
                    flex: 1,
                    //  marginLeft: "20px"
                  }}
                >
                  <FormLabel>Paid To</FormLabel>
                  <FormControl>
                    <SelectInput
                      field={field}
                      options={constructionRoles}
                      project={false}
                      title="Paid To"
                      {...field}
                      setMiscelleneousInput={(value) =>
                        editForm
                          ? dispatch(setEditExpenseMiscellaneousInput(value))
                          : dispatch(setMiscellaneousInput(value))
                      }
                      form={form}
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
                      form={form}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Miscellaneous Fields */}
          {editForm
            ? useAppSelector(
                (state) => state.editDeleteExpense.miscellaneuosInput
              ) && (
                <Box
                  sx={{
                    display: { xs: "none", sm: "none", md: "flex", my: "1rem" },
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                  className={editForm ? "my-2 mx-2" : ""}
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
              )
            : useAppSelector(
                (state) => state.addDailyExpense.miscellaneousInput
              ) && (
                <Box
                  sx={{
                    display: { xs: "none", sm: "none", md: "flex" },
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                  style={{ marginTop: "1rem" }}
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
          <div className="flex w-full items-end   h-max my-1">
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem
                  style={{ flex: 1,
                    //  marginLeft: "1rem" 
                    }}
                  className={editForm ? "my-2 mx-2" : ""}
                >
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
            {!editForm && (
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => dispatch(setOpenAddProjectDrawer(true))}
                style={{
                  marginRight: "84%",
                  marginLeft: "1rem",
                  width: "max-content",
                }}
              >
                <Plus /> Add Project
              </Button>
            )}
          </div>

          <div className="flex w-full items-end">
            {editForm ? (
              useAppSelector(
                (state) => state.editDeleteExpense.editFuncLoad
              ) ? (
                <Button
                  disabled
                  className={editForm ? "w-full mx-1" : "w-1/2 mx-1"}
                >
                  <Loader2 className="animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  color="primary"
                  type="submit"
                  className={editForm ? "w-full mx-1" : "w-1/2 mx-1"}
                >
                  {editForm ? "Save" : "Add Expense"}
                </Button>
              )
            ) : useAppSelector(
                (state) => state.addDailyExpense.addExpenseBtnLoad
              ) ? (
              <Button
                disabled
                className={editForm ? "w-full mx-1" : "w-1/2 mx-1"}
              >
                <Loader2 className="animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                color="primary"
                type="submit"
                className={editForm ? "w-full mx-1" : "w-1/2 mx-1"}
              >
                {editForm ? "Save" : "Add Expense"}
              </Button>
            )}
            {/* Submit Button */}

            {!editForm && (
              <Button
                color="primary"
                type="button"
                onClick={() => dispatch(setOpenAddExpenseDrawer(false))}
                style={{ marginTop: 8 }}
                className="w-1/2 mx-1"
              >
                Close
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddExpenseForm;
