import { Divider } from '@mui/material';
import { User1 } from './table/User1';
import { ToastContainer } from 'react-toastify';

export const Users = () => {
	return (
		<>
			<ToastContainer />
			<User1 />
			<Divider sx={{ backgroundColor: '#ffffff', marginTop: '20px' }} />
		</>
	);
};
