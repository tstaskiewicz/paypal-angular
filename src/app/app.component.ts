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
      sandbox:    'AX8KKyMUu_C3nhUSG8LgWKvO-pSh6J4jpkFZu7A-YPdoMpOvwhBjce9Rb04Si1uZiC3bgJ5sLFZuEBBe',
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
        // payment is successful. //toDO: co jest w data? actions?
        console.log(data, actions, payment);
        // toDO: co, gdy nie powiodło się?
        // toDO: jak przekazujemy informacje o tym, KTO płaci?
        alert('Payment is finished succesfully');
      });
    },
    onCancel: (data, actions) => {
      console.log(data, actions);
      alert('Payment is cancelled');
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
