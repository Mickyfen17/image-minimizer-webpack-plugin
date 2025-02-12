import path from 'path';

import { fixturesPath, plugins, webpack } from './helpers';

describe('validate options', () => {
  const tests = {
    minimizerOptions: {
      success: [{ plugins: [] }, {}],
      failure: [1, true, false, [], null],
    },
    filter: {
      success: [() => false],
      failure: [1, true, false, {}, [], null],
    },
    severityError: {
      success: [true, false, 'error'],
      failure: [{}, [], () => {}],
    },
    filename: {
      success: ['[name].[ext]'],
      failure: [{}, [], () => {}, true],
    },
    deleteOriginalAssets: {
      success: [true, false],
      failure: [{}, [], () => {}],
    },
    unknown: {
      success: [],
      failure: [1, true, false, 'test', /test/, [], {}, { foo: 'bar' }],
    },
  };

  function stringifyValue(value) {
    if (
      Array.isArray(value) ||
      (value && typeof value === 'object' && value.constructor === Object)
    ) {
      return JSON.stringify(value);
    }

    return value;
  }

  async function createTestCase(key, value, type) {
    it(`should ${
      type === 'success' ? 'successfully validate' : 'throw an error on'
    } the "${key}" option with "${stringifyValue(value)}" value`, async () => {
      const options = {
        entry: path.join(fixturesPath, 'validate-options.js'),
        imageminLoaderOptions: {
          [key]: value,
        },
      };

      if (key === 'severityError') {
        options.imageminLoaderOptions.minimizerOptions = { plugins };
      }

      let stats;

      try {
        stats = await webpack(options);
      } finally {
        if (type === 'success') {
          expect(stats.hasErrors()).toBe(false);
        } else if (type === 'failure') {
          const {
            compilation: { errors },
          } = stats;

          expect(errors).toHaveLength(1);
          expect(() => {
            throw new Error(errors[0].error.message);
          }).toThrowErrorMatchingSnapshot();
        }
      }
    });
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values)) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
