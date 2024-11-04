import MarkdownIt from "markdown-it";

interface MarkdownProps {
  markdown?: string;
}

export const Markdown = ({ markdown }: MarkdownProps) => {
  var md = new MarkdownIt();
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: md.render(markdown ?? "") ?? "",
      }}
    ></div>
  );
};
