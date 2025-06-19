import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Role } from '../generated/prisma'
import SideNav from '../components/SideNav/SideNav'
import { getDashboard } from '@/lib/dashboard'
// import UserCases from '../components/UserCases/UserCases'

// Main Dashboard Component (Server Component)
export default async function Dashboard() {
    const token = (await cookies()).get('token')?.value
    if (!token) return redirect('/login')

    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) return redirect('/login')

    const shownTabs = {
        [Role.owner]: [
            'AdminOverviewTab',
            'OwnerManageUserTab',
            'AdminManageCasesTab',
            'StewardOverviewTab',
            'StewardCasesTab',
        ],
        [Role.admin]: [
            'AdminOverviewTab',
            'AdminManageCasesTab',
            'StewardOverviewTab',
            'StewardCasesTab',
        ],
        [Role.steward]: [
            'StewardOverviewTab',
            'StewardCasesTab',
        ],
    };

    const data = await getDashboard(user);

    return (
        <div>
            <SideNav tabs={shownTabs[user.role]} data={data} token={token} />
        </div>
    )
}