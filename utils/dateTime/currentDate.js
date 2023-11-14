/**
 * @description Handles reusable get new date as ISO string
 * @file currentDate.js
 *
 * @author Deacon Smith
 * @created 15-11-2023
 * @updated 15-11-2023
 */

const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

export default getCurrentDate;
