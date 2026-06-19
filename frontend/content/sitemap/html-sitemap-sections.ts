export type HtmlSitemapLink = {
  href: string;
  label: string;
};

export type HtmlSitemapSection = {
  title: string;
  links: HtmlSitemapLink[];
};
