import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { EmailService } from './email.service';



@Injectable({
  providedIn: 'root'
})

// Este servicio se utiliza para controlar un componente denominado "dialogo-general".
// Mediante los métodos de este servicio controlaremos que se abra en pantalla un dialogo
// que muestre información, errores, progreso o confirmación de alguna información.
// Además también se incorpora un método para cerrar el dialogo en cualquier momento
export class ComunicacionDeAlertasService {

  isLoading = false; // Permite que esta clase sepa si se está mostrando el diálogo de carga o no


  // Necesito un componente de tipo MatDialog (de Angular) para mostrar en pantalla un diálogo
  constructor(public alertController: AlertController,
    private loadingController: LoadingController,
    private emailService: EmailService,
    private navController: NavController){}

  /**
   * Método que permite mostrar, en Ionic, un cuadro de diálogo de alerta.
   * @param infoText 
   */
  async mostrarAlerta(infoText: string) {
    const alert = await this.alertController.create({
//      cssClass: 'my-custom-class',
//      header: 'Alert',
//      subHeader: 'Subtitle',
      message: infoText,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

   /**
   * Método que permite mostrar, en Ionic, un cuadro de diálogo de alerta.
   * @param infoText 
   */
    async mostrarAlertaAccionOk(infoText: string, funcion: Function) {
      const alert = await this.alertController.create({
  //      cssClass: 'my-custom-class',
  //      header: 'Alert',
  //      subHeader: 'Subtitle',
        message: infoText,
        buttons: [{ text: 'Aceptar',
        
        handler: () => { // Cuando se pulsa este botón, se llama a la función de "cancel"
          funcion();
        }
      }]
      });
  
      await alert.present();
    }


  /**
   * Método para mostrar un pequeño diálogo de carga, una animación
   */
  async mostrarCargando() {
    this.isLoading = true; // El diálogo se muestra si la variable está a true. Esta
    // variable domina el diálogo de carga.
    return await this.loadingController.create({
      // duration: 5000,  // Si queremos una duración fija del diálogo, descomentas esta línea
    }).then(a => { // Una vez que el diálogo se crea, se muestra, con el método "present"
      a.present().then(() => {
        if (!this.isLoading) { // Cuando la variable "isLoading" se anule, cerramos el diálogo
          a.dismiss().then(() => {}); // Cerramos el diálogo
        }
      });
    });
  }

  /**
   * Para cerrar un diálogo de carga simplemente ponemos la variable a false
   */
  async ocultarCargando() {
    this.isLoading = false;
    // Podemos intervenir desde aquí en el momento del cierre del diálogo, método "dismiss"
    return await this.loadingController.dismiss().then(() => {});
  }


  /**
   * Muestra una alerta de confirmación, con dos botones. 
   * @param confirmText 
   * @param okFunction  Función a realizar si se pulsa el botón "ok"
   * @param cancelFunction  Función a realizar si se pulsa el botón "Cancel"
   */
  async mostrarConfirmacion(confirmText: string, okFunction: Function, cancelFunction: Function) {
    const alert = await this.alertController.create({
//      cssClass: 'my-custom-class',
//      header: 'Confirm!',
      message: confirmText,
      buttons: [ // array de botones
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { // Cuando se pulsa este botón, se llama a la función de "cancel"
            cancelFunction();
          }
        }, {
          text: 'Sí',
          handler: () => { // Al pulsar sobre este botón se llama a la función de "ok"
            okFunction();
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarMensajeConInput(mensaje: string){ //okFunction: Function, cancelFunction: Function
    const alert = await this.alertController.create({
      message: mensaje,
      //ponemos un input para recoger info de correo y enviar un correo de confirmacion
      inputs: [
        {
          type: "email",
          placeholder: "Ej. ejemplo@gmail.com",
          name: "emailUsuario"
        }
      ],
      //botones enviar / canclar
      buttons: [ // array de botones
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          
        }, {
          text: 'Sí',
          handler: (alertData) => { // Al pulsar sobre este botón se llama al email service
            console.log(alertData.emailUsuario);
            //le pasamos el el valor del input para enviar mensaje
            this.emailService.sendEmailPassForgotten(alertData.emailUsuario).then(data => {
              if(data.result == "success"){
                
                console.log('correo enviado correctamente')
                this.navController.navigateForward('');
                
                //this.mostrarAlerta('Correo enviado con éxito, comprueba tu bandeja de entrada');
                
              } else {
                console.log('error al enviar el correo')
                this.mostrarAlerta('Correo no registrado, introduce el correo utilizado en el registro');
              }
            });
            
           
          }
        }
      ]
    })
    await alert.present();
  }

}
