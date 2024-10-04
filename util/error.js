const { GraphQLError } = require("graphql");

class CustomError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.code = code;
    this.name = "CustomError";
  }
}

const errorHandler = (formattedError, error) => {
  const originalError = error.originalError || error;

  if (originalError instanceof CustomError) {
    return new GraphQLError(originalError.message, {
      extensions: {
        code: originalError.code || 500,
      },
    });
  }

  return new GraphQLError("Internal server error", {
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};

exports.CustomError = CustomError;
exports.errorHandler = errorHandler;
