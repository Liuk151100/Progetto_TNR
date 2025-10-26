import mailer from "../helpers/mailer.js";
import User from "../models/User.js";
import { sendEmail } from "../helpers/sendMail.js";

export async function contactUs(request, response) {
  try {
    const { email, message } = request.body;
    console.log(email)

    //Il mailer funz in locale, quando passo in produzione deve usare l'helper sendMail.js
    // const info = mailer.sendMail({
    //   from: "amministrazione@teamnewracing.com", // mittente autenticato
    //   to: "amministrazione@teamnewracing.com",
    //   replyTo: email,  // email dell’utente che ha compilato il form
    //   subject: "Richiesta informazioni",
    //   text: message,
    // });

    const info = sendEmail({
      to: "amministrazione@teamnewracing.com",
      subject: "Richiesta informazioni",
      from: {
        email: "amministrazione@teamnewracing.com",
        name: "Team New Racing",
      },
      text: message,
      replyTo: {
        email: email
      }
    });


    console.log(info)
    return response.status(200).json({ message: "Messaggio inviato con successo" });

  } catch (err) {
    console.error("Errore nell'invio della mail", err);
    return response.status(500).json({ message: "Errore nell'invio della mail" });
  }
}


