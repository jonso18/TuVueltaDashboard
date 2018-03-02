import { MatDialogConfig } from '@angular/material';

export const dataConfirmation = (title: string, question: string): MatDialogConfig => {
    return {
        width: '300px',
        data: { title, question }
    }
}