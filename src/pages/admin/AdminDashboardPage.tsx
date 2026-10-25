import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Seo } from '@/components/common/Seo'
import { useAdminPortfolioQueriesBundle } from '@/hooks/useAdminDashboardData'

export function AdminDashboardPage() {
  const { education, experience, socials, projects, skills, attention } =
    useAdminPortfolioQueriesBundle()

  const cards = [
    { label: 'Education', count: education.length, to: '/admin/education' },
    { label: 'Experience', count: experience.length, to: '/admin/experience' },
    { label: 'Social links', count: socials.length, to: '/admin/social' },
    { label: 'Projects', count: projects.length, to: '/admin/projects' },
    { label: 'Skills', count: skills.length, to: '/admin/skills' },
  ]

  return (
    <div>
      <Seo title="Admin — Dashboard" />
      <AdminPageHeader
        title="Dashboard"
        description="Content inventory for your portfolio."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded border border-lightest-navy bg-light-navy p-5 transition hover:border-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
          >
            <p className="font-mono text-xs text-green">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-lightest-slate">
              {card.count}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded border border-lightest-navy bg-light-navy p-5">
        <h3 className="mb-3 font-semibold text-lightest-slate">Needs attention</h3>
        {attention.length === 0 ? (
          <p className="text-sm text-slate">Everything looks good.</p>
        ) : (
          <ul className="space-y-2">
            {attention.map((item) => (
              <li key={item} className="text-sm text-light-slate">
                ▹ {item}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
