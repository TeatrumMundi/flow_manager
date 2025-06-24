interface MessageDisplayProps {
  message: { type: 'success' | 'error', text: string } | null;
}

export default function MessageDisplay({ message }: MessageDisplayProps) {
  if (!message) return null;

  return (
    <div className={`mb-4 p-3 rounded-md text-sm ${
      message.type === 'success' 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {message.text}
    </div>
  );
}