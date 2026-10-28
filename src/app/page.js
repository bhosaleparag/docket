import Link from "next/link";
import { MessageSquare, Layers, Globe2, Lock } from "lucide-react";
import Logo from "@/components/Logo";

export default function LandingPage() {
  return (
    <div>
      <header className="flex items-center justify-between px-8 py-5 border-b border-line">
        <Logo />
        <Link href="/login" className="text-forest text-sm font-medium hover:underline">
          Sign in
        </Link>
      </header>

      <section className="px-8 pt-20 pb-16 max-w-3xl mx-auto text-left">
        <p className="text-forest text-sm font-medium mb-4 tracking-wide">
          For product teams who write docs no one reads
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl leading-[1.08] mb-6">
          Turn your docs into answers.
        </h1>
        <p className="text-muted text-lg leading-relaxed mb-8 max-w-[58ch]">
          Upload what you already have — product docs, FAQs, help articles. Get a chat widget
          that answers visitor questions using only that content, and hands off to you when it
          can&apos;t.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#demo"
            className="bg-forest text-white px-5 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            See it answer a question
          </a>
          <Link
            href="/dashboard"
            className="border border-line px-5 py-3 rounded-md text-sm font-medium hover:border-black/30 transition-colors"
          >
            View dashboard
          </Link>
        </div>
      </section>

      <section id="demo" className="px-8 pb-20 max-w-3xl mx-auto">
        <div className="border border-line bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-line bg-[#F2F0EA]">
            <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-black/15" />
            <span className="font-mono text-muted text-xs ml-3">yourcompany.com</span>
          </div>
          <div className="relative h-80 bg-gradient-to-br from-[#FAF9F6] to-[#F0EEE7]">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted text-sm">Your website content</p>
            </div>
            <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-forest flex items-center justify-center shadow-lg">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div className="absolute bottom-20 right-4 w-64 bg-white rounded-lg border border-line shadow-lg overflow-hidden">
              <div className="bg-forest px-3 py-2.5">
                <p className="text-white text-xs font-medium">Ask us anything</p>
              </div>
              <div className="p-3 space-y-2">
                <div className="bg-[#F2F0EA] rounded-md px-2.5 py-2 text-xs">
                  Do you support annual billing?
                </div>
                <div className="bg-[#EAF2ED] rounded-md px-2.5 py-2 text-xs">
                  Yes — annual plans get two months free. Source: <span className="underline">Pricing FAQ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 border-t border-line max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl mb-10">How it works</h2>
        <div className="space-y-8">
          {[
            ["1", "Upload your docs", "PDFs, plain text, or markdown — whatever you've already written."],
            ["2", "Drop in one line of code", "A script tag gives you a floating chat widget on your site."],
            ["3", "Visitors get grounded answers", "Every response is pulled from your content, with the source shown."],
          ].map(([num, title, body]) => (
            <div key={num} className="flex gap-5">
              <span className="font-serif text-amber text-2xl">{num}</span>
              <div>
                <p className="font-medium mb-1">{title}</p>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 border-t border-line bg-[#F5F3EC]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl mb-10">
            Built for teams who&apos;d rather not repeat themselves
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              [MessageSquare, "Support teams", "Deflect the questions your help docs already answer, so you only handle the ones that need a person."],
              [Layers, "Course creators", "Let students ask about your material directly instead of digging through modules."],
              [Globe2, "Agencies", "Run a separate bot per client site, each one grounded only in that client's own content."],
            ].map(([Icon, title, body]) => (
              <div key={title}>
                <Icon size={18} className="text-forest mb-3" />
                <p className="font-medium mb-1.5">{title}</p>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 py-16 border-t border-line max-w-3xl mx-auto">
        <div className="flex gap-5 items-start">
          <div className="w-10 h-10 rounded-md bg-[#EAF2ED] flex items-center justify-center shrink-0">
            <Lock size={17} className="text-forest" />
          </div>
          <div>
            <h2 className="font-serif text-2xl mb-3">Every bot only knows its own docs</h2>
            <p className="text-muted text-sm leading-relaxed max-w-[56ch]">
              Documents are uploaded per project, not into one shared pool. A bot built for your
              pricing page can&apos;t accidentally surface something from an internal doc you
              uploaded to a different project. If you run bots for more than one site or client,
              each one stays in its own lane.
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 border-t border-line bg-[#F5F3EC]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl mb-10">A few things people ask</h2>
          <div className="space-y-6">
            {[
              ["Will it make things up?", "It only answers from what you've uploaded. If nothing in your docs covers the question, it lets the user know directly instead of guessing."],
              ["What file types can I upload?", "PDF, plain text, and markdown today. Anything you can export your docs as, you can upload."],
              ["How accurate are the answers?", "Every answer is strictly grounded in your uploaded documents and clearly references the source document."],
            ].map(([q, a]) => (
              <div key={q} className="border-b border-line pb-6 last:border-0 last:pb-0">
                <p className="font-medium mb-1.5">{q}</p>
                <p className="text-muted text-sm leading-relaxed max-w-[56ch]">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-8 py-8 border-t border-line text-muted text-xs flex items-center justify-between max-w-3xl mx-auto">
        <span>Built by one person. That&apos;s the whole team.</span>
        <Link href="/login" className="hover:underline">
          Sign in
        </Link>
      </footer>
    </div>
  );
}
