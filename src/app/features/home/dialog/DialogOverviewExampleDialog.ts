import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './DialogOverviewExampleDialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: { roomSlug: string }) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
