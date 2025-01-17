import { Button } from "@/components/ui/button";
import { Button as FileUploadBtn } from "@mui/material";
import { PDFDocument } from "pdf-lib";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FC, useState } from "react";
import addExpenseFormSchema from "@/validations/forms/AddExpenseForm";
import SelectInput from "./SelectInput";
import CalenderBtn from "./CalenderBtn";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  addDailyExpense,
  addDailyExpenseResponse,
  expenseType,
  formValueType,
  getUserDailyExpense,
  projectOptionsType,
  setAddExpenseLoad,
  setMiscellaneousInput,
} from "@/store/features/DailyExpense";
import constructionRoles from "@/filterData/contructionRolesData";
import paymentTypes from "@/filterData/paymentFilters";
import { Box, styled } from "@mui/material";
import {
  editedFormValueType,
  editExpenseDetails,
  setEditDrawerOpen,
  setEditExpenseMiscellaneousInput,
  setEditFuncLoad,
  setExpenseBillImage,
} from "@/store/features/EditDeleteExpense";
import {
  addProjectExpense,
  getUserProjectExpense,
} from "@/store/features/ProjectDetails";
import { Loader2} from "lucide-react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface addExpenseFormProps {
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectOptions: projectOptionsType[];
  editForm?: boolean;
  expense?: expenseType;
  editExpenseCurrentProject?: { id: string; name: string };
  loading: boolean;
  miscellaneousInput: boolean;
  isDailyExpense: boolean;
  isProjectPage: boolean;
}

