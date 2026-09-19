import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Seo } from '@/components/common/Seo'
import { useAdminPortfolioQueriesBundle } from '@/hooks/useAdminDashboardData'

export function AdminDashboardPage() {
  const { education, experience, socials, attention, appsAdminUrl } =
    useAdminPortfolioQueriesBundle()

  const cards = [
    { label: 'Education', count: education.length, to: '/admin/education' },
    { label: 'Experience', count: experience.length, to: '/admin/experience' },
    { label: 'Social links', count: socials.length, to: '/admin/social' },
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
        <a
          href={appsAdminUrl}
          className="rounded border border-lightest-navy bg-light-navy p-5 transition hover:border-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
        >
          <p className="font-mono text-xs text-green">Projects & skills</p>
          <p className="mt-2 text-lg font-semibold text-lightest-slate">
            Manage in Apps
          </p>
          <p className="mt-1 text-xs text-slate">
            Featured projects, tech stack, and the 3 home skill categories live in
            all_projects admin.
          </p>
        </a>
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
