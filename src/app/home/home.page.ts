import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { DataService, ShoppingList } from '../services/data.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage {
    constructor(
        private data: DataService,
        private nav: NavController,
        private alertController: AlertController
    ) {}

    getTotalPrice(list: ShoppingList) {
        let price = 0;
        list.list.forEach((i) => (price += i?.quantity * i?.item.price));
        return price;
    }

    goToListPage(list: ShoppingList) {
        this.nav.navigateForward('/shopping-list', { state: { k: list.name } });
    }

    async OnAddButtonClick() {
        const alert = await this.alertController.create({
            header: 'Create a shopping list',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Enter name...',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    cssClass: 'danger',
                    handler: () => {},
                },
                {
                    text: 'Ok',
                    handler: (input) => {
                        let list: ShoppingList = {
                            name: input['name'] || 'no name',
                            list: [],
                        };
                        this.data.addShoppingList(list);
                    },
                },
            ],
        });

        await alert.present();
    }

    ngOnInit() {}
}
