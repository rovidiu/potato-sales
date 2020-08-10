import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ProductService, MessageService } from '../../services';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  sales = [];
  columns = [];
  loading = false;
  searchValue = '';
  apiSales = [];
  /** this are original answer received from api, each time a search is done reset sales array to this one and start */
  editSale = {
    productID: 0,
    productName: '',
    salesQ1: 0,
    salesQ2: 0,
    salesQ3: 0,
    salesQ4: 0
  };
  editSaleBckp = {
    productID: 0,
    productName: '',
    salesQ1: 0,
    salesQ2: 0,
    salesQ3: 0,
    salesQ4: 0
  };
  editSaleProductID = 0;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;

    /** get all products from the server */
    this.productService.getProducts()
      .pipe(first())
      .subscribe(response => {
        this.sales = response.data;
        this.apiSales = response.data;
        this.columns = response.columns;
        this.loading = false;
      });
  }

  /**
   * return quarter sales total
   * @param rowVal - sales
   * @returns {number} - total
   */
  getTotalSales(rowVal) {
    let totalVal = 0
    if (rowVal && Object.keys(rowVal)) {
      Object.keys(rowVal).forEach((val) => {
        if (val.indexOf('sales') > -1) {
          totalVal += parseInt(rowVal[val], 10);
        }
      });
    }

    return totalVal;
  }

  isInt(value) {
    const x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
  }

  sortTable(colField) {
    /** now inside headers add right sortable icons and values */
    let searchBy = '';
    let searchOrder = '';
    if (colField) {
      /** search in headers */
      if (this.columns && this.columns.length) {
        this.columns.forEach((col, idx) => {
          if (col.field === colField) {
            /** if we found the column inside sales row */
            if (!col.sort) {
              this.columns[idx].sort = 'asc';
              this.columns[idx].sortClass = 'pi-sort-amount-up-alt';
            } else {
              if (col.sort === 'asc') {
                this.columns[idx].sort = 'desc';
                this.columns[idx].sortClass = 'pi-sort-amount-down';
              } else {
                this.columns[idx].sort = 'asc';
                this.columns[idx].sortClass = 'pi-sort-amount-up-alt';
              }
            }

            searchBy = colField;
            searchOrder = this.columns[idx].sort;
          } else {
            /** search in subheaders if exists */
            if (col.subHeaders && col.subHeaders.length) {
              col.subHeaders.forEach((sub, idx1) => {
                if (sub.field === colField) {
                  if (!sub.sort) {
                    this.columns[idx].subHeaders[idx1].sort = 'asc';
                    this.columns[idx].subHeaders[idx1].sortClass = 'pi-sort-amount-up-alt';
                  } else {
                    if (sub.sort === 'asc') {
                      this.columns[idx].subHeaders[idx1].sort = 'desc';
                      this.columns[idx].subHeaders[idx1].sortClass = 'pi-sort-amount-down';
                    } else {
                      this.columns[idx].subHeaders[idx1].sort = 'asc';
                      this.columns[idx].subHeaders[idx1].sortClass = 'pi-sort-amount-up-alt';
                    }
                  }

                  searchBy = colField;
                  searchOrder = this.columns[idx].subHeaders[idx1].sort;
                } else {
                  this.columns[idx].subHeaders[idx1].sort = '';
                  this.columns[idx].subHeaders[idx1].sortClass = '';
                }
              });
            } else {
              this.columns[idx].sort = '';
              this.columns[idx].sortClass = '';
            }
          }
        });
      }
    } else {
      /** means that we are on total */
      if (!this.columns[this.columns.length - 1].sort) {
        this.columns[this.columns.length - 1].sort = 'asc';
        this.columns[this.columns.length - 1].sortClass = 'pi-sort-amount-up-alt';
      } else {
        if (this.columns[this.columns.length - 1].sort === 'asc') {
          this.columns[this.columns.length - 1].sort = 'desc';
          this.columns[this.columns.length - 1].sortClass = 'pi-sort-amount-down';
        } else {
          this.columns[this.columns.length - 1].sort = 'asc';
          this.columns[this.columns.length - 1].sortClass = 'pi-sort-amount-up-alt';
        }
      }

      searchBy = colField;
      searchOrder = this.columns[this.columns.length - 1].sort;
    }


    if (searchBy && searchOrder) {
      if (searchOrder === 'asc') {
        this.sales.sort((a, b) => 0 - (a[searchBy] > b[searchBy] ? -1 : 1));
      } else {
        this.sales.sort((a, b) => 0 - (b[searchBy] > a[searchBy] ? -1 : 1));
      }
    }


    if (!searchBy && searchOrder) {
      /** we are in total because for this one we dont have colField. */
      if (searchOrder === 'asc') {
        this.sales.sort((a, b) => 0 - (this.getTotalSales(a) > this.getTotalSales(b) ? -1 : 1));
      } else {
        this.sales.sort((a, b) => 0 - (this.getTotalSales(b) > this.getTotalSales(a) ? -1 : 1));
      }
    }
  }

  /**
   * search for a string inside the sales object - doesnt matter in which columns
   * return all the sales where we found the searched string
   */
  onSalesSearch() {
    const filteredSales = []
    if (this.searchValue && this.apiSales && this.apiSales.length) {
      this.apiSales.forEach((sale) => {
        if (sale && Object.values(sale).length) {
          const recordFound = Object.values(sale).filter((val, key) => {
            const saleVal = '' + val;
            if (saleVal.toLowerCase().indexOf(this.searchValue) > -1) {
              return true;
            }

            return false;
          });

          if (recordFound && recordFound.length) {
            filteredSales.push(sale);
          }
        }
      });
    }

    this.sales = filteredSales;
  }

  /**
   * clear search form for sales and rest sales to initial state
   */
  resetSalesSearchForm() {
    this.sales = this.apiSales;
    this.searchValue = '';
  }

  /**
   * edit sale
   * @param sale
   */
  editSaleRow(sale) {
    this.editSaleProductID = sale.productID;
    this.editSale = sale;
    this.editSaleBckp = {
      ...sale
    };
  }

  /**
   * update sale
   */
  updateSaleRow() {
    if (this.editSale) {
      const validateProductID = this.validateProductId()
      if (validateProductID.length) {
        this.editSale.productID = this.apiSales.filter((sale) => sale.productID === this.editSale.productID)[0].productID;
        this.messageService.error(validateProductID);
        return;
      }

      const validateProductName = this.validateProductName()
      if (validateProductName.length) {
        this.messageService.error(validateProductName);
        return;
      }

      this.loading = true;
      this.productService.update(this.editSale)
        .pipe(first())
        .subscribe(
          data => {
            this.messageService.success('Update successful');

            this.apiSales = data.data;
            this.sales = data.data;
          },
          error => {
            this.messageService.error(error);
          });

      this.loading = false;
      this.resetEditSale();
    }
  }

  /**
   * in order to track which items have been added or destroyed
   */
  trackByFn(index: any, item: any) {
    return index;
  }

  /**
   * redirect to add a new product page
   */
  onAddNewProduct() {
    this.router.navigate(['/product/new']);
  }

  /**
   * validate id field
   */
  validateProductId() {
    const reg = new RegExp('^[0-9]+$');

    if (!this.editSale.productID) {
      return 'Product ID is required.';
    }

    if (this.editSale.productID.toString().length > 13) {
      return 'Product ID should have less that 13 numeric chars.';
    }

    if (!reg.test(this.editSale.productID.toString())) {
      return 'Product ID should contains only numeric chars.';
    }

    return '';
  }

  /**
   * validate id field
   */
  validateProductName() {
    const reg = new RegExp('^[A-Za-z0-9 ]+$');

    if (!this.editSale.productName) {
      return 'Product Name is required.';
    }

    if (this.editSale.productName.length > 50) {
      return 'Product ID should have less that 50 alphanumeric chars.';
    }

    // if (!reg.test(this.editSale.productName)) {
    //   return 'Product name should contains only alphanumeric chars.';
    // }

    return '';
  }

  /**
   * cancel editing of a sale row
   */
  cancelUpdateSaleRow(rowIndex) {
    this.resetEditSale();
    this.apiSales[rowIndex] = this.editSaleBckp;
  }


  resetEditSale() {
    this.editSale = {
      productID: 0,
      productName: '',
      salesQ1: 0,
      salesQ2: 0,
      salesQ3: 0,
      salesQ4: 0
    };
  }
}
