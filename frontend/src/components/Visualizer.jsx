import { useState } from 'react'
import { motion } from 'framer-motion'
import Plot from 'react-plotly.js'
import { trainModel } from '../utils/api'

function Visualizer({ algorithm, dataset, parameters }) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleRunModel = async () => {
    if (!algorithm || !dataset) return

    setLoading(true)
    setError(null)

    try {
      const data = await trainModel(algorithm.id, dataset.id, parameters)
      setResults(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to train model')
      console.error('Training error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Run Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div>
          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Live Analysis
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center space-x-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md font-medium text-xs">
              {algorithm?.name}
            </span>
            <span className="text-gray-400">•</span>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md font-medium text-xs">
              {dataset?.name} Dataset
            </span>
          </p>
        </div>

        <motion.button
          onClick={handleRunModel}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-lg">Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg">Run Analysis</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl shadow-lg"
        >
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-bold text-red-800 dark:text-red-300 mb-1">Analysis Error</h4>
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-6">
            {Object.entries(results.metrics).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-2xl transition-all"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
                <div className="relative">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-2">
                    {key.replace('_', ' ')}
                  </p>
                  <p className="text-4xl font-black text-blue-600 dark:text-blue-400">
                    {typeof value === 'number' ? value.toFixed(4) : value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Decision Boundary Plot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
                Decision Boundary
              </h3>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold">
                Interactive
              </span>
            </div>
            <Plot
              data={[
                {
                  x: results.decision_boundary.x.flat(),
                  y: results.decision_boundary.y.flat(),
                  z: results.decision_boundary.z.flat(),
                  type: 'contour',
                  colorscale: 'Viridis',
                  showscale: false,
                  opacity: 0.6,
                },
                {
                  x: results.decision_boundary.data_points.X.map(p => p[0]),
                  y: results.decision_boundary.data_points.X.map(p => p[1]),
                  mode: 'markers',
                  type: 'scatter',
                  marker: {
                    color: results.decision_boundary.data_points.y,
                    size: 8,
                    colorscale: 'Portland',
                    line: { color: 'white', width: 1 },
                  },
                  name: 'Data Points',
                },
              ]}
              layout={{
                autosize: true,
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { title: 'Feature 1', gridcolor: '#374151' },
                yaxis: { title: 'Feature 2', gridcolor: '#374151' },
                font: { color: '#9CA3AF' },
                margin: { l: 50, r: 50, t: 20, b: 50 },
              }}
              config={{ responsive: true }}
              style={{ width: '100%', height: '500px' }}
            />
          </motion.div>

          {/* Feature Importance */}
          {results.feature_importance && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="w-2 h-8 bg-orange-600 rounded-full mr-3"></span>
                  Feature Importance
                </h3>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-bold">
                  Analysis
                </span>
              </div>
              <Plot
                data={[
                  {
                    x: results.feature_importance,
                    y: results.feature_importance.map((_, i) => `Feature ${i + 1}`),
                    type: 'bar',
                    orientation: 'h',
                    marker: {
                      color: 'rgba(99, 102, 241, 0.8)',
                    },
                  },
                ]}
                layout={{
                  autosize: true,
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  xaxis: { title: 'Importance', gridcolor: '#374151' },
                  yaxis: { gridcolor: '#374151' },
                  font: { color: '#9CA3AF' },
                  margin: { l: 100, r: 50, t: 20, b: 50 },
                }}
                config={{ responsive: true }}
                style={{ width: '100%', height: '300px' }}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!results && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-96 bg-blue-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-blue-300 dark:border-gray-700 shadow-inner"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg className="w-24 h-24 text-blue-400 dark:text-blue-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            Ready to Visualize
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            Configure your parameters and click <span className="font-bold text-blue-600 dark:text-blue-400">"Run Analysis"</span> to generate interactive visualizations
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Visualizer
