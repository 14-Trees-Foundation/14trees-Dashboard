import { UnknownAction } from 'redux';
import { CsrDataState, CsrRequest } from '../../types/csrRequest';
import csrActionTypes from '../actionTypes/csrActionTypes';

export const csrRequestsDataReducer = (
	state: CsrDataState = {
		loading: false,
		totalRequests: 0,
		requests: {},
		paginationMapping: {},
	},
	action: UnknownAction,
): CsrDataState => {
	switch (action.type) {
		case csrActionTypes.GET_CSR_REQUESTS_REQUESTED:
			return { ...state, loading: true };

		case csrActionTypes.GET_CSR_REQUESTS_SUCCEEDED: {
			const payload = action.payload as any;
			const results: CsrRequest[] = payload.results;
			const offset: number = payload.offset;

			const nextState: CsrDataState = {
				loading: false,
				totalRequests: payload.total,
				requests: offset === 0 ? {} : { ...state.requests },
				paginationMapping: offset === 0 ? {} : { ...state.paginationMapping },
			};

			results.forEach((req, index) => {
				nextState.requests[req.id] = req;
				nextState.paginationMapping[offset + index] = req.id;
			});

			return nextState;
		}

		case csrActionTypes.GET_CSR_REQUESTS_FAILED:
			return { ...state, loading: false };

		case csrActionTypes.CREATE_CSR_REQUEST_REQUESTED:
		case csrActionTypes.UPDATE_CSR_REQUEST_REQUESTED:
		case csrActionTypes.DELETE_CSR_REQUEST_REQUESTED:
		case csrActionTypes.BOOK_CSR_TREES_REQUESTED:
			return { ...state, loading: true };

		case csrActionTypes.CREATE_CSR_REQUEST_SUCCEEDED: {
			const req = action.payload as CsrRequest;
			return {
				...state,
				loading: false,
				totalRequests: state.totalRequests + 1,
				requests: { ...state.requests, [req.id]: req },
			};
		}

		case csrActionTypes.UPDATE_CSR_REQUEST_SUCCEEDED: {
			const req = action.payload as CsrRequest;
			return {
				...state,
				loading: false,
				requests: { ...state.requests, [req.id]: req },
			};
		}

		case csrActionTypes.DELETE_CSR_REQUEST_SUCCEEDED: {
			const id = action.payload as number;
			const nextRequests = { ...state.requests };
			delete nextRequests[id];
			return {
				...state,
				loading: false,
				totalRequests: Math.max(0, state.totalRequests - 1),
				requests: nextRequests,
			};
		}

		case csrActionTypes.BOOK_CSR_TREES_SUCCEEDED: {
			const result = action.payload as any;
			const updated = result.csr_request as CsrRequest;
			return {
				...state,
				loading: false,
				requests: updated
					? { ...state.requests, [updated.id]: updated }
					: state.requests,
			};
		}

		case csrActionTypes.CREATE_CSR_REQUEST_FAILED:
		case csrActionTypes.UPDATE_CSR_REQUEST_FAILED:
		case csrActionTypes.DELETE_CSR_REQUEST_FAILED:
		case csrActionTypes.BOOK_CSR_TREES_FAILED:
			return { ...state, loading: false };

		default:
			return state;
	}
};
