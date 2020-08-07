import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

import { ProductService, MessageService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})

export class NewComponent implements OnInit {
  newProductForm: FormGroup;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const day = today.getDate();

    this.newProductForm = new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$'), Validators.maxLength(50)]),
      'id': new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(13)]),
      'manager': new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.maxLength(30)]),
      'sales_start_date': new FormControl(day + '.' + month + '.' + year, [Validators.required])
    });
  }

  onSubmit() {
    // reset alerts on submit
    this.messageService.clear();

    // stop here if form is invalid
    if (this.newProductForm.invalid) {
      return;
    }

    this.loading = true;
    /** add products inside the fake api server **/
    this.productService.addProduct({
      id: this.newProductForm.controls.id.value,
      name: this.newProductForm.controls.name.value,
      manager: this.newProductForm.controls.manager.value,
      sales_start_date: this.newProductForm.controls.sales_start_date.value
    })
      .subscribe(
        data => {
          this.loading = false;
          this.messageService.success('Successfully added the product');
          this.router.navigate(['/sales']);
        },
        error => {
          this.messageService.error(error.error.message);
          this.loading = false;
        });
  }

  resetForm() {
    this.newProductForm.reset();
  }
}
