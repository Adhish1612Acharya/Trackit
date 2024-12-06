import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReasonField from "./ReasonField";
import { expenseType } from "@/store/features/DailyExpense";
import { FC } from "react";

interface expenseAccordianProps {
  index: number;
  toggleAccordion: (index: number) => void;
  openIndex: number | null;
  eachExpense: expenseType;
  projectExpense: boolean;
}

const ExpenseAccordian: FC<expenseAccordianProps> = ({
  index,
  toggleAccordion,
  openIndex,
  eachExpense,
  projectExpense,
}) => {
  return (
    <Accordion
      key={index}
      expanded={openIndex === index}
      onChange={() => toggleAccordion(Number(index))}
      sx={{ boxShadow: 2, mb: 2 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ backgroundColor: "#e5e7eb" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            {index + 1}
          </Typography>
          <Typography variant="body1">
            {eachExpense.date}
            {projectExpense ? null : (
              <>
                <br />
                <small>(today)</small>
              </>
            )}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#059669", fontWeight: "bold" }}
          >
            &#x20B9; {eachExpense.amount}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{ backgroundColor: "#f9fafb", p: 2, borderRadius: 1 }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Paid To:
            </Typography>
            {eachExpense.miscellaneous ? (
              <Tooltip title={eachExpense.miscellaneuosPaidToName} arrow>
                <Typography
                  variant="body2"
                  style={{ cursor: "pointer" }}
                  color="text.primary"
                >
                  {eachExpense.miscellaneousPaidToRole}
                  <br />
                  <small>Name : {eachExpense.miscellaneuosPaidToName}</small>
                  <br />
                  <small>(miscellaneous)</small>
                </Typography>
              </Tooltip>
            ) : (
              eachExpense.paidToName
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Payment Mode:
            </Typography>
            <Typography variant="body2" color="text.primary">
              {eachExpense.paymentModeName}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Reason:
            </Typography>
            <ReasonField reason={eachExpense.reason} />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
            >
              Project:
            </Typography>
            <Typography variant="body2" color="text.primary">
              {eachExpense.projectTitle}
            </Typography>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ExpenseAccordian;