const AddExpenseForm: FC<addExpenseFormProps> = ({
  dispatch,
  projectOptions,
  editForm,
  expense,
  editExpenseCurrentProject,
  loading,
  miscellaneousInput,
  isDailyExpense,
  isProjectPage,
}) => {
  const [pdfBlob, setPdfBlob] = useState<Blob | undefined>(undefined);

  const form = useForm<z.infer<typeof addExpenseFormSchema>>({
    resolver: zodResolver(addExpenseFormSchema),
    defaultValues: {
      date: editForm ? convertDateFormat(String(expense?.date)) : new Date(),
      amount: editForm ? String(expense?.amount) : "",
      reason: editForm ? expense?.reason : "",
      file: undefined,
      paidTo: editForm ? expense?.paidToId : undefined,
      paymentMode: editForm ? expense?.paymentModeId : undefined,
      project: editForm
        ? editExpenseCurrentProject?.id
        : projectOptions.length == 1
        ? projectOptions[0].id
        : undefined,
      miscellaneousPaidToName: editForm
        ? expense?.miscellaneuosPaidToName !== ""
          ? expense?.miscellaneuosPaidToName
          : "null"
        : "",
      miscellaneousPaidToRole: editForm
        ? expense?.miscellaneousPaidToRole !== ""
          ? expense?.miscellaneousPaidToRole
          : "null"
        : "",
    },
  });

  function convertDateFormat(dateStr: string): Date {
    const [day, month, year] = dateStr.split("-");

    const date = new Date(`${year}-${month}-${day}`); // Format for Date object

    return date;
  }

  const uploadToCloudinary = async (): Promise<any> => {
    if (pdfBlob !== undefined && form.getValues("file") !== undefined) {
      if (editForm) {
        dispatch(setEditFuncLoad(true));
      } else {
        dispatch(setAddExpenseLoad(true));
      }
      const formData = new FormData();
      formData.append(
        "file",
        pdfBlob,
        form.getValues("file")?.name.replace(/\.[^/.]+$/, ".pdf")
      );
      formData.append(
        "upload_preset",
        `${import.meta.env.VITE_CLOUDINARY_PRESET}`
      );

      const options = {
        method: "POST",
        body: formData,
      };

      const uploadUrl = `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_NAME
      }/raw/upload`;

      try {
        const res = await fetch(uploadUrl, options);
        const data = await res.json();
        return data.secure_url; // Make sure the URL is returned
      } catch (err: any) {
        console.error("Upload Failed:", err);
        throw new Error("Cloudinary Error " + err.message);
      }
    } else {
      return "";
    }
  };

  const convertToPDF = () => {
    const file = form.getValues("file");

    if (!file) return;

    if (file.type === "application/pdf") return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const correctedImage = e.target?.result as string;

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]); // Define page size

      // Embed the image into the PDF
      const imageBytes = await fetch(correctedImage).then((res) =>
        res.arrayBuffer()
      );
      let embeddedImage;
      if (file.type === "image/png") {
        embeddedImage = await pdfDoc.embedPng(imageBytes);
      } else {
        embeddedImage = await pdfDoc.embedJpg(imageBytes);
      }

      if (embeddedImage) {
        const { width, height } = embeddedImage;

        const pageWidth = 600; // PDF page width
        const pageHeight = 800; // PDF page height

        const marginLeft = 50; // Gap from the left
        const marginTop = 50; // Gap from the top

        // Calculate the available space for the image within the page
        const availableWidth = pageWidth - marginLeft * 2;
        const availableHeight = pageHeight - marginTop * 2;

        // Calculate the scale factor to fit the image within the available space
        const scale = Math.min(
          availableWidth / width,
          availableHeight / height
        );

        // Scale the image dimensions
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        // Calculate the position to center the image with margins
        const x = marginLeft + (availableWidth - scaledWidth) / 2; // Center horizontally with margin
        const y = marginTop + (availableHeight - scaledHeight) / 2; // Center vertically with margin

        // Draw the scaled and centered image on the page
        page.drawImage(embeddedImage, {
          x: x,
          y: y,
          width: scaledWidth,
          height: scaledHeight,
        });

        // Save the PDF
        const pdfBytes = await pdfDoc.save();

        // Convert pdfBytes to a Blob
        const createdPdfBlob = new Blob([pdfBytes], {
          type: "application/pdf",
        });

        setPdfBlob(createdPdfBlob);
      }
    };
  };

  const openWindow = () => {
    if (pdfBlob) {
      // Open the PDF in a new tab
      window.open(URL.createObjectURL(pdfBlob), "_blank");
    } else if (editForm) {
      if (expense?.billImage && expense?.billImage !== "") {
        window.open(expense?.billImage, "_blank");
      }
    }
  };

  const deleteUploadedFile = () => {
    setPdfBlob(undefined);
    form.setValue("file", undefined);
    if (editForm) {
      dispatch(setExpenseBillImage(""));
    }
  };

  const onSubmit = async (formData: z.infer<typeof addExpenseFormSchema>) => {
    if (editForm) {
      const editedFormData: editedFormValueType = {
        date: formData.date,
        amount: Number(formData.amount),
        reason: formData.reason.trim(),
        projectId: formData.project,
        paidToId: formData.paidTo,
        billImage:
          formData.file !== undefined && pdfBlob !== undefined
            ? await uploadToCloudinary()
            : expense?.billImage
            ? expense?.billImage
            : ("" as string),
        paymentModeId: formData.paymentMode,
        miscellaneousPaidToRole: formData.miscellaneousPaidToRole
          ? formData.miscellaneousPaidToRole.trim()
          : "",
        miscellaneuosPaidToId: editForm
          ? expense
            ? expense.miscellaneuosPaidToId
            : ""
          : "",
        miscellaneuosPaidToName: formData.miscellaneousPaidToName
          ? formData.miscellaneousPaidToName.trim()
          : "",
      };

      await dispatch(editExpenseDetails({ editFormValue: editedFormData }));

      if (isDailyExpense) {
        await dispatch(getUserDailyExpense());
      } else if (isProjectPage) {
        await dispatch(getUserProjectExpense(expense ? expense.projectId : ""));
      }

      dispatch(
        setEditDrawerOpen({ id: "", open: false, dailyExpenseOrNot: false })
      );
      dispatch(setEditFuncLoad(false));
      form.reset();
      form.setValue("miscellaneousPaidToName", "");
      form.setValue("miscellaneousPaidToRole", "");
      form.setValue("paidTo", ""); // or set to undefined
      form.setValue("paymentMode", ""); // or set to undefined
      form.setValue("project", "");
      setPdfBlob(undefined);
      dispatch(setEditExpenseMiscellaneousInput(false));
    } else {

      const newExpense: formValueType = {
        date: formData.date.toISOString(),
        amount: formData.amount,
        reason: formData.reason.trim(),
        paidTo: formData.paidTo,
        paymentMode: formData.paymentMode,
        project: formData.project,
        miscellaneousPaidToName: formData.miscellaneousPaidToName.trim(),
        miscellaneousPaidToRole: formData.miscellaneousPaidToRole.trim(),
        billImage:
          formData.file === undefined ? "" : await uploadToCloudinary(),
      };

      const response = await dispatch(addDailyExpense(newExpense));

      if (isProjectPage) {
        const addedExpense: any = (response.payload as addDailyExpenseResponse)
          .newAddedExpense;
        dispatch(addProjectExpense({ expense: addedExpense as expenseType }));
      }

      form.reset();
      form.setValue("miscellaneousPaidToName", "");
      form.setValue("miscellaneousPaidToRole", "");
      form.setValue("paidTo", ""); // or set to undefined
      form.setValue("paymentMode", ""); // or set to undefined
      if (projectOptions.length !== 1) {
        form.setValue("project", "");
      }

      setPdfBlob(undefined);
      dispatch(setMiscellaneousInput(false));
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-2">
          <div
            style={{
              display: "flex",
              gap: "1rem",
              // flexWrap: "wrap",
              flexDirection: "row",
              alignItems: "center",
            }}
            className="my-3 p-1"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem
                  style={{
                    flex: 1,
                    marginLeft: "1rem",
                    maxWidth: "100%",
                  }}
                  className="my-2 mx-2"
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

            <div className="w-1/2">
              {pdfBlob !== undefined ||
              (editForm && expense?.billImage && expense?.billImage !== "") ? (
                <>
                  <FormLabel htmlFor="fileInput">Uploaded Bill</FormLabel>
                  <div className="w-full flex items-center">
                    <FileUploadBtn
                      id="fileInput"
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<PictureAsPdfIcon />}
                      className="h-9 w-full"
                      onClick={() => openWindow()}
                    >
                      View
                    </FileUploadBtn>
                    <DeleteIcon
                      className="ml-2 cursor-pointer w-1/2 text-red-500"
                      onClick={() => {
                        deleteUploadedFile();
                      }}
                    />
                  </div>
                </>
              ) : (
                <Controller
                  name="file"
                  control={form.control}
                  defaultValue={undefined}
                  render={({ field }) => (
                    <>
                      <FormLabel htmlFor="fileInput">Upload Bill</FormLabel>
                      <br />
                      <FileUploadBtn
                        id="fileInput"
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        className="h-9 w-full"
                      >
                        Upload
                        <VisuallyHiddenInput
                          accept="image/png, image/jpeg"
                          type="file"
                          onChange={(event) => {
                            const files = event.target.files;
                            const file = files && files[0] ? files[0] : "";
                            field.onChange(file);
                            if (file) {
                              convertToPDF();
                            }
                          }}
                        />
                      </FileUploadBtn>
                    </>
                  )}
                />
              )}
            </div>
          </div>

          <div className="my-3  p-1 flex items-center justify-between space-x-4">
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="mx-2 my-2" style={{ maxWidth: "100%" }}>
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
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem
                  style={{ flex: 1, marginRight: "1rem", maxWidth: "100%" }}
                  className="my-2 mx-2"
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

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              // flexWrap: "wrap",
              flexDirection: "row",
              alignItems: "space-around",
            }}
            className="my-3  p-1"
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

          {miscellaneousInput && (
            <Box
              style={{
                display: "flex",
                gap: "0.5rem",
                width: "100%",
                // flexWrap: "wrap",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {" "}
              <FormField
                control={form.control}
                name="miscellaneousPaidToName"
                render={({ field }) => (
                  <FormItem style={{ flex: 1, width: "50%" }}>
                    <FormLabel>Miscellaneous Name</FormLabel>
                    <FormControl>
                      <Input
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;;
                          input.value = input.value
                            .toLowerCase()
                            .replace(/\s+/g, "");
                          field.onChange(input.value); // Update form state
                        }}
                        placeholder="Enter the name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="miscellaneousPaidToRole"
                render={({ field }) => (
                  <FormItem style={{ width: "50%" }}>
                    <FormLabel>Miscellaneous Role</FormLabel>
                    <FormControl>
                      <Input 
                       onInput={(e) => {
                        const input = e.target as HTMLInputElement;;
                        input.value = input.value
                          .toLowerCase()
                          .replace(/\s+/g, "");
                        field.onChange(input.value); // Update form state
                      }}
                      placeholder="Enter the role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Box>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              // flexWrap: "wrap",
              flexDirection: "row",
              alignItems: "end",
            }}
            className="my-3 p-1"
          >
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem
                  style={{
                    flex: 1,
                    //  marginLeft: "1rem"
                  }}
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* {!editForm && isDailyExpense && (
              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => {
                  dispatch(setOpenAddExpenseDrawer(false));
                  dispatch(setOpenAddProjectDrawer(true));
                }}
                style={{
                  width: "max-content",
                }}
              >
                <Plus /> Add Project
              </Button>
            )} */}
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              // flexWrap: "wrap",
              // flexDirection: `${editForm ? "column" : "row"}`,
              alignItems: "end",
            }}
            className="my-3  p-1"
          >
            {loading ? (
              <Button disabled className="w-full mx-1">
                <Loader2 className="animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button color="primary" type="submit" className={"w-full mx-1"}>
                {editForm ? "Save" : "Add Expense"}
              </Button>
            )}

            {/* {!editForm && (
              <Button
                color="primary"
                type="button"
                onClick={() => dispatch(setOpenAddExpenseDrawer(false))}
                style={{ marginTop: 8 }}
                className="w-1/2 mx-1"
              >
                Close
              </Button>
            )} */}
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddExpenseForm;
