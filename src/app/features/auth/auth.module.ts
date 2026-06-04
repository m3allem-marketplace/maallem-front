import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module'

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { ButtonComponent, InputComponent } from '@m3allem/ui-kit';

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        ButtonComponent,
        InputComponent
    ]
})
export class AuthModule { }
