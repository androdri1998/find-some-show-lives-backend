module.exports = {
  switchError: (err) => {
    return [
      err.status || 500,
      {
        error: !err.status || err.status >= 500 ? "Internal error" : err.name,
        error_description:
          !err.status || err.status >= 500
            ? "Internal error server"
            : err.message,
      },
    ];
  },
};
