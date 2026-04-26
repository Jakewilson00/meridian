import { useApp } from '../../context/AppContext'
import './shared.css'

const VIEWS = ['board', 'list', 'timeline']

export default function ViewToggle() {
  const { state, dispatch } = useApp()

  return (
    <div className="view-toggle">
      {VIEWS.map((v) => (
        <button
          key={v}
          className={`view-btn${state.activeView === v ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', view: v })}
        >
          {v}
        </button>
      ))}
    </div>
  )
}
