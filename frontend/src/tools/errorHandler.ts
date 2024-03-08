import { openNotificationWithIcon } from './showNotification';

export const errorHandler = (error: any, notificationApi: any) => {
    const status = error?.response?.status;
    
    switch (status) {
        case 401:
            openNotificationWithIcon(notificationApi, 'error', 'Unauthorized exception', 'Unauthorized exception');
            break;
        case 400:
            openNotificationWithIcon(
                notificationApi,
                'error',
                'Bad Request Exception',
                error?.response?.data?.message ?? 'Check your input and try again',
            );
            break;
        case 404:
            openNotificationWithIcon(
                notificationApi,
                'error',
                'Not found error',
                error?.response?.data?.message ?? 'The resource was not found',
            );
            break;
        case 500:
            openNotificationWithIcon(
                notificationApi,
                'error',
                'Internal Server Error',
                error?.response?.data?.message ?? 'Something went wrong',
            );
            break;
        default:
            openNotificationWithIcon(notificationApi, 'error', 'Unexpected exception', 'Unexpected exception');
            break;
    }
};
