import {
  TErrorSources,
  TGenericErrorResponse,
} from '../interfaces/error.interface';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Match something like: dup key: { email: "manik@example.com" }
  const match = err.message.match(/dup key: { (.*): "([^"]+)" }/);

  const field = match?.[1] || '';
  const value = match?.[2] || '';

  const fullMessage = `${value} is already exists`;

  const errorSources: TErrorSources = [
    {
      path: field,
      message: fullMessage,
    },
  ];

  return {
    statusCode: 400,
    message: fullMessage,
    errorType: 'Duplicate Entry',
    errorSources,
  };
};

export default handleDuplicateError;
