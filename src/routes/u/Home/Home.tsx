import NavigateBoxBtns from "@/components/NavigateBoxBtns/NavigateBoxBtns";
import { useNavigate } from "react-router-dom";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FolderIcon from '@mui/icons-material/Folder';

const OwnerHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <div
        style={{ marginTop: "4rem" }}
        className="flex justify-evenly w-full content-evenly items-center flex-wrap"
      >
        <NavigateBoxBtns
          title="Daily Expense"
          description="Add And View Daily Expense"
          handleClick={() => navigate("/u/daily-expense")}
          icon={<CurrencyRupeeIcon />}
        />
        <NavigateBoxBtns
          title="Projects"
          description="View All Of Your Projects"
          handleClick={() => navigate("/u/projects")}
          icon={<FolderIcon />}
        />
      </div>
    </>
  );
};

export default OwnerHome;
