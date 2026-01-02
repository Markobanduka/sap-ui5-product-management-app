import babel from '@babel/core';

export default async function({ workspace, logger }) {
  const resources = await workspace.byGlob(['/**/*.js', '!/**/qunit.js']);

  return Promise.all(
    resources.map(async (resource) => {
      const value = await resource.getString();
      logger.info(`Transpiling ${resource.getPath()}`);

      return babel.transformAsync(value, {
        sourceMaps: false,
        presets: ['@babel/preset-env'],
        plugins: [
          [
            '@babel/plugin-proposal-object-rest-spread',
            { loose: true, useBuiltIns: true }
          ],
          [
            '@babel/plugin-transform-destructuring',
            { loose: true, useBuiltIns: true }
          ],
          [
            '@babel/plugin-transform-spread',
            { loose: true }
          ]
        ]
      }).then(result => {
        resource.setString(result.code);
        workspace.write(resource)
      })
    })
  );
}
