import { DataService } from './services/data.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    constructor(private data: DataService) {}
}
