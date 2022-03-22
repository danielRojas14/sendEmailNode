const express = require("express");
var path = require("path");
const prompts = require("prompts");
const nodemailer = require("nodemailer");
const fs = require("fs");



//este script funciona interactuando por medio de la consola


//Inicializar el Servidor
const app = express();

//Seteando el Puerto
app.set("port", process.env.PORT || 4000);

app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});

//Arrays de Mensajes
const mensajes = [
  {
    type: "text",
    name: "nombreArchivo",
    message: "Ingrese el nombre del Archivo. Ejemplo: nuevoArchivo.txt",
  },
  {
    type: "text",
    name: "contenidoArchivo",
    message: "Ingrese el contenido del archivo(solo texto)",
  },
  {
    type: "text",
    name: "enviarCorreo",
    message: "Quiere que se envie en el correo el archivo creado? Y/N",
  },
  {
    type: "text",
    name: "crearArchivo",
    message: "Quiere que se cree un nuevo archivo? Y/N",
  },
];


//funcion para la configuracion del Email
const configSendEmail = (paramFileName, paramDesicion) => {
  console.log(paramDesicion);
 
  async function main() {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" danielrojas131415@gmail.com', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?",// plain text body
    
      attachments: [
        {
          filename: `${paramDesicion == 'n'||paramDesicion == 'N' ? '': paramFileName}`,
          path: `${paramDesicion == 'n'||paramDesicion == 'N' ? '': path.join(__dirname, `./${paramFileName}`)}`,
          contentType: 'text/plain',
        },
      ],
    
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  main().catch(console.error);
};



//Verificacion de archivo existente y creacion del mismo

if (fs.existsSync("./nuevoArchivo.txt")) {
  console.log("el archivo existe");
    (async () => {
  const enviarArchivo = await prompts(mensajes[2])
 
  if (enviarArchivo.enviarCorreo== 'Y'|| enviarArchivo.enviarCorreo== 'y') {
    configSendEmail('nuevoArchivo.txt', enviarArchivo.enviarCorreo);
    
  }else if(enviarArchivo.enviarCorreo== 'n'|| enviarArchivo.enviarCorreo== 'N'){
    configSendEmail('nuevoArchivo.txt', enviarArchivo.enviarCorreo);
  }
})();
} else {
  console.log("el archivo no existe");
        try {
          (async () => {
            const crearTxt = await prompts(mensajes[3]);

            if (crearTxt.crearArchivo == 'Y' ||crearTxt.crearArchivo == 'y' ) {

              const fileName = await prompts(mensajes[0])
             
              const fileConstent = await prompts(mensajes[1])
              fs.writeFileSync(fileName.nombreArchivo, fileConstent.contenidoArchivo)

              const enviarArchivo = await prompts(mensajes[2])
              if (enviarArchivo.enviarCorreo== 'Y'|| enviarArchivo.enviarCorreo== 'y') {
                configSendEmail(fileName.nombreArchivo);
                
              }
            }else if(crearTxt.crearArchivo == 'N' ||crearTxt.crearArchivo == 'n'){
              console.log('lo lamento ya no podemos seguir');
            }
         })();
        } catch (e) {
          console.log("Cannot write file ", e);
        }
        
      }

