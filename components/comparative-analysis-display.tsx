"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { ChartData } from "@/actions/orchestrate"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ComparativeAnalysisDisplayProps {
  analysis: string
  charts: ChartData[]
}

function ChartRenderer({ chartData }: { chartData: ChartData }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const renderChart = () => {
    try {
      const code = chartData.code

      // Detect chart type from code string
      if (code.includes("BarChart")) {
        return <BarChartComponent />
      } else if (code.includes("LineChart")) {
        return <LineChartComponent />
      } else if (code.includes("AreaChart")) {
        return <AreaChartComponent />
      }

      return <div className="text-sm text-muted-foreground p-4">Chart type not supported</div>
    } catch (err) {
      console.error("[v0] Error rendering chart:", err)
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

function BarChartComponent() {
  // Sample data for demonstration
  const data = [
    { name: "AAPL", Health: 0, Performance: 60, Sentiment: 50 },
    { name: "TSLA", Health: 0, Performance: 40, Sentiment: 25 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} />
        <YAxis type="category" dataKey="name" width={60} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Performance" fill="#8884d8" />
        <Bar dataKey="Sentiment" fill="#82ca9d" />
        <Bar dataKey="Health" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  )
}

function LineChartComponent() {
  // Sample data for demonstration
  const data = [
    { date: "2022-01", AAPL: 150, TSLA: 900 },
    { date: "2022-06", AAPL: 140, TSLA: 700 },
    { date: "2023-01", AAPL: 160, TSLA: 120 },
    { date: "2023-06", AAPL: 180, TSLA: 250 },
    { date: "2024-01", AAPL: 190, TSLA: 180 },
    { date: "2024-06", AAPL: 210, TSLA: 220 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="AAPL" stroke="#8884d8" />
        <Line type="monotone" dataKey="TSLA" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function AreaChartComponent() {
  const data = [
    { date: "2022-01", AAPL: 150, TSLA: 900 },
    { date: "2022-06", AAPL: 140, TSLA: 700 },
    { date: "2023-01", AAPL: 160, TSLA: 120 },
    { date: "2023-06", AAPL: 180, TSLA: 250 },
    { date: "2024-01", AAPL: 190, TSLA: 180 },
    { date: "2024-06", AAPL: 210, TSLA: 220 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="AAPL" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="TSLA" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function ComparativeAnalysisDisplay({ analysis, charts }: ComparativeAnalysisDisplayProps) {
  return (
    <div className="w-full space-y-6">
      <Card className="p-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground" {...props} />,
            h2: ({ node, ...props }) => (
              <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground border-b border-border pb-2" {...props} />
            ),
            h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold mt-6 mb-3 text-foreground" {...props} />,
            h4: ({ node, ...props }) => <h4 className="text-xl font-semibold mt-4 mb-2 text-foreground" {...props} />,
            h5: ({ node, ...props }) => <h5 className="text-lg font-semibold mt-3 mb-2 text-foreground" {...props} />,
            h6: ({ node, ...props }) => <h6 className="text-base font-semibold mt-2 mb-1 text-foreground" {...props} />,
            p: ({ node, ...props }) => <p className="text-foreground leading-relaxed mb-4" {...props} />,
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 ml-4 text-foreground" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-foreground" {...props} />
            ),
            li: ({ node, ...props }) => <li className="text-foreground" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
            em: ({ node, ...props }) => <em className="italic text-foreground" {...props} />,
            code: ({ node, inline, ...props }) =>
              inline ? (
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground" {...props} />
              ) : (
                <code
                  className="bg-muted p-4 rounded block text-sm font-mono text-foreground overflow-x-auto my-4"
                  {...props}
                />
              ),
            pre: ({ node, ...props }) => <pre className="bg-muted p-4 rounded overflow-x-auto my-4" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-blue-500 pl-4 italic text-muted-foreground my-4 py-2"
                {...props}
              />
            ),
            a: ({ node, ...props }) => (
              <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse border border-border" {...props} />
              </div>
            ),
            thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
            tbody: ({ node, ...props }) => <tbody {...props} />,
            tr: ({ node, ...props }) => <tr className="border-b border-border" {...props} />,
            th: ({ node, ...props }) => (
              <th
                className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground"
                {...props}
              />
            ),
            td: ({ node, ...props }) => <td className="border border-border px-4 py-2 text-foreground" {...props} />,
            hr: ({ node, ...props }) => <hr className="my-6 border-border" {...props} />,
          }}
        >
          {analysis}
        </ReactMarkdown>
      </Card>

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
