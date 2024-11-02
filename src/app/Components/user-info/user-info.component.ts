import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../Services/user-auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required)
  });

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    console.log('Initializing UserInfoComponent');
    this.authService.getAuthState().subscribe(user => {
      if (user) {
        console.log('User authenticated:', user);
        this.firestore.collection('users').doc(user.uid)
          .get()
          .subscribe(doc => {
            if (doc.exists) {
              const userData = doc.data();
              console.log('Setting form data:', userData);
              this.userForm.setValue({
                name: userData?.name || '',
                email: userData?.email || '',
                lastname: userData?.lastname || ''
              });
            }
          });
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.authService.getCurrentUser().then(user => {
        if (user) {
          const updateData = {
            name: this.userForm.get('name')?.value,
            lastname: this.userForm.get('lastname')?.value
          };
          this.firestore.collection('users').doc(user.uid).update(updateData);
        }
      });
    }
  }
}