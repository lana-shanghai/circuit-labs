import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  blogPosts,
  getPostBySlug,
  getSectionBlocks,
  type ContentBlock,
  type Paragraph,
} from "../posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function renderParagraph(paragraph: Paragraph) {
  if (typeof paragraph === "string") return paragraph;
  return paragraph.map((segment, i) => {
    if (typeof segment === "string") return segment;
    if ("bold" in segment && segment.bold) {
      return (
        <strong key={i} className="font-semibold text-[#c5d0de]">
          {segment.text}
        </strong>
      );
    }
    if ("href" in segment) {
      return (
        <a
          key={i}
          href={segment.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7eb8c9] underline decoration-[#7eb8c9]/35 underline-offset-[3px] hover:text-[#9fd0dd] hover:decoration-[#9fd0dd]/60 transition-colors"
        >
          {segment.text}
        </a>
      );
    }
    return null;
  });
}

function renderBlock(block: ContentBlock, key: number) {
  switch (block.type) {
    case "p":
      return (
        <p key={key} className="text-[#9aa8bc] text-[1.05rem] sm:text-[1.125rem] leading-[1.85] font-normal">
          {renderParagraph(block.content)}
        </p>
      );
    case "h3":
      return (
        <h3
          key={key}
          className="font-lora text-lg sm:text-xl text-[#c5d0de] font-medium mt-2 mb-1 tracking-wide"
        >
          {block.text}
        </h3>
      );
    case "image":
      return (
        <figure key={key} className="my-2">
          <div className="rounded-xl overflow-hidden border border-white/8 bg-[#0d101c]">
            <img src={block.src} alt={block.alt} className="w-full h-auto block" loading="lazy" />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-[#6d7f93]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "gallery":
      return (
        <div
          key={key}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2"
        >
          {block.items.map((item) => (
            <figure key={item.src} className="min-w-0">
              <div className="rounded-xl overflow-hidden border border-white/8 bg-[#0d101c] aspect-[4/3]">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover block"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-2 text-sm text-[#6d7f93] text-center">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      );
    case "ul":
      return (
        <ul key={key} className="flex flex-col gap-3 list-disc pl-5 marker:text-[#5f7a8a]">
          {block.items.map((item, i) => (
            <li key={i} className="text-[#9aa8bc] text-[1.05rem] sm:text-[1.125rem] leading-[1.85] pl-1">
              {renderParagraph(item)}
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={key} className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-white/[0.04]">
                {block.headers.map((header) => (
                  <th
                    key={header}
                    className="px-3 py-3 font-medium text-[#b7c4d4] border-b border-white/10 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-white/5 last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-3 text-[#8fa0b5] align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c16]">
      <Header />
      <main className="flex-1 w-full pt-24 md:pt-32 pb-16 px-6 md:px-12">
        <article className="max-w-3xl mx-auto">
          <Link
            href="/#blog"
            className="text-sm text-[#7a9eab] hover:text-[#9fc0cc] transition-colors"
          >
            ← Back to blog
          </Link>
          <h1 className="font-lora text-3xl sm:text-4xl md:text-[2.75rem] leading-snug mt-6 mb-4 text-[#d5dee8] font-medium tracking-tight">
            {post.title}
          </h1>
          {(post.author || post.date) && (
            <p className="text-[#6d7f93] text-sm mb-12">
              {[post.author, post.date].filter(Boolean).join(" · ")}
            </p>
          )}
          {!post.author && !post.date && <div className="mb-12" />}

          {post.sections.map((section, sectionIndex) => {
            const blocks = getSectionBlocks(section);
            return (
              <section key={sectionIndex}>
                {section.heading && (
                  <h2 className="font-lora text-xl sm:text-2xl text-[#c8d3e0] font-medium mb-6 tracking-wide">
                    {section.heading}
                  </h2>
                )}
                <div className="flex flex-col gap-5">{blocks.map(renderBlock)}</div>
                <div aria-hidden className="relative my-12 flex items-center justify-center">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#3d5a6e]/70 to-transparent" />
                  <div className="absolute h-1 w-1 rounded-full bg-[#5f8fa0]/80" />
                </div>
              </section>
            );
          })}
        </article>
      </main>
      <Footer />
    </div>
  );
}
