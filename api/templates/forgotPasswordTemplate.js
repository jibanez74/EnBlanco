module.exports = (resetLink, user) => {
  return ` 
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>
        En Blanco - Recuperar Contraseña
      </title>
      <style>
        .container {
          max-width: 1100px;
          margin: auto;
          overflow: hidden;
          padding: 0 2rem;
          margin-top: 6rem;
          margin-bottom: 3rem;
        }
  
        p,
        h2 {
          color: var(--dark-color);
        }
      </style>
    </head>
    <body>
        <div class="container">
          <header>
            <h2>Recuperar Contraseña</h2>
            <p>Hello: ${user.name}</p>
          </header>
          <section>
          <p>
          Ha recibido este mensaje porque usted o alguien ha solicitado una nueva contraseña para su cuenta de En Blanco.  Para continuar con el proceso, por favor haga click en el enlace que aparece a continuación.  Si usted no solicitó este email, ignore este mensaje.  El enlace solo será valido por diez minutos.
        </p>
        <a href="${resetLink}" target="_blank"
          >Click here to reset your password</a>
          </section>
        </div>
    </body>
  </html>
    `;
};
