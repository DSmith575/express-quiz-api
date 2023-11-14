/**
* @description Reusable function to generate a random uuid seed for profile pictures
* @file registeruuid.js

* @author Deacon Smith
* @created 15/11/2023
* @updated 15/11/2023
*/

import { v4 as uuidv4 } from 'uuid';

const genUuidSeed = () => {
  return uuidv4();
};

export default genUuidSeed;
