import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // التعديل هنا: الـ CommonModule بياجي من @angular/common مش core
import { RouterModule } from '@angular/router';
// قم بعمل import لكومبوننت الـ input المخصص هنا، على سبيل المثال:
// import { InputComponent } from '../../shared/components/input/input.component'; 

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule
    // InputComponent <-- ضيف اسم كومبوننت الـ input المخصص هنا عشان الإيرور يختفي
  ],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
}