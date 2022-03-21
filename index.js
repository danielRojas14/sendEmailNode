const express = require("express");
var path = require("path");
const morgan = require("morgan");
const prompts = require("prompts");
const confirm = require("prompt-confirm");
const nodemailer = require("nodemailer");
const fs = require("fs");
require("dotenv").config();

//Inicializar el Servidor
const app = express();

app.use(morgan("dev"));

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
    message: "Ingrese el nombre del Archivo",
  },
  {
    type: "text",
    name: "contenidoArchivo",
    message: "Ingrese el contenido del archivo(solo texto)",
  },
];

const existe = false;

var pathh = path.join("enviarCorreoNode", "Refsnes", "..", "neuvoArchivo.txt");

if (fs.existsSync("./nuevoArchivo.txt")) {
  console.log("el archivo existe");
  const existe = true;
} else {
  console.log("el archivo no existe");

  const mensaje1 = new confirm("Desea que se cree un nuevo archivo?").ask(
    async function (answer) {
      if (answer) {
        try {
          (async () => {
            const response = await prompts(mensajes);

            fs.writeFileSync(response.nombreArchivo, response.contenidoArchivo);

            const mensaje2 = new confirm(
              "Desea que el archivo que creo se envie en el correo?"
            ).ask(async function (answer) {
              if (!answer) {
                sendEmail();
              } else {
                console.log("hasta aqui llegamos");
              }
            });
          })();
        } catch (e) {
          console.log("Cannot write file ", e);
        }
        return;
      }
    }
  );
}

const sendEmail = (paramDATA) => {
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
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
      text: "Hello world?", // plain text body
      attachment: [
        {
          filename: "nuevoArchivo.txt",
          path: pathh,
          contentType: "text/plain",
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
