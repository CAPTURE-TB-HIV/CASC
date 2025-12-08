import { defineConfig } from 'vite'
import * as path from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						const parts = id.split('node_modules/')[1].split('/')
						const pkgName = parts[0].startsWith('@')
							? parts.slice(0, 2).join('/')
							: parts[0]
						return `vendor-${pkgName}` // e.g. vendor-plotly.js-dist-min
					}
				},
			},
		},
	},
	test: {
		environment: 'happy-dom',
		globals: true
	},
	resolve: {
		alias: {
			'~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
			'vue': 'vue/dist/vue.esm-bundler.js'

		}
	},
	define: {
		__VUE_OPTIONS_API__: true,
		__VUE_PROD_DEVTOOLS__: false,
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
	},
	css: {
		preprocessorOptions: {
			scss: {
				silenceDeprecations: [
					'import',
					'mixed-decls',
					'color-functions',
					'global-builtin',
				],
			},
		},
	},
	base: '/CASC/',
})
