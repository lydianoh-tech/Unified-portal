const severityMap = {
  INFO: 'badge-info',
  WARNING: 'badge-warning',
  ERROR: 'badge-error',
  CRITICAL: 'badge-error',
};

export default function SeverityBadge({ severity }) {
  return (
    <span className={`badge ${severityMap[severity] ?? 'badge-info'}`}>{severity}</span>
  );
}
