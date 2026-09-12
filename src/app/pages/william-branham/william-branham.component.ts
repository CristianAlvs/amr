import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../layout/page-header/page-header.component';

@Component({
    selector: 'app-william-branham',
    imports: [PageHeaderComponent, RouterLink],
    templateUrl: './william-branham.component.html',
    styleUrl: './william-branham.component.scss'
})
export class WilliamBranhamComponent {}
