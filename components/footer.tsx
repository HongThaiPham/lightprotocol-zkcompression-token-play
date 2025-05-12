import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-border bg-gradient-to-r from-blue-700 via-slate-500 to-orange-600">
      <div className="flex items-center justify-between gap-6 px-4 py-6 text-sm text-muted-foreground md:px-6 container mx-auto text-white">
        <p>xToken Tools &copy; {new Date().getFullYear()}</p>
        <p>
          Built by{" "}
          <Link
            className="border-b border-muted-foreground/30 transition-colors hover:border-transparent"
            href="https://twitter.com/leopham_it"
            target="_blank"
            rel="noreferrer"
          >
            @leopham
          </Link>
        </p>
      </div>
    </footer>
  );
};

export { Footer };
