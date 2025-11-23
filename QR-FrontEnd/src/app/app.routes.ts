import { Routes } from '@angular/router';
import { QrListComponents } from './pages/qr-list-components/qr-list-components';

export const routes: Routes = [
    { path: 'qr-list', component: QrListComponents },
    { path: '', redirectTo: 'qr-list', pathMatch: 'full' },
    { path: '**', redirectTo: 'qr-list' }
];
