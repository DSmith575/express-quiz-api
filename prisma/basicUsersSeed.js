const loginPath = 'http:localhost:3000/api/v1/login';

const loginDetails = {
  username: 'SuAdmin1',
  password: 'password123',
};

const main = async () => {
  try {
    const response = await fetch(loginPath, loginDetails);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

main();
