import mongoose from 'mongoose';
import {
  TErrorSources,
  TGenericErrorResponse,
} from '../interfaces/error.interface';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: val?.path,
      message: val.message,
    }),
  );

  const combinedMessage =
    errorSources.map((err) => err.message).join(', ') + '.';

  return {
    statusCode: 400,
    message: combinedMessage,
    errorType: 'Validation Failed',
    errorSources,
  };
};

export default handleValidationError;
