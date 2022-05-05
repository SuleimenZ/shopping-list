import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataService, Item } from '../services/data.service';

@Component({
    selector: 'app-items',
    templateUrl: './items.page.html',
    styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
    constructor(private data: DataService, private alertController: AlertController) {}

    async OnAddButtonClick() {
        const alert = await this.alertController.create({
            header: 'Create an item',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Enter name...',
                },
                {
                    name: 'price',
                    type: 'number',
                    min: 0,
                    max: 1000,
                    placeholder: 'Enter price...',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: () => {},
                },
                {
                    text: 'Ok',
                    handler: (input) => {
                        let item: Item = {
                            name: input['name'],
                            price: input['price'],
                        };
                        this.data.addItem(item);
                    },
                },
            ],
        });

        await alert.present();
    }

    ngOnInit() {
    }
}
