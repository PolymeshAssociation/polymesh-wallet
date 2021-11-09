interface InputError {
  errorDescription: string;
}

export type Result<T> = { error: InputError } | { ok: T };
export const Result = {
  error: <T>(errorDescription: string): Result<T> => ({
    error: { errorDescription },
  }),
  isError<T>(value: Result<T>): value is { error: InputError } {
    return Object.hasOwnProperty.call(value, 'error');
  },
  isOk<T>(value: Result<T>): value is { ok: T } {
    return Object.hasOwnProperty.call(value, 'ok');
  },
  ok: <T>(ok: T): Result<T> => ({ ok }),
};

export declare type Validator<T> = (value: T) => Result<T> | Promise<Result<T>>;

export const allOf =
  <T>(...validators: Validator<T>[]): Validator<T> =>
  async (value: T): Promise<Result<T>> => {
    for (const validator of validators) {
      const validationResult = await validator(value);

      if (Result.isError(validationResult)) {
        return validationResult;
      }
    }

    return Result.ok(value);
  };

export const isNotShorterThan =
  (minLength: number, errorText: string): Validator<string> =>
  (value: string): Result<string> => {
    if (value.length < minLength) {
      return Result.error(errorText);
    }

    return Result.ok(value);
  };

export const isSameAs =
  <T>(expectedValue: T, errorText: string): Validator<T> =>
  (value: T): Result<T> => {
    if (value !== expectedValue) {
      return Result.error(errorText);
    }

    return Result.ok(value);
  };
