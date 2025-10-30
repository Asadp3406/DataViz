import { motion } from 'framer-motion'
import DatasetUpload from './DatasetUpload'

function Sidebar({
  algorithms,
  datasets,
  selectedAlgorithm,
  selectedDataset,
  parameters,
  onAlgorithmChange,
  onDatasetChange,
  onParameterChange
}) {
  return (
    <aside className="w-96 bg-gradient-to-b from-gray-900 to-black border-r border-gray-700 p-6 overflow-y-auto h-[calc(100vh-89px)] shadow-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Dataset Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 uppercase tracking-wide">
            <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            Data Source
          </label>
          <select
            value={selectedDataset?.id || ''}
            onChange={(e) => {
              const dataset = datasets.find(d => d.id === e.target.value)
              onDatasetChange(dataset)
            }}
            className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-lg hover:shadow-cyan-500/30 font-medium"
          >
            {datasets.map(dataset => (
              <option key={dataset.id} value={dataset.id}>
                {dataset.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Algorithm Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 uppercase tracking-wide">
            <svg className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            Model Type
          </label>
          <select
            value={selectedAlgorithm?.id || ''}
            onChange={(e) => {
              const algo = algorithms.find(a => a.id === e.target.value)
              onAlgorithmChange(algo)
            }}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:shadow-md font-medium"
          >
            {algorithms.map(algo => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Parameters */}
        {selectedAlgorithm && selectedAlgorithm.parameters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 shadow-2xl border-2 border-gray-700"
          >
            <h3 className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 uppercase tracking-wide">
              <svg className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Configuration
            </h3>
            <div className="space-y-5">
              {selectedAlgorithm.parameters.map((param, index) => (
                <motion.div 
                  key={param.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                >
                  <label className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                    <span className="capitalize">{param.name.replace(/_/g, ' ')}</span>
                    <span className="px-2 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-xs font-bold shadow-lg">
                      {parameters[param.name]}
                    </span>
                  </label>
                  
                  {param.type === 'slider' && (
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={parameters[param.name] || param.default}
                      onChange={(e) => onParameterChange(param.name, parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"

                    />
                  )}
                  
                  {param.type === 'dropdown' && (
                    <select
                      value={parameters[param.name] || param.default}
                      onChange={(e) => onParameterChange(param.name, e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      {param.options.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CSV Upload */}
        <DatasetUpload onUpload={(data) => {
          console.log('Dataset uploaded:', data)
          alert(`Dataset uploaded! ${data.samples} samples, ${data.features} features`)
        }} />

        {/* Info Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border-2 border-cyan-800 shadow-lg"
        >
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-cyan-300 leading-relaxed">
              Adjust the configuration settings and click "Run Analysis" to visualize how different parameters affect the model's behavior and accuracy.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </aside>
  )
}

export default Sidebar
