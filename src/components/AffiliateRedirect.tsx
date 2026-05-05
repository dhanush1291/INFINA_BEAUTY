import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  partnerName: string;
  productName: string;
}

export function AffiliateRedirect({ open, onOpenChange, url, partnerName, productName }: Props) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!open) {
      setCount(3);
      return;
    }
    if (count <= 0) {
      window.open(url, "_blank", "noopener,sponsored");
      onOpenChange(false);
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [open, count, url, onOpenChange]);

  const goNow = () => {
    window.open(url, "_blank", "noopener,sponsored");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Heading to our partner</DialogTitle>
          <DialogDescription>
            You're being redirected to <span className="font-medium text-foreground">{partnerName}</span> to
            complete your purchase of{" "}
            <span className="font-medium text-foreground">{productName}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="my-2 flex items-center justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-rose text-3xl font-semibold text-primary-foreground shadow-soft">
            {count > 0 ? count : "→"}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Sai may earn commission. Prices and availability are set by the partner.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={goNow}>
            Continue now <ExternalLink className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
