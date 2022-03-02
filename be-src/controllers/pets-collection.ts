import { User, Auth, Pet, Report } from "../models";
import { index } from "../lib/algolia";
import { sgMail } from "../lib/sendGrid";

export async function lostPets(lat, lng) {
  console.log(lat, lng);

  const { hits } = await index.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 1500,
  });

  return hits;
}

async function sendMail(to, name, message, phoneNum) {
  const msg = {
    to: to,
    from: "joaquingiacusa.dev@gmail.com", // Use the email address or domain you verified above
    subject: "Informacion acerca de tu mascota perdida",
    html:
      "<p> Hemos recibido un reporte de " +
      name +
      " acerca de tu mascota perdida. Fue visto por ultima vez en: " +
      message +
      ". Puedes ponerte en contacto el el a traves del numero telefonico: " +
      phoneNum +
      "</p>",
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

export async function createReport(reportParams) {
  if (!reportParams.petId) {
    throw "faltan el petId de la mascota a reportar";
  } else {
    //console.log(reportParams);

    const pet = await Pet.findByPk(reportParams.petId, { include: User });

    ///send-mail////////////////////////////

    const mailTo = pet["user"].email;
    const message = reportParams.lastSeen;
    const phoneNum = reportParams.phoneNum;
    const fullName = reportParams.fullName;
    sendMail(mailTo, fullName, message, phoneNum);

    ///////////////////////////////
    const report = await Report.create({
      who_did: reportParams.fullName,
      phone_number: reportParams.phoneNum,
      message: reportParams.lastSeen,
      petId: pet.get("id"),
    });
    return { pet, report };
  }
}

export async function getReports() {
  const report = await Report.findAll();
  return report;
}
