/**
* @description Reusable function to salt and hash a password
* @file passwordUtils.js

* @author Deacon Smith
* @created 15/11/2023
* @updated 15/11/2023
*/

import bcryptjs from 'bcryptjs';

const saltHashPassword = async (password) => {
  const salt = await bcryptjs.genSalt();
  const hashedPassword = await bcryptjs.hash(password, salt);
  return hashedPassword;
};

export default saltHashPassword;
