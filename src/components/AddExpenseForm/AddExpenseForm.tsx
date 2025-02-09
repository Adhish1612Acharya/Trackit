import { Button } from "@/components/ui/button";
import { Button as FileUploadBtn } from "@mui/material";
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
import SelectInput from "../SelectInput/SelectInput";
import CalenderBtn from "../CalenderBtn/CalenderBtn";
import addDailyExpense from "@/store/features/DailyExpense/Thunks/addDailyExpense/addDailyExpense";
import constructionRoles from "@/filterData/contructionRolesData";
import paymentTypes from "@/filterData/paymentFilters";
import { Box } from "@mui/material";
import {
  setEditDrawerOpen,
  setEditExpenseMiscellaneousInput,
  setEditFuncLoad,
  setExpenseBillImage,
} from "@/store/features/EditDeleteExpense/EditDeleteExpenseSlice";
import { Loader2 } from "lucide-react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";
import { addExpenseFormProps } from "./AddExpenseFormTypes";
import { toast } from "react-toastify";
import { createPdf } from "./AddExpenseFormUtilities";
import {
  AddDailyExpenseResponse,
  FormValueType,
} from "@/store/features/DailyExpense/Thunks/addDailyExpense/addDailyExpenseTypes";

import {
  setAddExpenseLoad,
  setMiscellaneousInput,
} from "@/store/features/DailyExpense/DailyExpenseSlice";
import getUserDailyExpense from "@/store/features/DailyExpense/Thunks/getUserDailyExpense/getUserDailyExpense";
import { EditedFormValueType } from "@/store/features/EditDeleteExpense/Thunks/editExpenseDetails/editExpenseDetailsTypes";
import editExpenseDetails from "@/store/features/EditDeleteExpense/Thunks/editExpenseDetails/editExpenseDetails";
import { addProjectExpense } from "@/store/features/ProjectDetails/ProjectDetailsSlice";
import { VisuallyHiddenInput } from "./AddExpenseFormCustomStyles";
import { ExpenseType } from "@/store/SharedTypes/sharedTypes";
import getFilterExpense from "@/routes/u/ProjectExpense/utils/getFilterExpense";
import useLocalStorage from "@/hooks/useLocalStorage/useLocalStorage";
// import { GoogleGenerativeAI } from "@google/generative-ai";

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
  const [convertPdfLoad, setConvertPdfLoad] = useState<boolean>(false);
  const [openPdfLoad, setOpenPdfLoad] = useState<boolean>(false);

  const { getFilterItem } = useLocalStorage();

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
    return new Date(`${year}-${month}-${day}`); // Format for Date object
  }

  const uploadToCloudinary = async (): Promise<any> => {
    const uploadedFile = form.getValues("file");
    if (!pdfBlob || !uploadedFile) return;

    if (editForm) {
      dispatch(setEditFuncLoad(true));
    } else {
      dispatch(setAddExpenseLoad(true));
    }
    const formData = new FormData();
    formData.append(
      "file",
      pdfBlob,
      uploadedFile?.name.replace(/\.[^/.]+$/, ".pdf")
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
  };

  const convertToPDF = async () => {
    setConvertPdfLoad(true);
    const file = form.getValues("file");

    if (!file) {
      toast.warn("Enter a bill");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (e) => {
      const correctedImage = e.target?.result as string;

      if (file.type === "application/pdf") {
        const createdPdfBlob = new Blob([file], {
          type: "application/pdf",
        });

        setPdfBlob(createdPdfBlob);
        setConvertPdfLoad(false);
      } else {
        try {
          const createdPdfBlob = await createPdf(correctedImage, file);

          if (createdPdfBlob) {
            setPdfBlob(createdPdfBlob);
          }
        } catch (err) {
          console.error(err);
          toast.error(
            "An unexpected error occurred while converting the image to PDF."
          );
        } finally {
          setConvertPdfLoad(false); // Ensure loading state is reset
        }
      }

      // await generateWithAI()
    };
  };

  const openWindow = () => {
    if (pdfBlob) {
      setOpenPdfLoad(true);
      // Open the PDF in a new tab
      window.open(URL.createObjectURL(pdfBlob), "_blank");
      setOpenPdfLoad(false);
    } else if (editForm) {
      if (expense?.billImage && expense?.billImage !== "") {
        setOpenPdfLoad(true);
        window.open(expense?.billImage, "_blank");
        setOpenPdfLoad(false);
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

  const resetForm = () => {
    form.reset();
    form.setValue("miscellaneousPaidToName", "");
    form.setValue("miscellaneousPaidToRole", "");
    form.setValue("paidTo", "");
    form.setValue("paymentMode", "");
    if (projectOptions.length !== 1) {
      form.setValue("project", "");
    }
    setPdfBlob(undefined);
  };

  // const convertToBase64 = (uploadedFile: File): Promise<string>  => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(uploadedFile);
  //     reader.onload = () => {
  //       if (typeof reader.result === "string") {
  //         resolve(reader.result.split(",")[1]); // Ensure it's a string before calling .split()
  //       } else {
  //         reject(new Error("File conversion failed: Result is not a string"));
  //       }
  //     };
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  // const generateWithAI = async () => {
  //   const uploadedFile = form.getValues("file") as File | undefined;

  //   if (!uploadedFile || !(uploadedFile instanceof File)) {
  //     console.error("No valid file uploaded");
  //     return;
  //   }

  //   const genAI = new GoogleGenerativeAI(
  //     "AIzaSyBoE5l0fa9oT_Z6lq4L9UX70k1Dpo82NYw"
  //   );
  //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  //   try {
  //     const base64StringOfImage = await convertToBase64(uploadedFile);

  //     if (base64StringOfImage) {
  //       const prompt = "Give a description for the uploaded bill image";
  //       const result = await model.generateContent([
  //         prompt,
  //         base64StringOfImage,
  //       ]);
  //       console.log(result.response.text());
  //     }
  //   } catch (error) {
  //     console.error("Error generating AI content:", error);
  //   }
  // };

  const onSubmit = async (formData: z.infer<typeof addExpenseFormSchema>) => {
    if (editForm) {
      const editedFormData: EditedFormValueType = {
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
        // await dispatch(getUserProjectExpense(expense ? expense.projectId : ""));
        getFilterExpense(getFilterItem, dispatch, expense?.projectId);
      }

      dispatch(
        setEditDrawerOpen({ id: "", open: false, dailyExpenseOrNot: false })
      );
      dispatch(setEditFuncLoad(false));
      dispatch(setEditExpenseMiscellaneousInput(false));
    } else {
      const newExpense: FormValueType = {
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
        const addedExpense: any = (response.payload as AddDailyExpenseResponse)
          .newAddedExpense;
        dispatch(addProjectExpense({ expense: addedExpense as ExpenseType }));
      }
      dispatch(setMiscellaneousInput(false));
    }
    resetForm();
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
                    <CalenderBtn disabled={loading} field={field} />
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
                      color="success"
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<PictureAsPdfIcon />}
                      className="h-9 w-full"
                      onClick={() => openWindow()}
                      disabled={openPdfLoad}
                    >
                      {openPdfLoad ? "Loading..." : "View"}
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
                        disabled={convertPdfLoad}
                      >
                        {convertPdfLoad ? "Loading..." : "Upload"}
                        <VisuallyHiddenInput
                          accept="image/png, image/jpeg ,  application/pdf"
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
                        disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                        disabled={loading}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;
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
                        disabled={loading}
                        onInput={(e) => {
                          const input = e.target as HTMLInputElement;
                          input.value = input.value
                            .toLowerCase()
                            .replace(/\s+/g, "");
                          field.onChange(input.value); // Update form state
                        }}
                        placeholder="Enter the role"
                        {...field}
                      />
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
                      disabled={loading}
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
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddExpenseForm;
