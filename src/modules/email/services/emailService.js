import { Resend } from 'resend';
import { API_KEY_RESEND } from '../../../config/env.js';

const resend = new Resend(API_KEY_RESEND);

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `http://localhost:3000/reset-password/${token}`;
  const message = `
<div style="text-align: center; margin-bottom: 20px">
        <h1 style="color: #b565e2">Tidy</h1>
      </div>
      <h3 style="color: #b565e2">Restablecimiento de Contraseña</h3>
      <p>Hola, Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo
        para restablecerla:</p>
      <div style="text-align: center; margin: 20px 0">
        <a
          href="${resetUrl}"
          style="
            background-color: #7e3fbf;
            color: #fff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          "
          >Restablecer Contraseña</a
        >
      </div>
      <p>
        Si no solicitaste este cambio, simplemente ignora este correo
        electrónico.
      </p>
      <p>Gracias,</p>
      <p>El equipo de Tidy</p>
    </div>
`;

  try {
    console.log(`Enviando correo a: ${email}`);
    const { data, error } = await resend.emails.send({
      from: 'Tidy <no-reply@tidy-app.me',
      to: email,
      subject: 'Restablecimiento de contraseña',
      html: message,
    });

    if (error) {
      console.error(`Error al enviar el correo para restablecer la contraseña a ${email}: ${error.message}`);
      throw new Error('Error al enviar el correo de establecimiento de contraseña');
    }

    console.log(`Correo enviado a: ${email}`, data);
  } catch (error) {
    console.error(`Error al enviar el correo para restablecer la contraseña: ${error.message}`);
    throw new Error('Error al enviar el correo de restablecimiento de contraseña');
  }
};

export const sendEmailVerification = async (email, token) => {
  const verifyUrl = `http://localhost:3000/verify-email/${token}`;
  const message = `
<div style="text-align: center; margin-bottom: 20px">
        <h1 style="color: #b565e2">Tidy</h1>
      </div>
      <h3 style="color: #b565e2">Verificación de Email</h3>
      <p>Hola, Gracias por registrarte en Tidy. Haz clic en el botón de abajo
        para verificar tu email:</p>
      <div style="text-align: center; margin: 20px 0">
        <a
          href="${verifyUrl}"
          style="
            background-color: #7e3fbf;
            color: #fff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
          "
          >Verificar Email</a
        >
      </div>
      <p>
        Si no solicitaste esta verificación, simplemente ignora este correo
        electrónico.
      </p>
      <p>Gracias,</p>
      <p>El equipo de Tidy</p>
    </div>
`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Tidy <no-reply@tidy-app.me>',
      to: email,
      subject: 'Verificación de Email',
      html: message,
    });

    if (error) {
      console.error(`Error al enviar la verificación del correo a ${email}: ${error.message}`);
      throw new Error('Error al enviar el correo de verificación');
    }

    console.log(`Correo enviado a: ${email}`, data);
  } catch (error) {
    console.error(`Error al enviar el correo de verificación de email: ${error}`);
    throw new Error('No se pudo enviar el correo de verificación de email');
  }
};
