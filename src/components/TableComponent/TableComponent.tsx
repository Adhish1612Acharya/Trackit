import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import ReasonField from "../ReasonField/ReasonField";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { TableComponentProps } from "./TableComponentTypes";
import { setDeleteConformationDrawerOpen, setEditDrawerOpen } from "@/store/features/EditDeleteExpense/EditDeleteExpenseSlice";
import getExpenseDetails from "@/store/features/EditDeleteExpense/Thunks/getExpenseDetails/getExpenseDetails";

const TableComponent: FC<TableComponentProps> = ({
  expense,
  projectExpense,
  dispatch,
  dataTableLoader,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        display: { xs: "none", sm: "none", md: "block" },
        boxShadow: 3,
        maxHeight: 440,
      }}
    >
      {/* <Box sx={{ overflow: "auto", maxHeight: "inherit" }}> */}
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1f2937 !important" }}>
            {[
              "#",
              "Date",
              "Amount",
              "Paid To",
              "Payment Mode",
              "Reason",
              "Bill",
              "Project",
              "Options",
            ].map((header) => (
              <TableCell
                key={header}
                sx={{ color: "black", fontWeight: "bold" }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataTableLoader ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : expense.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="h6">No expense added</Typography>
              </TableCell>
            </TableRow>
          ) : (
            expense.map((eachExpense, index) => (
              <TableRow
                key={index + 1}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {typeof eachExpense.date === "string" ? eachExpense.date : ""}
                  {projectExpense ? null : (
                    <>
                      <br />
                      <small>(today)</small>
                    </>
                  )}
                </TableCell>
                <TableCell sx={{ color: "#059669", fontWeight: "bold" }}>
                  &#x20B9;{eachExpense.amount}
                </TableCell>
                <TableCell>
                  {eachExpense.miscellaneous ? (
                    <Tooltip title={eachExpense.miscellaneuosPaidToName} arrow>
                      <Typography
                        variant="body2"
                        style={{ cursor: "pointer" }}
                        color="text.primary"
                      >
                        {eachExpense.miscellaneousPaidToRole}
                        <br />
                        <small>
                          Name : {eachExpense.miscellaneuosPaidToName}
                        </small>
                        <br />
                        <small>(miscellaneous)</small>
                      </Typography>
                    </Tooltip>
                  ) : (
                    eachExpense.paidToName
                  )}
                </TableCell>
                <TableCell>{eachExpense.paymentModeName}</TableCell>
                <TableCell>
                  <ReasonField reason={eachExpense.reason} />
                </TableCell>
                <TableCell>
                  {eachExpense.billImage && eachExpense.billImage !== "" ? (
                    <Button
                      id="fileInput"
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<PictureAsPdfIcon />}
                      className="h-9 w-full"
                      onClick={() => {
                        window.open(eachExpense.billImage, "_blank");
                      }}
                    >
                      View
                    </Button>
                  ) : (
                    <p>No Bill Uploaded</p>
                  )}
                </TableCell>
                <TableCell>{eachExpense.projectTitle}</TableCell>
                <TableCell>
                  <EditIcon
                    style={{
                      cursor: "pointer",
                      color: "green",
                      marginRight: "1rem",
                    }}
                    onClick={() => {
                      dispatch(
                        setEditDrawerOpen({
                          id: eachExpense.expenseId,
                          open: true,
                          dailyExpenseOrNot: false,
                        })
                      );

                      dispatch(getExpenseDetails(eachExpense.expenseId));
                    }}
                  />

                  <DeleteIcon
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => {
                      dispatch(
                        setDeleteConformationDrawerOpen({
                          open: true,
                          expenseId: eachExpense.expenseId,
                        })
                      );
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* </Box> */}
    </TableContainer>
  );
};

export default TableComponent;
