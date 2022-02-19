import { connect, useDispatch } from "react-redux"
import GlobalState from "../../../logic/reducers/GlobalState";
import { ModalInterface } from "../../../logic/reducers/ui"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { showModal } from "../../../logic/actions/ui";

interface Props {
    modal: ModalInterface
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


function MuiModal ({ modal }: Props) {

    const dispatch = useDispatch();
    
    return (
            <Modal
                open={modal.show}
                onClose={()=>dispatch(showModal(false))}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {modal.title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {modal.content}
                </Typography>
                </Box>
            </Modal>
    )
}



function mapStateToProps (state: GlobalState) {
    return {
        modal: state.ui.modal,
    }
}

export default connect(mapStateToProps)(MuiModal)