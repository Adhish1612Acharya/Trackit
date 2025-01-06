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
} from "@mui/material";
import ReasonField from "./ReasonField";
import { expenseType } from "@/store/features/DailyExpense";
import { RootState } from "@/store/store";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import {
  getExpenseDetails,
  setDeleteConformationDrawerOpen,
  setEditDrawerOpen,
} from "@/store/features/EditDeleteExpense";

interface tableComponentProps {
  expense: expenseType[] | [];
  projectExpense: boolean;
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  dataTableLoader: boolean;
}

const TableComponent: FC<tableComponentProps> = ({
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
