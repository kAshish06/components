# @components/tree

A React tree component for displaying hierarchical data.

## Installation

```bash
npm install @components/tree
# or
yarn add @components/tree
```

## Usage

```tsx
import { Tree } from '@components/tree';

const treeData = [
  {
    id: '1',
    label: 'Parent',
    children: [
      { id: '2', label: 'Child 1' },
      { id: '3', label: 'Child 2' }
    ]
  }
];

function App() {
  const handleSelect = (node) => {
    console.log('Selected node:', node);
  };

  return (
    <Tree 
      data={treeData} 
      onSelect={handleSelect}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| data | `TreeNode[]` | Yes | - | Tree data structure |
| onSelect | `(node: TreeNode) => void` | No | - | Callback when a node is selected |
| defaultExpanded | `string[]` | No | `[]` | Array of node IDs to expand by default |
| className | `string` | No | - | Additional CSS class name |

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode with watch
npm run dev
```

## License

MIT