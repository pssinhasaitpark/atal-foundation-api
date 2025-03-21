const sendEmail = require("../utils/emailHandler");

const sendRegistrationEmail = async (req, res, next) => {
  try {
    const { first_name, last_name, email, mobile, address, gender, date_of_birth, state, category, designation, message, images } = req.body;

    const emailContent = `
      <h2>New User Registration</h2>
      <p><strong>Name:</strong> ${first_name} ${last_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Gender:</strong> ${gender}</p>
      <p><strong>Date of Birth:</strong> ${date_of_birth}</p>
      <p><strong>State:</strong> ${state}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Designation:</strong> ${designation}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;
    
    await sendEmail("mexaxo3528@bankrau.com", "New User Registration - Atal Foundation", emailContent);
    next();
  } catch (error) {
    console.error("Error sending registration email:", error);
    next(error);  
  }
};

module.exports = sendRegistrationEmail;
