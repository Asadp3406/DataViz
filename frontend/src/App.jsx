import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Visualizer from './components/Visualizer'
import Header from './components/Header'
import { fetchAlgorithms, fetchDatasets } from './utils/api'

function App() {
  const [darkMode, setDarkMode] = useState(true)  // Dark mode by default
  const [algorithms, setAlgorithms] = useState([])
  const [datasets, setDatasets] = useState([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null)
  const [selectedDataset, setSelectedDataset] = useState(null)
  const [parameters, setParameters] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const [algoData, datasetData] = await Promise.all([
        fetchAlgorithms(),
        fetchDatasets()
      ])
      setAlgorithms(algoData.algorithms)
      setDatasets(datasetData.datasets)
      
      if (algoData.algorithms.length > 0) {
        setSelectedAlgorithm(algoData.algorithms[0])
        initializeParameters(algoData.algorithms[0])
      }
      if (datasetData.datasets.length > 0) {
        setSelectedDataset(datasetData.datasets[0])
      }
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeParameters = (algorithm) => {
    const params = {}
    algorithm.parameters.forEach(param => {
      params[param.name] = param.default
    })
    setParameters(params)
  }

  const handleAlgorithmChange = (algorithm) => {
    setSelectedAlgorithm(algorithm)
    initializeParameters(algorithm)
  }

  const handleParameterChange = (paramName, value) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-600 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-2xl font-bold text-white">Loading DataViz Studio...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 transition-colors">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <div className="flex">
          <Sidebar
            algorithms={algorithms}
            datasets={datasets}
            selectedAlgorithm={selectedAlgorithm}
            selectedDataset={selectedDataset}
            parameters={parameters}
            onAlgorithmChange={handleAlgorithmChange}
            onDatasetChange={setSelectedDataset}
            onParameterChange={handleParameterChange}
          />
          
          <main className="flex-1 p-8">
            <Visualizer
              algorithm={selectedAlgorithm}
              dataset={selectedDataset}
              parameters={parameters}
            />
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
