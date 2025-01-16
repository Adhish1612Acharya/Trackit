import AddProjectFormCard from '@/components/AddProjectFormCard/AddProjectFormCard';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useNavigate } from 'react-router-dom';

const AddProjectPage = () => {
  const navigate=useNavigate();
    const dispatch=useAppDispatch();
 
      const addProjectExpenseBtn=useAppSelector(state=>state.addDailyExpense.addProjectBtnLoad);

  return (
   <AddProjectFormCard navigate={navigate} dispatch={dispatch} addProjectBtnLoad={addProjectExpenseBtn}/>
  )
}

export default AddProjectPage