const formatTime = (ms) => {
  let seconds = ms / 1000;
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return (
    minutes.toFixed(0).padStart(2, "0") +
    ":" +
    seconds.toFixed(2).padStart(2 + 3, "0")
  );
};

module.exports = { formatTime };
