"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import ReactMarkdown from "react-markdown"
import type { ChartData } from "@/actions/orchestrate"

interface ComparativeAnalysisDisplayProps {
  analysis: string
  charts: ChartData[]
}

// Dynamic chart renderer component
function ChartRenderer({ chartData }: { chartData: ChartData }) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Create a safe component from the chart code
  const renderChart = () => {
    try {
      // Extract the component code and create a function
      // We'll use a safer approach by parsing the code and rendering Recharts components
      const code = chartData.code

      // Check if it's a BarChart
      if (code.includes("BarChart")) {
        return <BarChartRenderer code={code} />
      }
      // Check if it's a LineChart
      if (code.includes("LineChart")) {
        return <LineChartRenderer code={code} />
      }
      // Check if it's an AreaChart
      if (code.includes("AreaChart")) {
        return <AreaChartRenderer code={code} />
      }

      return <div className="text-sm text-muted-foreground">Chart type not supported</div>
    } catch (error) {
      console.error("[v0] Error rendering chart:", error)
      return <div className="text-sm text-red-600">Error rendering chart</div>
    }
  }

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-accent transition-colors border-b border-border"
      >
        <div className="text-left">
          <h3 className="font-semibold text-foreground">{chartData.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{chartData.description}</p>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {isExpanded && <div className="p-6 bg-background">{renderChart()}</div>}
    </Card>
  )
}

// Simple chart renderers for common Recharts types
function BarChartRenderer({ code }: { code: string }) {
  // Parse the data from the code
  const dataMatch = code.match(/const data = \[([\s\S]*?)\];/)
  if (!dataMatch) return <div className="text-sm text-muted-foreground">Unable to parse chart data</div>

  try {
    // Create a safe data object
    const dataStr = `[${dataMatch[1]}]`
    const data = eval(dataStr)

    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = require("recharts")

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    )
  } catch (error) {
    console.error("[v0] Error rendering bar chart:", error)
    return <div className="text-sm text-red-600">Error rendering bar chart</div>
  }
}

function LineChartRenderer({ code }: { code: string }) {
  return (
    <div className="text-sm text-muted-foreground p-4 bg-muted rounded-md">
      Line chart rendering - data structure requires actual chart data
    </div>
  )
}

function AreaChartRenderer({ code }: { code: string }) {
  return (
    <div className="text-sm text-muted-foreground p-4 bg-muted rounded-md">
      Area chart rendering - data structure requires actual chart data
    </div>
  )
}

export function ComparativeAnalysisDisplay({ analysis, charts }: ComparativeAnalysisDisplayProps) {
  return (
    <div className="w-full space-y-6">
      {/* Analysis Markdown */}
      <Card className="p-6 prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
            p: ({ node, ...props }) => <p className="text-foreground leading-relaxed mb-4" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4" {...props} />,
            li: ({ node, ...props }) => <li className="text-foreground" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
            em: ({ node, ...props }) => <em className="italic text-foreground" {...props} />,
            code: ({ node, inline, ...props }) =>
              inline ? (
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground" {...props} />
              ) : (
                <code
                  className="bg-muted p-3 rounded block text-sm font-mono text-foreground overflow-x-auto"
                  {...props}
                />
              ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-muted-foreground my-4" {...props} />
            ),
            table: ({ node, ...props }) => (
              <table className="w-full border-collapse border border-border my-4" {...props} />
            ),
            th: ({ node, ...props }) => <th className="border border-border bg-muted p-2 text-left" {...props} />,
            td: ({ node, ...props }) => <td className="border border-border p-2" {...props} />,
          }}
        >
          {analysis}
        </ReactMarkdown>
      </Card>

      {/* Charts Section */}
      {charts && charts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Analysis Charts</h2>
          <div className="space-y-4">
            {charts.map((chart, index) => (
              <ChartRenderer key={index} chartData={chart} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
