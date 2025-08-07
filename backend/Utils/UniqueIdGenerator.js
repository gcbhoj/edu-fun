const generateUniqueId = (prop) => {
  const fixedProp = prop.toUpperCase();
  const dateComponent = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const timeComponent = new Date().toTimeString().split(" ")[0].replace(/:/g, ""); // HHMMSS
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return `${fixedProp}-${dateComponent}-${timeComponent}-${randomNumber}`;
};

module.exports = { generateUniqueId };
