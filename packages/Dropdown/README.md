# @components/dropdown

A customizable dropdown component for React applications.

## Installation

```bash
npm install @components/dropdown
# or
yarn add @components/dropdown
```

## Usage

```tsx
import { Dropdown } from '@components/dropdown';

function App() {
  return (
    <Dropdown 
      options={[
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
      ]}
      onSelect={(value) => console.log(value)}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| options | `Array<{ label: string, value: string }>` | Yes | `[]` | Array of options to display in the dropdown |
| onSelect | `(value: string) => void` | Yes | - | Callback when an option is selected |
| placeholder | `string` | No | 'Select an option' | Placeholder text |
| disabled | `boolean` | No | `false` | Disable the dropdown |
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