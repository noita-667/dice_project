interface Props {
  value: number | null;
  label: string | null;
}

export function DiceResult({ value, label }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      {label && (
        <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
          {label}
        </div>
      )}
    </div>
  );
}