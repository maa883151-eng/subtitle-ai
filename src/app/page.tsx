import Link from "next/link";
import { Mic, Globe, Download, Zap, ArrowRight, CheckCircle, FileVideo, Subtitles } from "lucide-react";

const LANGUAGES = ["English", "Bengali", "Arabic", "Spanish", "French", "Hindi", "Japanese", "Korean", "Portuguese", "German"];

const features = [
  { icon: FileVideo, title: "Any Video or Audio", desc: "MP4, MP3, WAV, MOV, WebM — we handle all formats automatically." },
  { icon: Mic, title: "Whisper AI Transcription", desc: "OpenAI's Whisper model — the most accurate speech recognition available." },
  { icon: Globe, title: "90+ Language Translation", desc: "Auto-translate subtitles to any language in seconds. Perfect for global content." },
  { icon: Download, title: "SRT & VTT Export", desc: "Download industry-standard subtitle files ready for YouTube, Premiere, or any editor." },
  { icon: Zap, title: "Fast Processing", desc: "Subtitles generated in seconds, not hours. No local software required." },
  { icon: CheckCircle, title: "Word-Level Timestamps", desc: "Precise timing for each segment. Subtitles sync perfectly with your video." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Subtitles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">SubtitleAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Sign In</Link>
            <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <section className="px-6 py-28 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Mic className="w-4 h-4" />
            Powered by OpenAI Whisper
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Subtitles in Seconds,
            <span className="text-blue-600"> In Any Language</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Upload your video or audio file. Our AI generates perfectly timed subtitles and
            translates them to any of 90+ languages. Export SRT or VTT in one click.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center gap-2">
              Generate Subtitles Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">5 free jobs • No credit card</p>
        </div>
      </section>

      {/* Languages */}
      <section className="px-6 py-8 bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Supports 90+ languages including</p>
          <div className="flex flex-wrap justify-center gap-2">
            {LANGUAGES.map((lang) => (
              <span key={lang} className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium">
                {lang}
              </span>
            ))}
            <span className="bg-blue-50 border border-blue-200 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium">
              +80 more...
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need for perfect subtitles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">3 steps to perfect subtitles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", t: "Upload File", d: "Drop your MP4, MP3, or WAV file — up to 500MB." },
              { n: "2", t: "AI Processes", d: "Whisper transcribes audio with precise timestamps." },
              { n: "3", t: "Download & Use", d: "Export SRT/VTT and add to any video editor or platform." },
            ].map((s) => (
              <div key={s.n}>
                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.n}</div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{s.t}</h3>
                <p className="text-gray-500 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 text-center bg-blue-600 text-white">
        <h2 className="text-4xl font-bold mb-4">Start generating subtitles today</h2>
        <p className="text-blue-200 mb-8">5 free subtitle jobs. No credit card required.</p>
        <Link href="/sign-up" className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-xl text-lg font-semibold transition-colors inline-flex items-center gap-2">
          Get Started Free <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="border-t px-6 py-8 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
            <Subtitles className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-gray-700">SubtitleAI</span>
        </div>
        <p className="text-gray-400 text-sm">© 2024 SubtitleAI. Powered by OpenAI Whisper.</p>
      </footer>
    </div>
  );
}
