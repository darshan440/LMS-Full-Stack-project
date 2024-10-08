import { Route } from 'next';
import  React,{FC} from 'react'
import { Modal,Box } from '@mui/material';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: any;
    component: any;
    setRoute: (Route: string) => void;
    
}

export const CustomModal: FC<Props> = ({open,setOpen,setRoute,component:Component}) => {
  return (
      <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby='modal-modal-titel'
          aria-describedby='modal-modal-description'
      >
          <Box className='absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none'>
              < Component setOpen={setOpen } setRoute={setRoute} />
          </Box>
          

    </Modal>
  )
}