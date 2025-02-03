// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
	features: {
		// Rules for module authors
		tooling: true,
		// Rules for formatting
		stylistic: true,
	},
	dirs: {
		src: ['./playground'],
	},
})
	.append([{
		rules: {
			'@stylistic/no-tabs': 'off',
			'@stylistic/indent': ['error', 'tab'],
			'vue/html-indent': ['error', 'tab'],
			'vue/singleline-html-element-content-newline': 'off',
			'nuxt/nuxt-config-keys-order': 'off',
			'import/order': ['error', {
				'groups': ['type', 'builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
				'alphabetize': {
					order: 'asc',
				},
				'newlines-between': 'always-and-inside-groups',
			}],
			'@stylistic/arrow-parens': ['error', 'always'],
			'@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'off',
			'vue/no-multiple-template-root': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/first-attribute-linebreak': ['error', {
				singleline: 'beside',
				multiline: 'below',
			}],
		},
	}])
