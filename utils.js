const formatTVL = (sum) => {
  const formattedValue = (sum / Math.pow(10, 18)).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });
  return formattedValue;
};

module.exports = { formatTVL };