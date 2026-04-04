import { useAppController } from './controllers/useAppController'
import { AppView } from './views/AppView'
import './App.css'

function App() {
  const viewModel = useAppController()

  return <AppView {...viewModel} />
}

export default App
