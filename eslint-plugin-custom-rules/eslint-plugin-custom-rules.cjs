// eslint-plugin-custom-rules.cjs
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const exhaustiveDepsRule = reactHooksPlugin.rules['exhaustive-deps'];

module.exports = {
  rules: {
    'use-click-outside-deps': {
      meta: exhaustiveDepsRule.meta,
      create(context) {
        const original = exhaustiveDepsRule.create(context);

        return {
          CallExpression(node) {
            if (node.callee.type !== 'Identifier' || node.callee.name !== 'useClickOutSide') return;
            if (node.arguments.length < 2) return;

            const callback = node.arguments[0];
            const depsNode = node.arguments[1];

            if (!depsNode || depsNode.type !== 'ArrayExpression') return;

            // Create a new node that mimics a useEffect call.
            const fakeUseEffectNode = {
              ...node,
              callee: { ...node.callee, name: 'useCallback' },
              arguments: [
                callback,
                {
                  ...depsNode,
                  elements: depsNode.elements.slice(2), // explicitly ignore first two deps
                },
              ],
            };

            original.CallExpression(fakeUseEffectNode);
          },
        };
      },
    },
  },

  configs: {
    recommended: {
      plugins: ['custom-rules'],
      rules: {
        'custom-rules/use-click-outside-deps': 'warn',
      },
    },
  },
};
