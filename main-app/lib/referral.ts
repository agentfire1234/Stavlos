export function getBadge(rank: number) {
    if (rank <= 100) return { title: 'Founding Member', color: 'text-yellow-500' }
    if (rank <= 1000) return { title: 'Early Bird', color: 'text-blue-400' }
    if (rank <= 2000) return { title: 'Pioneer', color: 'text-purple-400' }
    return { title: 'Stavlos Scholar', color: 'text-white/40' }
}
