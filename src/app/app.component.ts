import { Component, OnInit } from '@angular/core';

declare let paypal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  finalAmount = 1;
  serverURL = 'http://localhost:1199';

  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'AX8KKyMUu_C3nhUSG8LgWKvO-pSh6J4jpkFZu7A-YPdoMpOvwhBjce9Rb04Si1uZiC3bgJ5sLFZuEBBe',
      production: '<your-production-key here>'
    },
    commit: true, // Visibility of total amount in paypal-box
    payment: (data, actions) => {
      return actions.request.post(this.serverURL + '/my-api/create-payment/')
        .then(function (res) {
          return res.id;
        });
    },
    onAuthorize: (data, actions) => {
      return actions.request.post(this.serverURL + '/my-api/execute-payment/', {
        paymentID: data.paymentID,
        payerID: data.payerID,
        // my important variable (below)
        customerID: '012345',
        productID: 'd44ff20aad'
      }).then(res => {
        // payment is completed succesfully
        actions.payment.execute().then(() =>
          alert('Payment is finished successfully!'));
      });
    },
    onCancel: (data, actions) => {
      // payment is canceled / break
      actions.close().then(() =>
          alert('Payment is cancelled!'));
    }
  };


  ngOnInit() {
    this.addPaypalScript().then(() => {
      paypal.Button.render(this.paypalConfig, '#paypal-checkout-btn');
    });
  }

  addPaypalScript() {
    return new Promise((resolve, reject) => {
      const scripttagElement = document.createElement('script');
      scripttagElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement);
    });
  }
}
