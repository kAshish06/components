# React Components Library

A collection of reusable React components built with TypeScript. This repository contains commonly used UI components that can be easily integrated into your React applications.

## Available Components

### 1. Tree Component

A customizable tree view component that supports selection, expansion/collapse, and custom node rendering.

#### Usage

```tsx
import { Tree } from '@your-username/components';

  return (
    <div className="app">
      <h2>Tree Component Example</h2>
      <Tree
        data={treeData}
        selectable={true}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}
```

#### Props

| Prop        | Type                       | Default    | Description                      |
| ----------- | -------------------------- | ---------- | -------------------------------- |
| data        | `Data[]`                   | `[]`       | Array of data to render the tree |
| selectable  | `boolean`                  | `true`     | Enable/disable node selection    |
| onNodeClick | `(node: FlatData) => void` | `() => {}` | Callback when a node is clicked  |

## License

MIT
