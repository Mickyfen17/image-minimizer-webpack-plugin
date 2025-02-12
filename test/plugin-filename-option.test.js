import path from 'path';

import fileType from 'file-type';

import { fixturesPath, webpack, clearDirectory } from './helpers';

describe('plugin filename option', () => {
  beforeAll(() => clearDirectory(path.resolve(__dirname, 'outputs')));
  afterAll(() => clearDirectory(path.resolve(__dirname, 'outputs')));

  it('should transform image to webp', async () => {
    const outputDir = path.resolve(__dirname, 'outputs', 'filename-1');
    const stats = await webpack({
      entry: path.join(fixturesPath, './empty-entry.js'),
      output: {
        path: outputDir,
      },
      emitPlugin: true,
      emitPluginOptions: { fileNames: ['./nested/deep/plugin-test.png'] },
      imageminPluginOptions: {
        filename: '[path][name].webp',
        minimizerOptions: {
          plugins: ['imagemin-webp'],
        },
      },
    });
    const { compilation } = stats;
    const { warnings, errors, assets } = compilation;

    const transformedAssets = Object.keys(assets).filter((asset) =>
      asset.includes('./nested/deep/plugin-test.webp')
    );
    const file = path.resolve(
      __dirname,
      outputDir,
      './nested/deep/plugin-test.webp'
    );
    const ext = await fileType.fromFile(file);

    expect(/image\/webp/i.test(ext.mime)).toBe(true);
    expect(transformedAssets).toHaveLength(1);
    expect(warnings).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it('should transform image to webp with flat filename', async () => {
    const outputDir = path.resolve(__dirname, 'outputs', 'filename-2');
    const stats = await webpack({
      entry: path.join(fixturesPath, './empty-entry.js'),
      output: {
        path: outputDir,
      },
      emitPlugin: true,
      emitPluginOptions: { fileNames: ['./nested/deep/plugin-test.png'] },
      imageminPluginOptions: {
        filename: '[name].webp',
        minimizerOptions: {
          plugins: ['imagemin-webp'],
        },
      },
    });
    const { compilation } = stats;
    const { warnings, errors, assets } = compilation;

    const transformedAssets = Object.keys(assets).filter((asset) =>
      asset.includes('plugin-test.webp')
    );
    const file = path.resolve(__dirname, outputDir, 'plugin-test.webp');
    const ext = await fileType.fromFile(file);

    expect(/image\/webp/i.test(ext.mime)).toBe(true);
    expect(transformedAssets).toHaveLength(1);
    expect(warnings).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it('should transform image to webp with nested filename', async () => {
    const outputDir = path.resolve(__dirname, 'outputs', 'filename-3');
    const stats = await webpack({
      entry: path.join(fixturesPath, './empty-entry.js'),
      output: {
        path: outputDir,
      },
      emitPlugin: true,
      emitPluginOptions: { fileNames: ['plugin-test.png'] },
      imageminPluginOptions: {
        filename: './nested/deep/[name].webp',
        minimizerOptions: {
          plugins: ['imagemin-webp'],
        },
      },
    });
    const { compilation } = stats;
    const { warnings, errors, assets } = compilation;

    const transformedAssets = Object.keys(assets).filter((asset) =>
      asset.includes('./nested/deep/plugin-test.webp')
    );
    const file = path.resolve(
      __dirname,
      outputDir,
      './nested/deep/plugin-test.webp'
    );
    const ext = await fileType.fromFile(file);

    expect(/image\/webp/i.test(ext.mime)).toBe(true);
    expect(transformedAssets).toHaveLength(1);
    expect(warnings).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });

  it('should transform image to webp with filename pointing to other directory', async () => {
    const outputDir = path.resolve(__dirname, 'outputs', 'filename-4');
    const stats = await webpack({
      entry: path.join(fixturesPath, './empty-entry.js'),
      output: {
        path: outputDir,
      },
      emitPlugin: true,
      emitPluginOptions: { fileNames: ['./nested/deep/plugin-test.png'] },
      imageminPluginOptions: {
        filename: './other/[name].webp',
        minimizerOptions: {
          plugins: ['imagemin-webp'],
        },
      },
    });
    const { compilation } = stats;
    const { warnings, errors, assets } = compilation;

    const transformedAssets = Object.keys(assets).filter((asset) =>
      asset.includes('./other/plugin-test.webp')
    );
    const file = path.resolve(__dirname, outputDir, './other/plugin-test.webp');
    const ext = await fileType.fromFile(file);

    expect(/image\/webp/i.test(ext.mime)).toBe(true);
    expect(transformedAssets).toHaveLength(1);
    expect(warnings).toHaveLength(0);
    expect(errors).toHaveLength(0);
  });
});
