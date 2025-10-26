import mailer from "../helpers/mailer.js";
import multer from "multer";
import { sendEmail } from "../helpers/sendMail.js";

export async function createsegn(request, response) {
    try {
        console.log(request.body)
        const { nome, email, messaggio } = request.body;
        const allegati = request.files.map((f) => ({
            content: fs.readFileSync(file.path).toString("base64"),
            filename: file.originalname,
            type: file.mimetype,
            disposition: "attachment",
        }));

        //Il mailer funz in locale, quando passo in produzione deve usare l'helper sendMail.js
        // const responseEmail = mailer.sendMail({
        //     from: "amministrazione@teamnewracing.com",
        //     to: "lucafaini20@gmail.com", //safeguarding.newracing@gmail.com
        //     replyTo: email,
        //     subject: `Segnalazione Safeguarding ${nome}`,
        //     text: messaggio,
        //     attachments: allegati,
        // });

        sendEmail({
            to: "lucafaini20@gmail.com", //safeguarding.newracing@gmail.com
            subject: `Segnalazione Safeguarding ${nome}`,
            from: {
                email: "amministrazione@teamnewracing.com",
                name: "Team New Racing",
            },
            text: messaggio,
            replyTo: {
                email: email
            },
            attachments: allegati,
        });


        emailConferma(nome, email, allegati)

        async function emailConferma(nome, email) {

            const html = `
        <h1>Grazie per la segnalazione</h1>
        <p>Ciao ${nome}, il Team New Racing ha ricevuto la tua segnalazione e ti risponderà al più presto </p>
        <p>Grazie per la collaborazione</p>
      `;
            //Il mailer funz in locale, quando passo in produzione deve usare l'helper sendMail.js
            // mailer.sendMail({
            //     from: "amministrazione@teamnewracing.com",
            //     to: email,
            //     subject: `Segnalazione Safeguarding Team New Racing`,
            //     text: html,
            //     attachments: allegati,
            // });

            sendEmail({
                to: email,
                subject: `Segnalazione Safeguarding Team New Racing`,
                from: {
                    email: "amministrazione@teamnewracing.com",
                    name: "Team New Racing",
                },
                html,
                attachments: allegati,
            });

        }


        return response.status(200).json({ message: "Segnalazione inviata con successo" });

    } catch (error) {
        console.error("Errore invio segnalazione safeguarding:", error);
        return response
            .status(500)
            .json({ message: "Errore invio segnalazione safeguarding", error: error.message });
    }
}


