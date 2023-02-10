export default function Article({
  name,
  type,
  media,
  author,
  publishDate,
  id,
  className,
  children,
}) {
  return (
    <article
      id={`article-${name} ${name} ${id ?? ""}`.trim()}
      className={`${className ?? ""}`.trim()}
    >
      {children}
    </article>
  );
}
