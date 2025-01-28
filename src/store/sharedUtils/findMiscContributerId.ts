import { v4 as uuidv4 } from "uuid";
import { Contributer } from "../features/EditDeleteExpense/Thunks/editExpenseDetails/editExpenseDetailsTypes";
import normalizeString from "./normalizeString";

const findMiscContributerId = (
  allProjectMiscContributer: Contributer[],
  miscellaneuosPaidToName: string,
  miscellaneousPaidToRole: string
): string => {
  const matchedMiscContributer = allProjectMiscContributer.filter(
    (eachContributer) => {
      return (
        normalizeString(eachContributer.name) ===
          normalizeString(miscellaneuosPaidToName) &&
        normalizeString(eachContributer.miscellaneousRole) ===
          normalizeString(miscellaneousPaidToRole)
      );
    }
  );
  if (matchedMiscContributer.length > 0) {
    return matchedMiscContributer[0].miscellaneousId;
  } else {
    return uuidv4();
  }
};

export default findMiscContributerId;
