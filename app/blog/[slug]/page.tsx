import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { blogPosts, getPostBySlug, type Paragraph } from "../posts";

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
  return paragraph.map((segment, i) =>
    typeof segment === "string" ? (
      segment
    ) : (
      <a
        key={i}
        href={segment.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-md px-2 py-0.5 bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/40 font-medium hover:bg-cyan-500/25 hover:text-cyan-200 transition-colors"
      >
        {segment.text}
      </a>
    )
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c16] text-gray-300">
      <Header />
      <main className="flex-1 w-full pt-24 md:pt-32 pb-16 px-6 md:px-12">
        <article className="max-w-3xl mx-auto">
          <Link
            href="/#blog"
            className="text-sm text-cyan-400/90 hover:text-cyan-300"
          >
            ← Back to blog
          </Link>
          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl leading-tight mt-6 mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {post.title}
          </h1>

          {post.sections.map((section, sectionIndex) => (
            <section key={sectionIndex}>
              {section.heading && (
                <h2 className="font-orbitron text-xl sm:text-2xl text-gray-100 mb-6">
                  {section.heading}
                </h2>
              )}
              <div className="flex flex-col gap-5">
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i} className="text-gray-300 text-base sm:text-lg leading-relaxed">
                    {renderParagraph(paragraph)}
                  </p>
                ))}
              </div>
              <div aria-hidden className="relative my-12 flex items-center justify-center">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
                <div className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" />
              </div>
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
}
