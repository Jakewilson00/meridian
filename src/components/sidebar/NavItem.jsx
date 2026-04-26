export default function NavItem({ icon: Icon, label, active, badge, onClick }) {
  return (
    <button className={`nav-item${active ? ' active' : ''}`} onClick={onClick}>
      <Icon size={15} strokeWidth={2} />
      <span>{label}</span>
      {badge != null && <span className="nav-badge">{badge}</span>}
    </button>
  )
}
