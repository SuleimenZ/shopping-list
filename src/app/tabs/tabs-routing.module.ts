import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../home/home.module').then((m) => m.HomePageModule),
            },
            {
                path: 'items',
                loadChildren: () => import('../items/items.module').then((m) => m.ItemsPageModule),
            },
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
