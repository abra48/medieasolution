export default function AdminLoading() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="h-6 w-32 rounded bg-skeleton" />
      <div className="h-4 w-48 rounded bg-skeleton" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-lg bg-skeleton" />
        ))}
      </div>
    </div>
  );
}
