import { Component, OnInit } from '@angular/core';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    requests = [];

    ngOnInit() {
        // TODO: Replace with actual service call
        // this.requestService.getAll().subscribe(x => this.requests = x);
        this.requests = [
            { id: 1, title: 'Sample Request 1' },
            { id: 2, title: 'Sample Request 2' }
        ];
    }

    editRequest(id: number) {
        // TODO: Implement navigation to edit page
        alert('Edit request ' + id);
    }

    deleteRequest(id: number) {
        // TODO: Replace with actual service call
        this.requests = this.requests.filter(x => x.id !== id);
    }
}