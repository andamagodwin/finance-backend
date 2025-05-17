import { DatabaseConnection } from "./database";
import { hashPassword } from "./Helpers/Helpers";
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

// async function createStaffinDB() {
//   // ask for first name
//   const rl = readline.createInterface({ input, output });
//   const question = `Enter Full name:
//     >>>> `;
//   const full_name = await rl.question(question);

//   // ask for Phone Number
//   const question2 = `Enter Phone Number:
//     >>>> `;
//   const phone_number = await rl.question(question2);

//   // ask for email
//   const question4 = `Enter email:
//     >>>> `;
//   const email = await rl.question(question4);

//   // ask for password
//   const question5 = `Enter password:
//     >>>> `;
//   const password = await rl.question(question5);

//   // hash the password
//   const hashedPassword = await hashPassword(password, 10);

//   if (!hashedPassword) {
//     console.log("Error hashing password");
//     return;
//   }

//   // create staff
//   await createAdminUser(full_name, phone_number, email, hashedPassword);

//   rl.close();

//   console.log(`Admin account created successfully`);
//   process.exit(0);
// }

// DatabaseConnection.initialize()
//   .then(() => {
//     console.log(`Database Connection Successful`);
//     createStaffinDB();
//   })
//   .catch((error) => {
//     console.log(error);
//   });
