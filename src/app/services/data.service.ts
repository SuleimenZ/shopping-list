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
        //For some unknown reason reading not working
        //this.readFromDevice();
    }

    getItems = () => this.items?.toArray().sort((a, b) => a.name.localeCompare(b.name));

    getItem = (name: string) => this.getItems().find((i) => i.name == name);

    getShoppingLists = () =>
        this.shoppingLists?.toArray().sort((a, b) => a.name.localeCompare(b.name));

    getShoppingList = (name: string) => {
        let list = this.shoppingLists.firstOrDefault((l) => l.name == name);
        list.list.sort((a, b) => a.item.name.localeCompare(b.item.name));
        return list;
    };

    addItem = async (item: Item) => {
        let exists = this.items.firstOrDefault((l) => l.name == item.name);
        if (exists || !item.name || item.price <= 0) {
            return false;
        }
        this.items.push(item);
        await this.writeToDevice();
        return true;
    };

    addItemToList = async (from: ShoppingList, item: ShoppingItem) => {
        let exists = this.shoppingLists
            .firstOrDefault((list) => list.name == from.name)
            .list.find((l) => l.item.name == item.item.name);
        if (exists || item.quantity <= 0 || !item.item.name || item.item.price <= 0) {
            return false;
        }
        let temp = this.shoppingLists.firstOrDefault((list) => list.name == from.name).list;
        let newList = new Array<ShoppingItem>(item, ...temp);
        this.shoppingLists.firstOrDefault((list) => list.name == from.name).list = newList;
        await this.writeToDevice();
        return true;
    };

    removeItemFromList = async (from: ShoppingList, item: ShoppingItem) => {
        let temp = this.shoppingLists.firstOrDefault((list) => list.name == from.name).list;
        if (item) {
            this.shoppingLists.firstOrDefault((list) => list.name == from.name).list = temp.filter(
                (a) => a != item
            );
            await this.writeToDevice();
            return true;
        }
        return false;
    };

    addShoppingList = async (list: ShoppingList) => {
        if (this.shoppingLists.contains(list)) {
            return false;
        }
        this.shoppingLists.push(list);
        await this.writeToDevice();
        return true;
    };

    saveShoppingList = async (list: ShoppingList) => {
        let old = this.shoppingLists.firstOrDefault((shoplist) => shoplist.name == list.name);
        if (!(await this.addShoppingList(old))) {
            this.shoppingLists.remove(old);
            this.shoppingLists.push(list);
        }
        await this.writeToDevice();
        return true;
    };

    readFromDevice = async () => {
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
    }

    writeToDevice = async () => {
        try {
            await Filesystem.mkdir({
                path: APP_FOLDER,
                directory: DIRECTORY
            });
        } catch (e) {
        // Directory already exitst
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
