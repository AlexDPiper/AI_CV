import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error I will fix path's types later
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		// @ts-expect-error I will fix path's types later
		alias: { '@app': path.resolve(__dirname, 'src') },
	},
});
