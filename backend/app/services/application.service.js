module.exports = {
  switchError: (err) => {
    return [(err.status || 500), {
      error: err.error,
      error_description: err.message
    }]
  }
}