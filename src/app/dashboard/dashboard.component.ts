import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { StyleClassModule } from 'primeng/styleclass';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { Product } from './Product';
import { ItemService } from './Item.service';
import { RatingModule } from 'primeng/rating';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ItemUnica } from './itemUnica';
import { CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StyleClassModule, CalendarModule, ConfirmDialogModule, RatingModule, ToastModule, ToolbarModule, DialogModule, ReactiveFormsModule, FormsModule, InputNumberModule,  TagModule, DropdownModule, RadioButtonModule,  InputTextModule, TableModule, MenuModule, ButtonModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  items!: MenuItem[];
  date: Date[] | undefined;

    productDialog: boolean = false;

    products!: Product[];

    product!: Product;
    example: ItemUnica[] = [];

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    constructor(private productService: ItemService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit() {
      this.example = [
        { ubs: 'UBS 1', notificados: 23, casosPositivos: 12, casosImportados: 23, emInvestigacao: 2, recusados: 27, internados: 5, obitos: 6, obitosInvestigacao: 7 },
        { ubs: 'UBS 2', notificados: 18, casosPositivos: 8, casosImportados: 18, emInvestigacao: 1, recusados: 22, internados: 3, obitos: 4, obitosInvestigacao: 5 },
      ];
        this.productService.getProducts().then((data) => (this.products = data));

        this.statuses = [
            { label: 'ALTO', value: 'instock' },
            { label: 'MEDIO', value: 'lowstock' },
            { label: 'BAIXO', value: 'outofstock' }
        ];
        this.items = [
          {label: 'Novo Usuário', icon: 'pi pi-fw pi-plus'},
          {label: 'Remover', icon: 'pi pi-fw pi-minus'}
      ];
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Quer realmente remover esta linha da tabela?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
                this.selectedProducts = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Dados da zona deletada', life: 3000 });
            }
        });
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Quer realmente remover os dados da zona ' + product.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter((val) => val.id !== product.id);
                this.product = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'zona deletada', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Dado atualizado', life: 3000 });
            } else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.push(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Dado criado', life: 3000 });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }


}

