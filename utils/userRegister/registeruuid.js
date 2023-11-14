import { v4 as uuidv4 } from 'uuid';

const genUuidSeed = () => {
  return uuidv4();
};

export default genUuidSeed;
