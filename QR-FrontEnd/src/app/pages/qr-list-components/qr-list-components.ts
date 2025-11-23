import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrService } from '../../services/qr-service';
import  $ from 'jquery';
import 'datatables.net';
import { QRCodeComponent } from "angularx-qrcode";
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-qr-list-components',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './qr-list-components.html',
  styleUrl: './qr-list-components.css',
})

export class QrListComponents implements OnInit{
  qrList: any[] = [];
  selectedId: number | null = null;
  selectedQRCode: string = '';
  message: string = '';
  modalMode: 'view' | 'delete' | 'message' | null = null;

  constructor(
    private qrService: QrService,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.loadQrModels();
  }

  loadQrModels() {
    this.qrService.getAll().subscribe({
      next: (data) => {
        this.qrList = data;

      setTimeout(() => {
        // Destroy previous DataTable if it exists
        if ($.fn.DataTable.isDataTable('#qrTable')) {
          $('#qrTable').DataTable().destroy();
        }

        // Initialize DataTable
        $('#qrTable').DataTable({
          paging: true,
          pageLength: 10,
          searching: false,
          ordering: false,
          data: data,
          columns: [
            { title: 'id', data: 'id' },
            { title: 'รหัสสินค้า (30 หลัก)', data: 'qrCode',
              render: function (data, type, row) {
                if (!data) return "";
                return data.match(/.{1,5}/g).join('-');
              }
            },
            { title: 'View', data: null,
              render: (data, type, row) => `
                <button class="btn btn-success view-btn btn-md" data-id="${row.id}">VIEW</button>
              `
            },
            { title: 'Delete', data: null,
              render: (data, type, row) => `
                <button class="btn btn-danger delete-btn btn-md" data-id="${row.id}">DELETE</button>
              `
            }
          ],
          columnDefs: [
            {className: "dt-head-center align-middle", target: "_all"},
            {className: "text-center align-middle", width: "5%", targets: [0, 2, 3]},
            {className: "text-left align-middle", width: "85%", targets: [1]},
          ]
        });

        // Bind viewQR Method
        $('#qrTable').off('click', '.view-btn').on('click', '.view-btn', (e) => {
          const id = Number($(e.currentTarget).data('id'));
          this.viewQR(id);
        });

        // Bind deleteQR Method
        $('#qrTable').off('click', '.delete-btn').on('click', '.delete-btn', (e) => {
          const id = Number($(e.currentTarget).data('id'));
          this.confirmDeleteQR(id);
        });


      }, 0);
    },
    error: err => {
      console.error('Failed to load QRModel:', err);

      this.showMsg(`Failed to load QRModel: ${err.error.message}`);
    }
  });
  }

  viewQR(id: number) {
    const qr = this.qrList.find(x => x.id === id);
    if (!qr) return;

    this.selectedQRCode = qr.qrCode;
    this.modalMode = 'view';

    this.cdr.detectChanges();
}

  addQR(qrcode: HTMLInputElement) {
    let qr: string = qrcode.value.trim().toUpperCase().replace(/-/g, '');

    const isValid = /^[A-Z0-9]{30}$/.test(qr);

    if (!isValid) {
      this.showMsg('รหัสสินค้าต้องเป็นภาษาอังกฤษตัวใหญ่และตัวเลข 30 ตัวเท่านั้น');
      qrcode.value = '';

      return;
    }

    this.qrService.create(qr).subscribe({
      next: () => {
        console.log('Added QR:', qr);
        qrcode.value = '';

        this.loadQrModels();
      },
      error: err => {
        console.error('Failed to add QR:', err);
        this.showMsg(`${err.error.message}`);

        qrcode.value = '';
      }
    })

  }

  confirmDeleteQR(id: number) {
    const qr = this.qrList.find(x => x.id === id);
    if (!qr) return;

    this.selectedId = id;
    this.selectedQRCode = qr.qrCode;
    this.modalMode = 'delete';

    this.cdr.detectChanges();
  }

  deleteQR() {
    if (this.selectedId === null) return;

    const id = this.selectedId;
    const qr = this.qrList.find(x => x.id === id);

    if (!qr) return;

    this.qrService.delete(id).subscribe({
    next: () => {
      console.log('Deleted QR:', qr);

      this.closeModal();
      this.loadQrModels();
    },
    error: err => {
      console.error('Failed to delete QR:', err);
      this.showMsg(`Failed to delete QR: ${err.error.message}`);
    }
  });
  }

  showMsg(msg: string) {
    console.log("showing message: " + msg);
    this.message = msg
    this.modalMode = 'message';

    this.cdr.detectChanges();
  }

  closeModal() {
      this.modalMode = null;
      this.selectedId = null;
      this.selectedQRCode = '';
      this.message = '';

      this.cdr.detectChanges();
    }

  formatQrInput(input: HTMLInputElement) {
    let value = input.value;

    value = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    const groups = value.match(/.{1,5}/g);

    input.value = groups ? groups.join("-") : "";
  }

}
