import nodemailer, { TransportOptions } from 'nodemailer';

interface EmailData {
  email: string;
}

const emailForgotPassword = (data: EmailData, token: string) => {

  try {
    return new Promise((resolve, reject) => {
      const { email } = data;
      console.log( email)
      const mailPort = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : undefined;
  
      const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: mailPort,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        }
      } as TransportOptions);
  
      const mailOptions = {
        from: '"GasTrack - " <gastrack@gastrack.com>',
        to: email,
        subject: 'Reestablecer el Password',
        text: 'Restablecer tu password',
        html: `
          <div>
            <h2>hola, has solicitado reestablecer tu password</h2>
            <br />
            <p>
              En el siguiente enlace puedes volver a generar un password:
            </p>
            <br />
            <a href="${process.env.FRONT_URL}auth/changePassword/${token}"> Comprobar Cuenta</a>
            <br />
            <br />
            <p>Si tú no solicitaste este cambio, puedes ignorar el mensaje</p>
          </div>
        `
      }
  
      transport.sendMail(mailOptions, (error, info)=> {
        if (error) {
            console.log("Error al enviar el correo.", error);
            reject();
        } else {
            console.log("Correo enviado con éxito", info)
            resolve('correo enviado con éxito')
        }
      });
    })
  } catch (error) {
    console.log('error en catch', error)
  }
}

export { emailForgotPassword };
