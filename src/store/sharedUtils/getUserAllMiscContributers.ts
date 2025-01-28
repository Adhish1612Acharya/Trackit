import { db } from "@/firebaseconfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AllProjectContributerType } from "../features/EditDeleteExpense/Thunks/getExpenseDetails/getExpenseDetailsTypes";
import normalizeString from "./normalizeString";

const getUserAllProjects = async (uid: string) => {
  const userProjectsCollectionRef = collection(db, "projects");

  const userProjectsRefQuery = query(
    userProjectsCollectionRef,
    where("owner", "==", uid)
  );

  const response = await getDocs(userProjectsRefQuery);

  return response;
};

const getMiscContributers = (
  projectContributers: AllProjectContributerType[]
): AllProjectContributerType[] => {
  return projectContributers.filter(
    (eachContributer: AllProjectContributerType) => {
      return eachContributer.miscellaneous === true;
    }
  );
};

const filterDuplicateContributers = (
  userProjectsMiscContributers: AllProjectContributerType[]
): AllProjectContributerType[] => {
  return userProjectsMiscContributers.filter((item, index, self) => {
    const normalizeName = normalizeString(item.name);
    const normalizeRole = normalizeString(item.miscellaneousRole);

    const uniqueIdx = self.findIndex((each) => {
      return (
        normalizeString(each.name) === normalizeName &&
        normalizeString(each.miscellaneousRole) === normalizeRole
      );
    });

    return index === uniqueIdx;
  });
};

const getUserAllMiscContributers = async (uid: string) => {
  const userProjectsSnapShot = await getUserAllProjects(uid);

  const userProjectsMiscContributersArray: AllProjectContributerType[][] =
    userProjectsSnapShot.docs.map((doc) => {
      const project = doc.data();
      const projectContributers = project.contributers;
      const miscContributer = getMiscContributers(projectContributers);
      return miscContributer;
    });

  const userProjectsMiscContributers =
    userProjectsMiscContributersArray.flatMap((project) => {
      return project;
    });

  return filterDuplicateContributers(userProjectsMiscContributers);
};

export default getUserAllMiscContributers;
