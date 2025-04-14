import { useState } from 'react'
import './App.css'
import Redacao from "@/pages/Redacao";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Redacao />
  )
}

export default App
