import { GlobalConfig } from 'ngx-toastr';

export const ToastConfig: Partial<GlobalConfig> = {
    positionClass: 'toast-bottom-right',
    disableTimeOut: true,
    closeButton: true,
    enableHtml: true,
    preventDuplicates: true
}