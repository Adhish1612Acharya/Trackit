import {
  Contributer,
} from "../features/EditDeleteExpense/Thunks/editExpenseDetails/editExpenseDetailsTypes";
import normalizeString from "./normalizeString";

const checkContributerExists = (
  contributersLists: Contributer[],
  paidToId: string,
  miscellaneuosPaidToName: string,
  miscellaneousPaidToRole: string
):Contributer[] => {
  return contributersLists.filter((contributer: Contributer) =>
    paidToId != "51"
      ? contributer.id === paidToId
      : normalizeString(contributer.name) ===
          normalizeString(miscellaneuosPaidToName) &&
        normalizeString(contributer.miscellaneousRole) ===
          normalizeString(miscellaneousPaidToRole)
  );
};

export default checkContributerExists;
