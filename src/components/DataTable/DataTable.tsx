// DataTable.js
import { FC, useState } from "react";
import "../../style/dataTable.css";
import { Typography, Box, Button, Skeleton, Paper } from "@mui/material";
import {
  expenseType,
  setOpenFilterDrawer,
} from "@/store/features/DailyExpense";
import ExpenseAccordian from "./ExpenseAccordian";
import TableComponent from "./TableComponent";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "@/store/store";
import { setProjectDetailsOpenFilterDrawer } from "@/store/features/ProjectDetails";

interface dataTableProps {
  expense: [] | expenseType[];
  dispatch: ThunkDispatch<RootState, undefined, Action>;
  projectExpense: boolean;
  totalExpense: number;
  dailyExpense: boolean;
  projectName?: string;
}

const DataTable: FC<dataTableProps> = ({
  expense,
  dispatch,
  projectExpense,
  totalExpense,
  dailyExpense,
  projectName,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "center", sm: "space-between" }, // Center-align for mobile
          flexDirection: { xs: "column", sm: "row" }, // Stack on mobile
          mb: 2, // Add some margin below the heading
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#374151",
          }}
        >
          {dailyExpense ? "Today's Expense Tracker" : projectName}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<FilterListIcon />}
          sx={{
            textTransform: "none",
            borderRadius: "20px",
            padding: "8px 16px",
            minWidth: "100px",
          }}
          onClick={() =>
            projectExpense
              ? dispatch(setProjectDetailsOpenFilterDrawer(true))
              : dispatch(setOpenFilterDrawer(true))
          }
        >
          Filter
        </Button>
      </Box>

      {/* PC View - Table */}
      <TableComponent expense={expense} projectExpense={projectExpense} />

      {/* Mobile View - Accordion */}
      {useAppSelector((state) => state.addDailyExpense.dataTableLoader) ? (
        <Skeleton
          sx={{
            display: { xs: "block", sm: "block", md: "none" },
            width: "100%",
          }}
          variant="rounded"
          animation="wave"
          style={{
            width: "100%",
          }}
          height={50}
        />
      ) : (
        <Box
          sx={{
            display: { xs: "block", sm: "block", md: "none" },
            maxHeight: "500px", // Set a fixed height
            overflow: "auto", // Enable scrolling
            border: "1px solid #e5e7eb", // Optional: Add a border for visual separation
            borderRadius: "8px", // Rounded corners
            boxShadow: 3, // Add shadow for modern UI
          }}
        >
          {expense.length === 0 ? (
            <h1>No expense added</h1>
          ) : (
            expense.map((eachExpense, index) => (
              <ExpenseAccordian
                key={index}
                index={index}
                openIndex={openIndex}
                toggleAccordion={toggleAccordion}
                eachExpense={eachExpense}
                projectExpense={projectExpense}
              />
            ))
          )}
        </Box>
      )}

      {totalExpense > 0 ? (
        <Paper
          elevation={3}
          sx={{
            mt: 2,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6"> &#x20B9;{totalExpense}</Typography>
        </Paper>
      ) : (
        <Skeleton
          sx={{
            mt: 2,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "90px",
          }}
        />
      )}
      {/* Total displayed in Paper */}
    </Box>
  );
};

export default DataTable;
