import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  message_header: string;
  form: FormGroup;
  submitted = false;
  passwordPattern: any = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  showpassword = false;
  passwordToggleIcon = 'eye';
  showpasswordConfirm = false;
  passwordToggleIconConfirm = 'eye';

  constructor() { }

  ngOnInit() {
    this.getCurrentHour();
    this.loadForm();
  }

  loadForm() {
    this.form = new FormGroup({
      password: new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern(this.passwordPattern)]),
      password_confirmation: new FormControl('', [Validators.required]),
    },{ validators: this.matchingPasswords('password', 'password_confirmation')});
  }

  matchingPasswords(password: string, passwordconfirmation: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const passwordT = group.controls[password];
      const confirmPassword = group.controls[passwordconfirmation];
      if (passwordT.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    };
  }

  changePassword() {
    console.log(this.form.value);
  }

  showpass(): void {
    this.showpassword = !this.showpassword;

    if (this.passwordToggleIcon === 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';
    }
  }

  showpassConfirm(): void {
    this.showpasswordConfirm = !this.showpasswordConfirm;

    if (this.passwordToggleIconConfirm === 'eye') {
      this.passwordToggleIconConfirm = 'eye-off';
    } else {
      this.passwordToggleIconConfirm = 'eye';
    }
  }

  getCurrentHour() {
    var today = new Date()
    var curHr = today.getHours()
    if (curHr < 12) {
      this.message_header = "Buenos días";
    } else if (curHr < 18) {
      this.message_header = "Buenas tardes";
    } else {
      this.message_header = "Buenas noches";
    }
  }
}
