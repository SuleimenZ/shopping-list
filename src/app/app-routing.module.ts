import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
    },
    {
        path: 'shopping-list',
        loadChildren: () =>
            import('./shopping-list/shopping-list.module').then((m) => m.ShoppingListPageModule),
    },
    {
        path: 'items',
        loadChildren: () => import('./items/items.module').then((m) => m.ItemsPageModule),
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
