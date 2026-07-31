export function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-[60vh] max-w-3xl">
      <h1 className="text-4xl font-heading font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <div className="space-y-6">
        <div className="bg-card border border-border p-6 rounded-[12px]">
          <h3 className="text-lg font-semibold mb-2">How long does delivery take?</h3>
          <p className="text-muted-foreground">Standard delivery typically takes 3-5 business days depending on your location.</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-[12px]">
          <h3 className="text-lg font-semibold mb-2">Do you offer returns?</h3>
          <p className="text-muted-foreground">Please contact our support for details on our return policy for premium fabrics.</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-[12px]">
          <h3 className="text-lg font-semibold mb-2">Are the fabrics authentic?</h3>
          <p className="text-muted-foreground">Yes, all our fabrics are 100% authentic and sourced from premium manufacturers.</p>
        </div>
      </div>
    </div>
  );
}
