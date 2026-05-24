import Link from "next/link";
import { Shield, CheckCircle, FlaskConical, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
            QA Platform
          </span>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Automated Software Quality Assurance Platform
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            MCA Final Semester Project — Task Management integrated with complete
            automated testing, CI/CD pipelines, regression testing, and defect monitoring.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Start Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CheckCircle,
              title: "Task Management",
              desc: "Full CRUD with search, filters, pagination & sorting",
            },
            {
              icon: FlaskConical,
              title: "QA & Testing",
              desc: "Unit, integration, frontend & E2E test suites",
            },
            {
              icon: GitBranch,
              title: "CI/CD Pipeline",
              desc: "GitHub Actions with automated regression testing",
            },
            {
              icon: Shield,
              title: "Defect Tracking",
              desc: "Bug reports, severity levels & usability feedback",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <feature.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        MCA Final Semester Project © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
