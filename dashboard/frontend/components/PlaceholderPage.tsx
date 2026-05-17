export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black">{title}</h1>
      <div className="p-20 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center">
        <p className="text-gw-text-secondary text-sm italic">
          The {title} module is currently under active development.
        </p>
      </div>
    </div>
  );
}
