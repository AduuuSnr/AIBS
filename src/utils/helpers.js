
  
  exports.generateUserId = (name) => {
    const randId = Math.floor(Math.random() * 8999 + 1000);
    return `${
      name[0].toUpperCase() +
      name.slice(1, name.length).split(" ")[0]
    }#${randId}`;
  };
  
  exports.httpResponse = (res, statusCode, status, message, data = null) => {
    return res.status(statusCode).json({
      status,
      message,
      data,
    });
  };
