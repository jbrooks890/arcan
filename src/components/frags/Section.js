export default function Section({
  name,
  type,
  media,
  id,
  className,
  children,
}) {
  return (
    <section
      id={`${name}-section ${name} ${id ?? ""}`.trim()}
      className={`section ${className ?? ""}`.trim()}
    >
      {children}
    </section>
  );
}
