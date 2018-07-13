import { Component, OnInit } from '@angular/core';

declare let paypal: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  finalAmount = 1;

  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'access_token$sandbox$wjgyhcypxztkn8z5$f60108844db1ebcad4eeed997b77d3bc',
      production: '<your-production-key here>'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            { amount: { total: this.finalAmount, currency: 'EUR' } }
          ]
        }
      });
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then((payment) => {
        // Do something when payment is successful.
        alert('Payment is finished succesfully');
      });
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
