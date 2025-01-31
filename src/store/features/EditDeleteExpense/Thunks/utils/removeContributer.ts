import { db } from "@/firebaseconfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ContributersType } from "@/store/features/GetProjects/Thunks/getProjectDetails/getProjectDetailsTypes";

const updatedContributers = (
  contributers: ContributersType[],
  miscelleneous: boolean,
  contriId: string
) => {
  return contributers.filter((contributer: ContributersType) => {
    if (miscelleneous) {
      return contributer.miscellaneousId !== contriId;
    } else {
      return contributer.id !== contriId;
    }
  });
};

const checkAndRemoveContributer = async (
  userId: string,
  projectId: string,    
  contriId: string,
  miscelleneous: boolean
) => {
  const projectExpenseQuery = query(
    collection(db, "expense"),
    where("owner", "==", userId),
    where("projectId", "==", projectId),
    where(miscelleneous ? "miscellaneuosPaidToId" : "paidToId", "==", contriId)
  );
  const projectSnapShot = await getDocs(projectExpenseQuery);

  if (projectSnapShot.size == 0) {
    const projectQuery = doc(db, "projects", projectId);
    const projectSnapShot = await getDoc(projectQuery);

    if (!projectSnapShot.exists()) {
      throw new Error("Project not found");
    }

    const contributers = projectSnapShot.data().contributers;

    const filteredContributers = updatedContributers(
      contributers,
      miscelleneous,
      contriId
    );

    await updateDoc(projectQuery, {
      contributers: filteredContributers,
    });
  }
};

export default checkAndRemoveContributer;
