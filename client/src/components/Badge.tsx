

type BadgeProps = {
    status: string;
};

export default function Badge({ status }: BadgeProps) {
    const normalizedStatus = status.toLowerCase();

    let styles = 'badge-pending';
    let label = status.replace(/_/g, ' ').toUpperCase();

    if (normalizedStatus.includes('approved') || normalizedStatus === 'completed' || normalizedStatus === 'closed') {
        styles = 'badge-approved';
    } else if (normalizedStatus.includes('rejected')) {
        styles = 'badge-rejected';
    } else if (normalizedStatus === 'open') {
        styles = 'bg-blue-100 text-blue-800';
    }

    return <span className={`badge ${styles}`}>{label}</span>;
}
