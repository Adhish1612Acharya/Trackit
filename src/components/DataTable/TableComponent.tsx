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
import { useAppSelector } from "@/store/store";

interface tableComponentProps {
  expense: expenseType[] | [];
  projectExpense: boolean;
}

const TableComponent: FC<tableComponentProps> = ({
  expense,
  projectExpense,
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
          {useAppSelector((state) =>
            state.addDailyExpense.dataTableLoader ? (
              <TableRow
                key={-1}
                sx={{
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#f3f4f6" },
                  height: "100px",
                  display: "flex", // Enable flexbox
                  justifyContent: "center", // Center horizontally
                  alignItems: "center", // Center vertically
                }}
              >
                <TableCell
                  colSpan={7} // Spans across all columns
                  sx={{
                    borderBottom: "none", // Remove bottom border
                    textAlign: "center", // Center text in case of other content
                  }}
                >
                  <CircularProgress style={{ marginLeft: "auto" }} />
                </TableCell>
              </TableRow>
            ) : expense.length === 0 ? (
              <TableCell>
                <h1>No expense added</h1>
              </TableCell>
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
                    {eachExpense.date}{" "}
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
                      <Tooltip
                        title={eachExpense.miscellaneuosPaidToName}
                        arrow
                      >
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
                </TableRow>
              ))
            )
          )}
        </TableBody>
      </Table>
      {/* </Box> */}
    </TableContainer>
  );
};

export default TableComponent;
