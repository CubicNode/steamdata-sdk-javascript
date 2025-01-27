import { expect, test } from 'vitest';
import { InvalidArgumentError } from '~/errors/InvalidArgumentError.js';

test('Create error', () => {
  const message = 'Test message';
  const error = new InvalidArgumentError(message);

  expect(error.message).toBe(message);
  expect(error.name).toBe('InvalidArgumentError');
});
