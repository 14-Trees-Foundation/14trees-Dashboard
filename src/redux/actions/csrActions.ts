import ApiClient from '../../api/apiClient/apiClient';
import csrActionTypes from '../actionTypes/csrActionTypes';
import { toast } from 'react-toastify';

export const getCsrRequests = (
	offset: number,
	limit: number,
	filters?: any[],
	paymentStatus?: string,
) => {
	const apiClient = new ApiClient();
	return (dispatch: any) => {
		dispatch({ type: csrActionTypes.GET_CSR_REQUESTS_REQUESTED });
		apiClient
			.getCsrRequests(offset, limit, filters, paymentStatus)
			.then((value: any) => {
				dispatch({
					type: csrActionTypes.GET_CSR_REQUESTS_SUCCEEDED,
					payload: {
						...value,
						results: value.results.map((r: any) => ({ ...r, key: r.id })),
					},
				});
			})
			.catch((error: any) => {
				toast.error(error.message);
				dispatch({
					type: csrActionTypes.GET_CSR_REQUESTS_FAILED,
					payload: error,
				});
			});
	};
};

export const createCsrRequest = (data: any) => {
	const apiClient = new ApiClient();
	return (dispatch: any) => {
		dispatch({ type: csrActionTypes.CREATE_CSR_REQUEST_REQUESTED });
		apiClient
			.createCsrRequest(data)
			.then((value: any) => {
				toast.success('CSR request created');
				dispatch({
					type: csrActionTypes.CREATE_CSR_REQUEST_SUCCEEDED,
					payload: value,
				});
			})
			.catch((error: any) => {
				toast.error(error.message);
				dispatch({ type: csrActionTypes.CREATE_CSR_REQUEST_FAILED });
			});
	};
};

export const updateCsrRequest = (id: number, data: any) => {
	const apiClient = new ApiClient();
	return (dispatch: any) => {
		dispatch({ type: csrActionTypes.UPDATE_CSR_REQUEST_REQUESTED });
		apiClient
			.updateCsrRequest(id, data)
			.then((value: any) => {
				toast.success('CSR request updated');
				dispatch({
					type: csrActionTypes.UPDATE_CSR_REQUEST_SUCCEEDED,
					payload: value,
				});
			})
			.catch((error: any) => {
				toast.error(error.message);
				dispatch({ type: csrActionTypes.UPDATE_CSR_REQUEST_FAILED });
			});
	};
};

export const deleteCsrRequest = (id: number) => {
	const apiClient = new ApiClient();
	return (dispatch: any) => {
		dispatch({ type: csrActionTypes.DELETE_CSR_REQUEST_REQUESTED });
		apiClient
			.deleteCsrRequest(id)
			.then(() => {
				toast.success('CSR request deleted');
				dispatch({
					type: csrActionTypes.DELETE_CSR_REQUEST_SUCCEEDED,
					payload: id,
				});
			})
			.catch((error: any) => {
				toast.error(error.message);
				dispatch({ type: csrActionTypes.DELETE_CSR_REQUEST_FAILED });
			});
	};
};

export const bookCsrTrees = (
	id: number,
	count: number,
	assignedTo?: number,
) => {
	const apiClient = new ApiClient();
	return (dispatch: any) => {
		dispatch({ type: csrActionTypes.BOOK_CSR_TREES_REQUESTED });
		apiClient
			.bookCsrTrees(id, count, assignedTo)
			.then((value: any) => {
				toast.success(`Booked ${value.booked} trees`);
				dispatch({
					type: csrActionTypes.BOOK_CSR_TREES_SUCCEEDED,
					payload: value,
				});
			})
			.catch((error: any) => {
				toast.error(error.message);
				dispatch({ type: csrActionTypes.BOOK_CSR_TREES_FAILED });
			});
	};
};
