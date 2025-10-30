import { useEffect, useRef } from 'react'

function TreeVisualization({ tree }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!tree || !tree.nodes || tree.nodes.length === 0) return

    const svg = svgRef.current
    const width = svg.clientWidth || 1200
    const height = Math.max(600, (tree.max_depth + 1) * 150)

    // Clear previous content
    svg.innerHTML = ''

    // Calculate positions for nodes
    const nodePositions = {}
    const levelCounts = {}
    
    // Count nodes per level
    tree.nodes.forEach(node => {
      levelCounts[node.depth] = (levelCounts[node.depth] || 0) + 1
    })

    // Calculate positions
    tree.nodes.forEach((node, index) => {
      const levelIndex = tree.nodes
        .filter(n => n.depth === node.depth)
        .indexOf(node)
      
      const levelWidth = levelCounts[node.depth]
      const x = (width / (levelWidth + 1)) * (levelIndex + 1)
      const y = 80 + node.depth * 120
      
      nodePositions[node.id] = { x, y }
    })

    // Draw edges first (so they appear behind nodes)
    tree.edges.forEach(edge => {
      const from = nodePositions[edge.from]
      const to = nodePositions[edge.to]
      
      if (from && to) {
        // Create curved path
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        const midY = (from.y + to.y) / 2
        const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`
        
        line.setAttribute('d', d)
        line.setAttribute('stroke', edge.label === 'left' ? '#10b981' : '#ef4444')
        line.setAttribute('stroke-width', '2')
        line.setAttribute('fill', 'none')
        line.setAttribute('opacity', '0.6')
        svg.appendChild(line)

        // Add edge label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        label.setAttribute('x', (from.x + to.x) / 2)
        label.setAttribute('y', (from.y + to.y) / 2)
        label.setAttribute('fill', edge.label === 'left' ? '#10b981' : '#ef4444')
        label.setAttribute('font-size', '12')
        label.setAttribute('font-weight', 'bold')
        label.textContent = edge.label === 'left' ? 'True' : 'False'
        svg.appendChild(label)
      }
    })

    // Draw nodes
    tree.nodes.forEach(node => {
      const pos = nodePositions[node.id]
      if (!pos) return

      // Node group
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      g.setAttribute('class', 'tree-node')

      // Node circle/rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      const rectWidth = 140
      const rectHeight = 70
      
      rect.setAttribute('x', pos.x - rectWidth / 2)
      rect.setAttribute('y', pos.y - rectHeight / 2)
      rect.setAttribute('width', rectWidth)
      rect.setAttribute('height', rectHeight)
      rect.setAttribute('rx', '10')
      
      if (node.is_leaf) {
        rect.setAttribute('fill', '#065f46')
        rect.setAttribute('stroke', '#10b981')
      } else {
        rect.setAttribute('fill', '#1e3a8a')
        rect.setAttribute('stroke', '#3b82f6')
      }
      rect.setAttribute('stroke-width', '2')
      g.appendChild(rect)

      // Node text
      const lines = node.label.split('\n')
      lines.forEach((line, i) => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        text.setAttribute('x', pos.x)
        text.setAttribute('y', pos.y - 20 + i * 18)
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('fill', 'white')
        text.setAttribute('font-size', '12')
        text.setAttribute('font-weight', i === 0 ? 'bold' : 'normal')
        text.textContent = line
        g.appendChild(text)
      })

      svg.appendChild(g)
    })

    // Set SVG dimensions
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

  }, [tree])

  if (!tree || !tree.nodes || tree.nodes.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No tree structure available
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg 
        ref={svgRef} 
        className="w-full min-h-[600px]"
        style={{ minWidth: '1200px' }}
      />
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 border-2 border-blue-400 rounded"></div>
          <span className="text-gray-300">Decision Node</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-700 border-2 border-green-500 rounded"></div>
          <span className="text-gray-300">Leaf Node (Class)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-0.5 bg-green-500"></div>
          <span className="text-gray-300">True</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-0.5 bg-red-500"></div>
          <span className="text-gray-300">False</span>
        </div>
      </div>
    </div>
  )
}

export default TreeVisualization
