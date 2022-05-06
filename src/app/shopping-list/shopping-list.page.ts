import { DataService, Item, ShoppingItem } from './../services/data.service';
import { Component, Input, OnInit } from '@angular/core';
import { ShoppingList } from '../services/data.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.page.html',
    styleUrls: ['./shopping-list.page.scss'],
})
export class ShoppingListPage implements OnInit {
    private name;
    private shopList: ShoppingList;
    private recoveryList;
    private edit: boolean;

    private selectedItem;
    private selectedQuantity;

    constructor(
        private route: Router,
        private data: DataService,
        private alertController: AlertController
    ) {}

    goBack() {
        this.route.navigate(['home']);
    }

    getTotalQuantity() {
        let qty = 0;
        this.shopList.list.forEach((a) => {
            qty += a.quantity;
        });
        return qty;
    }

    getTotalPrice() {
        let price = 0;
        this.shopList.list.forEach((a) => (price += a.item.price * a.quantity));
        return price;
    }

    getItemsDifference() {
        let asd = this.data
            .getItems()
            .filter((l) => !this.shopList.list.map((i) => i.item.name).includes(l.name));
        return asd;
    }

    async removeItem(item: ShoppingItem) {
        await this.data.removeItemFromList(this.shopList, item);
        this.shopList = this.data.getShoppingList(this.name);
    }

    onEditButtonClick() {
        this.recoveryList = { ...this.shopList };
        this.edit = !this.edit;
    }

    onSaveButtonClick() {
        this.recoveryList = { ...this.shopList };
        this.edit = !this.edit;
    }

    async onCancelButtonClick() {
        this.shopList = { ...this.recoveryList };
        this.edit = !this.edit;
        await this.data.saveShoppingList(this.recoveryList);
    }

    async onAddItemButtonClick() {
        if (!this.selectedItem) {
            return;
        }
        let item = {
            item: {
                name: this.selectedItem,
                price: await this.data.getItem(this.selectedItem).price,
            },
            quantity: Math.floor(this.selectedQuantity) || 1,
        } as ShoppingItem;
        await this.data.addItem(item.item);
        await this.data.addItemToList(this.shopList, item);
        this.shopList = this.data.getShoppingList(this.name);
        this.selectedItem = undefined;
        this.selectedQuantity = undefined;
    }

    ngOnInit(): void {
        const state = this.route.getCurrentNavigation()?.extras?.state;
        if (state) {
            this.name = state.k;
        }
        this.shopList = this.data.getShoppingList(this.name);
        this.recoveryList = { ...this.shopList };
    }
}
