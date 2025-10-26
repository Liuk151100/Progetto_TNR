//Questo file mi serve per inviare le mail in produzione. il mailer funziona solo in locale.
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail({ to, subject, text, html }) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM, // deve essere un indirizzo verificato su SendGrid
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("✅ Email inviata con successo a", to);
  } catch (error) {
    console.error("❌ Errore durante l'invio email:", error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
