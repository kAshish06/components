# @components/record-audio

A React component for recording audio in the browser.

## Installation

```bash
npm install @components/record-audio
# or
yarn add @components/record-audio
```

## Usage

```tsx
import { RecordAudio } from '@components/record-audio';

function App() {
  const handleRecordingComplete = (audioBlob: Blob) => {
    console.log('Recorded audio:', audioBlob);
  };

  return (
    <RecordAudio 
      onRecordingComplete={handleRecordingComplete}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onRecordingComplete | `(blob: Blob) => void` | Yes | - | Callback with recorded audio blob |
| disabled | `boolean` | No | `false` | Disable the recording |
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