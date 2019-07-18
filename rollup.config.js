import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import pkg from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const config = {
  input: './src/index.ts',
  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  external: ['react', 'react-dom', 'axios', 'lodash'],
  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),
    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({
      include: /node_modules/,
    }),
    json(),
    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      runtimeHelpers: true,
      include: ['src/**/*'],
      exclude: 'node_modules/**',
    }),
    external(),
  ],

  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
    },
  ],
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(uglify())
}

export default config
