import { MatDialogConfig } from '@angular/material';

export const dataConfirmation = (title: string, question: string): MatDialogConfig => {
    return {
        width: '250px',
        data: { title, question }
    }
}