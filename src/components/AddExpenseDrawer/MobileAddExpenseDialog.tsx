import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { addExpenseDrawerProps } from './AddExpenseDrawer';
import { DialogContent } from '@mui/material';
import AddExpenseForm from './AddExpenseForm';
import AddProjectDrawer from './AddProjectDrawer';
import { setOpenAddExpenseDrawer } from '@/store/features/DailyExpense';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const MobileAddExpenseDialog: React.FC<addExpenseDrawerProps> = ({ dispatch,
    openDrawer,
    openAddProjectDrawer,
    projectOptions}) => {
  return (
    <Dialog
     sx={{
        display: {
          xs: 'block', // Visible on extra-small (xs) screens
          sm: 'block', // Visible on small (sm) screens
          md: 'none',  // Hidden on medium (md) screens and above
        },
      }}
      
    fullScreen
    open={openDrawer}
    // onClose={handleClose}
    TransitionComponent={Transition}
  >
    <AppBar sx={{ position: 'relative' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
       onClick={() => dispatch(setOpenAddExpenseDrawer(false))}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          Sound
        </Typography>
        <Button autoFocus color="inherit"  onClick={() => dispatch(setOpenAddExpenseDrawer(false))}>
          save
        </Button>
      </Toolbar>
    </AppBar>
    <DialogContent dividers>
    <AddExpenseForm
          dispatch={dispatch}
          projectOptions={projectOptions}
        />

        <AddProjectDrawer open={openAddProjectDrawer} dispatch={dispatch} />

        </DialogContent> 
  </Dialog>
  )
}
