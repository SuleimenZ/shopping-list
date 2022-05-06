import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Injectable } from '@angular/core';
import { List } from 'list-ts';

export interface Item {
    name: string;
    price: number;
}

export interface ShoppingItem {
    item: Item;
    quantity: number;
}

export interface ShoppingList {
    name: string;
    list: ShoppingItem[];
}

const DIRECTORY = Directory.External;
const APP_FOLDER = "Shoppinglist/";
const APP_ITEMS =  APP_FOLDER + "items.txt";
const APP_LISTS =  APP_FOLDER + "shoplists.txt";

@Injectable({
    providedIn: 'root',
})
export class DataService {
    items: List<Item> = new List<Item>([
        {
            name: 'bread',
            price: 2,
        },
        {
            name: 'water',
            price: 2,
        },
        {
            name: 'milk',
            price: 3,
        },
        {
            name: 'apple 1 kg',
            price: 2,
        },
        {
            name: 'cola',
            price: 5,
        },
        {
            name: 'pepsi',
            price: 4,
        },
        {
            name: 'chocolate',
            price: 5,
        },
    ]);

    shoppingLists: List<ShoppingList> = new List<ShoppingList>([
        {
            name: 'grocery',
            list: [
                {
                    item: this.items.get(0),
                    quantity: 1,
                },
                {
                    item: this.items.get(1),
                    quantity: 2,
                },
                {
                    item: this.items.get(2),
                    quantity: 2,
                },
                {
                    item: this.items.get(3),
                    quantity: 1,
                },
            ],
        },
        {
            name: 'snacks',
            list: [
                {
                    item: this.items.get(4),
                    quantity: 1,
                },
                {
                    item: this.items.get(5),
                    quantity: 1,
                },
                {
                    item: this.items.get(6),
                    quantity: 3,
                },
            ],
        },
    ]);
    constructor() {
        this.readFromDevice();
    }

    getItems = () => {
        if(this.items instanceof Array){
            return this.items?.sort((a, b) => a.name.localeCompare(b.name));
        }
        return this.items?.toArray().sort((a, b) => a.name.localeCompare(b.name));
    }

    getItem = (name: string) => this.getItems().find((i) => i.name == name);

    getShoppingLists = () => {
        if (this.shoppingLists instanceof Array){
            return this.shoppingLists?.sort((a, b) => a.name.localeCompare(b.name)); 
        }
        return this.shoppingLists?.toArray().sort((a, b) => a.name.localeCompare(b.name)); 
    }

    getShoppingList = (name: string) => {
        let list = this.getShoppingLists().find(l => l.name == name);
        list.list.sort((a, b) => a.item.name.localeCompare(b.item.name));
        return list;
    };

    addItem = async (item: Item) => {
        let exists = this.getItems().find((l) => l.name == item.name);
        if (exists || !item.name || item.price <= 0) {
            return false;
        }
        this.items.push(item);
        await this.writeToDevice();
        return true;
    };

    removeItem = async (item: Item) => {
        let exists = this.getItems().find((l) => l.name == item.name);
        if (exists) {
            this.items = new List<Item>(this.getItems().filter(i => i.name != item.name));
            await this.writeToDevice();
            return true;
        }
        return false;
    };

    addItemToList = async (from: ShoppingList, item: ShoppingItem) => {
        let exists = this.getShoppingLists()
            .find((list) => list.name == from.name)
            .list.find((l) => l.item.name == item.item.name);
        if (exists || item.quantity <= 0 || !item.item.name || item.item.price <= 0) {
            return false;
        }
        let temp = this.getShoppingLists().find((list) => list.name == from.name).list;
        let newList = new Array<ShoppingItem>(item, ...temp);
        this.getShoppingLists().find((list) => list.name == from.name).list = newList;
        await this.writeToDevice();
        return true;
    };

    removeItemFromList = async (from: ShoppingList, item: ShoppingItem) => {
        if (from) {
            this.getShoppingLists().find((list) => list.name == from.name).list = from.list.filter(
                (a) => a != item
            );
            await this.writeToDevice();
            return true;
        }
        return false;
    };

    addShoppingList = async (list: ShoppingList) => {
        if (this.getShoppingLists().includes(list)) {
            return false;
        }
        this.shoppingLists.push(list);
        await this.writeToDevice();
        return true;
    };

    removeShoppingList = async (list: ShoppingList) => {
        let exists = this.getShoppingLists().find((l) => l.name == list.name);
        if (exists) {
            this.shoppingLists = new List<ShoppingList>(this.getShoppingLists().filter(i => i.name != list.name));
            await this.writeToDevice();
            return true;
        }
        return false;
    };

    saveShoppingList = async (list: ShoppingList) => {
        if (this.getShoppingLists().includes(list)) {
            let temp = new Array(list, ...this.getShoppingLists().filter(l => l.name != list.name))
            this.shoppingLists = new List<ShoppingList>(temp);
        }
        await this.writeToDevice();
        return true;
    };

    readFromDevice = async () => {
        try{
            const deviceItems = await Filesystem.readFile({
                path: APP_ITEMS,
                directory: DIRECTORY,
                encoding: Encoding.UTF8,
            });
            this.items = JSON.parse(deviceItems.data);

            const deviceLists = await Filesystem.readFile({
                path: APP_LISTS,
                directory: DIRECTORY,
                encoding: Encoding.UTF8,
            });
            this.shoppingLists = JSON.parse(deviceLists.data);

            //Making sure every item form shoplist is added.
            for(let shopList of this.getShoppingLists()){
                for(let shopItem of shopList.list){
                    this.addItem(shopItem.item);
                }
            }
        }catch (e){
            //Directory does not exists
            this.writeToDevice();
        }
    }

    writeToDevice = async () => {
        try {
            await Filesystem.mkdir({
                path: APP_FOLDER,
                directory: DIRECTORY
            });
        }catch (e) {
            //Directory already exitst
        }

        await Filesystem.writeFile({
            path: APP_ITEMS,
            data: JSON.stringify(this.getItems()),
            directory: DIRECTORY,
            encoding: Encoding.UTF8,
        });

        await Filesystem.writeFile({
            path: APP_LISTS,
            data: JSON.stringify(this.getShoppingLists()),
            directory: DIRECTORY,
            encoding: Encoding.UTF8,
        });
    }
}
