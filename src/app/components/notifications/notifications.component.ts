// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit } from '@angular/core';

declare const $: any;

@Component({
    selector: 'app-notifications-cmp',
    templateUrl: 'notifications.component.html'
})
export class NotificationsComponent implements OnInit {
    showNotification(from: any, align: any) {
        const type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];

        const color = Math.floor((Math.random() * 6) + 1);

        $.notify({
            icon: 'notifications',
            message: 'Welcome to <b>Material Dashboard</b> - a beautiful dashboard for every web developer.'
        }, {
            type: type[color],
            timer: 3000,
            placement: {
                from: from,
                align: align
            }
        });
    }
    ngOnInit(){
        var mainPanel = document.getElementsByClassName('main-panel')[0];
        $('.modal').on('shown.bs.modal', function () {
          mainPanel.classList.add('no-scroll');
        })
        $('.modal').on('hidden.bs.modal', function () {
          mainPanel.classList.remove('no-scroll');
        })
    }
}
