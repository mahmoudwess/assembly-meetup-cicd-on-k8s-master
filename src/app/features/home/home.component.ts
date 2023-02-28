import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from './dialog/DialogOverviewExampleDialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  roomSlug: string;

  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog, private _route: Router) { }

  ngOnInit() {

  }
  copyToClipboard(str: string) {
    const url = `${window.location}room/${str}`;
    const el = document.createElement("textarea");
    el.value = url;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    this._snackBar.open("Copied to clipboard!","", {
      duration: 2000,
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '260px',
      data: {roomSlug: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.roomSlug = result;
      this.copyToClipboard(this.roomSlug);
      this._route.navigate(['room', this.roomSlug])
    });
  }

}

