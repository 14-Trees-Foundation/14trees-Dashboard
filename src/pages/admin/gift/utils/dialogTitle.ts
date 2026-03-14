export const getDialogTitleWithReqId = (
	title: string,
	requestId?: number | string | null,
) => {
	if (requestId === undefined || requestId === null || requestId === '')
		return title;
	return `${title} (Req. No. ${requestId})`;
};
